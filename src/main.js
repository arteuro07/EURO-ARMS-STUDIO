import * as THREE from 'three';
import './style.css';
import { validateAudioTimeline, sceneAtTime, sceneProgress, smoothstep } from './pipeline/timeline.js';

const host = document.querySelector('#stage');
const state = document.querySelector('#render-state');
const sceneLabel = document.querySelector('#scene-label');
const sceneClock = document.querySelector('#scene-clock');
const syncStatus = document.querySelector('#sync-status');
const audioPlayer = document.querySelector('#narration-player');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#151d26');
scene.fog = new THREE.Fog('#151d26', 8, 19);

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(5.3, 3.1, 7.4);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc7d5e4, 0x28211a, 1.05));
const key = new THREE.DirectionalLight(0xffe2bd, 2.4);
key.position.set(-3.5, 6, 4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);
const fill = new THREE.PointLight(0x8ba9c8, 13, 12);
fill.position.set(4, 2, 2);
scene.add(fill);
const rim = new THREE.SpotLight(0xd7b889, 20, 18, Math.PI / 5, .5, 1);
rim.position.set(1, 5, -4);
scene.add(rim);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: '#171e26', roughness: .88, metalness: .08 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -.04;
floor.receiveShadow = true;
scene.add(floor);

const pedestal = new THREE.Group();
scene.add(pedestal);
const stone = new THREE.MeshStandardMaterial({ color: '#454b50', roughness: .42, metalness: .38 });
const bronze = new THREE.MeshStandardMaterial({ color: '#a98a60', roughness: .3, metalness: .72 });
const dark = new THREE.MeshStandardMaterial({ color: '#202a33', roughness: .32, metalness: .68 });
function block(w, h, d, mat, y) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.y = y;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  pedestal.add(mesh);
  return mesh;
}
block(2.7, .22, 1.8, stone, .12);
block(2.35, .08, 1.48, bronze, .27);
block(2.12, .62, 1.28, dark, .62);
block(2.22, .045, 1.38, bronze, .96);

// Sculptural study object for the preview; it is not a functional weapon model.
const artifact = new THREE.Group();
artifact.position.set(0, 1.55, 0);
pedestal.add(artifact);
const core = new THREE.Mesh(
  new THREE.TorusKnotGeometry(.48, .13, 120, 16, 2, 3),
  new THREE.MeshStandardMaterial({ color: '#a7adb0', metalness: .82, roughness: .24 })
);
core.rotation.x = Math.PI / 2.8;
core.castShadow = true;
artifact.add(core);
const ring = new THREE.Mesh(new THREE.TorusGeometry(.82, .018, 12, 96), bronze);
ring.rotation.x = Math.PI / 2;
artifact.add(ring);
const orb = new THREE.Mesh(
  new THREE.SphereGeometry(.11, 32, 24),
  new THREE.MeshStandardMaterial({ color: '#d5bd94', metalness: .6, roughness: .22, emissive: '#332414' })
);
orb.position.set(0, .6, 0);
artifact.add(orb);

// Fine floating dust adds depth without bright particles or excessive bloom.
const dustGeometry = new THREE.BufferGeometry();
const dustCount = 180;
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) {
  dustPositions[i * 3] = (Math.random() - .5) * 12;
  dustPositions[i * 3 + 1] = Math.random() * 5;
  dustPositions[i * 3 + 2] = (Math.random() - .5) * 9;
}
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({
  color: 0xb6a184, size: .018, transparent: true, opacity: .28, sizeAttenuation: true
}));
scene.add(dust);

const grid = new THREE.GridHelper(30, 50, 0x37414b, 0x28323c);
grid.position.y = -.025;
scene.add(grid);

// Each passage has its own camera composition and object movement.
const shotPresets = [
  { camera: [4.5, 2.7, 6.2], look: [0, 1.05, 0], rotation: -.15, scale: 1.00 },
  { camera: [-4.2, 2.0, 5.0], look: [0, .9, 0], rotation: .55, scale: 1.04 },
  { camera: [0.2, 4.2, 5.8], look: [0, 1.25, 0], rotation: 1.1, scale: 1.08 },
  { camera: [5.0, 1.8, 2.2], look: [0, 1.05, 0], rotation: 2.0, scale: 1.02 },
  { camera: [-3.4, 1.5, 3.1], look: [0, 1.45, 0], rotation: 2.7, scale: 1.13 },
  { camera: [0.0, 2.8, 7.2], look: [0, .8, 0], rotation: Math.PI * 2, scale: .94 }
];
let activeSceneIndex = -1;
let audioTimeline = null;
let audioUrl = null;
let timelineReady = false;
let audioReady = false;
let targetCamera = new THREE.Vector3(...shotPresets[0].camera);
let targetLook = new THREE.Vector3(...shotPresets[0].look);
let currentLook = new THREE.Vector3(0, .55, 0);
let targetRotation = shotPresets[0].rotation;
let targetScale = 1;

function updateSceneFromTime(seconds) {
  if (!audioTimeline) return;
  const cue = sceneAtTime(audioTimeline, seconds);
  if (!cue) return;
  const index = audioTimeline.indexOf(cue);
  if (index !== activeSceneIndex) {
    activeSceneIndex = index;
    const preset = shotPresets[index % shotPresets.length];
    targetCamera.set(...preset.camera);
    targetLook.set(...preset.look);
    targetRotation = preset.rotation;
    targetScale = preset.scale;
    sceneLabel.textContent = 'SCÈNE ' + String(index + 1).padStart(2, '0') + ' · ' + (cue.id || 'NARRATION').toUpperCase();
  }
  const progress = sceneProgress(cue, seconds);
  sceneClock.textContent = seconds.toFixed(1) + ' s / ' + cue.end.toFixed(1) + ' s';
  const eased = smoothstep(progress);
  artifact.userData.sceneProgress = eased;
}

function refreshSyncStatus() {
  if (audioReady && timelineReady) {
    syncStatus.textContent = 'Synchronisation prête · ' + audioTimeline.length + ' scènes · timecodes mesurés';
    state.textContent = 'TIMELINE AUDIO CHARGÉE';
    updateSceneFromTime(audioPlayer.currentTime || 0);
    return;
  }
  syncStatus.textContent = audioReady ? 'Audio chargé · ajoute maintenant timeline.json.' :
    timelineReady ? 'Timeline chargée · ajoute maintenant le WAV complet.' : 'Aucun audio chargé.';
}

document.querySelector('#audio-file').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(file);
  audioPlayer.src = audioUrl;
  audioReady = true;
  refreshSyncStatus();
});

document.querySelector('#timeline-file').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    audioTimeline = validateAudioTimeline(data);
    timelineReady = true;
    activeSceneIndex = -1;
    refreshSyncStatus();
  } catch (error) {
    timelineReady = false;
    audioTimeline = null;
    syncStatus.textContent = 'Timeline refusée : ' + error.message;
    state.textContent = 'ERREUR TIMELINE';
  }
});

audioPlayer.addEventListener('timeupdate', () => {
  if (audioTimeline) updateSceneFromTime(audioPlayer.currentTime);
});
audioPlayer.addEventListener('ended', () => {
  if (audioTimeline?.length) updateSceneFromTime(audioTimeline[audioTimeline.length - 1].end);
});

let dragging = false;
let lastX = 0;
let lastY = 0;
let targetRotY = 0;
let targetRotX = 0;
let currentRotY = 0;
let currentRotX = 0;
renderer.domElement.addEventListener('pointerdown', event => {
  if (audioReady && !audioPlayer.paused) return;
  dragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});
renderer.domElement.addEventListener('pointermove', event => {
  if (!dragging) return;
  targetRotY += (event.clientX - lastX) * .006;
  targetRotX = THREE.MathUtils.clamp(targetRotX + (event.clientY - lastY) * .003, -.35, .35);
  lastX = event.clientX;
  lastY = event.clientY;
});
function stopDragging() { dragging = false; }
renderer.domElement.addEventListener('pointerup', stopDragging);
renderer.domElement.addEventListener('pointercancel', stopDragging);
renderer.domElement.addEventListener('lostpointercapture', stopDragging);

const settings = { brightness: 100, contrast: 100, saturation: 100 };
function applyGrade() {
  renderer.toneMappingExposure = settings.brightness / 100;
  renderer.domElement.style.filter = `contrast(${settings.contrast}%) saturate(${settings.saturation}%)`;
  for (const name of Object.keys(settings)) {
    document.querySelector('#' + name + '-value').textContent = settings[name] + '%';
  }
}
for (const name of Object.keys(settings)) {
  document.querySelector('#' + name).addEventListener('input', event => {
    settings[name] = Number(event.target.value);
    applyGrade();
  });
}
document.querySelector('#reset').addEventListener('click', () => {
  for (const name of Object.keys(settings)) {
    settings[name] = 100;
    document.querySelector('#' + name).value = 100;
  }
  applyGrade();
});

function resize() {
  const width = Math.max(1, host.clientWidth);
  const height = Math.max(1, host.clientHeight);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(host);
resize();
state.textContent = 'APERÇU 3D · CHARGER LA TIMELINE AUDIO';

const clock = new THREE.Clock();
const cameraTarget = new THREE.Vector3();
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), .05);
  const elapsed = clock.elapsedTime;
  const damping = 1 - Math.exp(-3.8 * delta);

  if (!audioReady || !audioTimeline) {
    targetRotation += delta * .12;
    targetCamera.set(5.3 + Math.sin(elapsed * .12) * .35, 3.1, 7.4 + Math.cos(elapsed * .1) * .3);
  } else if (audioPlayer.paused && dragging) {
    targetRotation = targetRotY;
  }

  camera.position.lerp(targetCamera, damping);
  cameraTarget.lerp(targetLook, damping);
  camera.lookAt(cameraTarget);

  if (audioReady && audioTimeline) {
    pedestal.rotation.y += (targetRotation - pedestal.rotation.y) * damping;
    const p = artifact.userData.sceneProgress || 0;
    artifact.rotation.x = Math.sin(elapsed * .32) * .025 + p * .06;
    artifact.rotation.y = Math.sin(elapsed * .22) * .035;
    artifact.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), damping);
  } else {
    pedestal.rotation.y += (targetRotation - pedestal.rotation.y) * damping;
    artifact.rotation.x = currentRotX + Math.sin(elapsed * .45) * .025;
    artifact.rotation.y = Math.sin(elapsed * .3) * .055;
  }

  const positions = dust.geometry.attributes.position.array;
  for (let i = 0; i < dustCount; i++) {
    positions[i * 3 + 1] += delta * (.035 + (i % 5) * .008);
    if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0;
  }
  dust.geometry.attributes.position.needsUpdate = true;
  fill.position.x = 3.5 + Math.sin(elapsed * .18) * .5;
  rim.intensity = 18 + Math.sin(elapsed * .24) * 1.2;
  renderer.render(scene, camera);
});

applyGrade();
