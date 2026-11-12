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
// Silhouette muséale simplifiée du Desert Eagle : représentation visuelle
// non fonctionnelle, sans coupe interne ni détail de fabrication.
const steel = new THREE.MeshStandardMaterial({ color: '#8d969b', metalness: .86, roughness: .28 });
const steelDark = new THREE.MeshStandardMaterial({ color: '#343c42', metalness: .72, roughness: .34 });
const gripMat = new THREE.MeshStandardMaterial({ color: '#302b26', metalness: .18, roughness: .78 });
const goldLine = new THREE.MeshStandardMaterial({ color: '#b69a70', metalness: .72, roughness: .3 });
const profile = new THREE.Shape();
profile.moveTo(-1.18, .12);
profile.lineTo(-1.12, .48);
profile.lineTo(-.92, .58);
profile.lineTo(.98, .58);
profile.lineTo(1.28, .48);
profile.lineTo(1.34, .28);
profile.lineTo(1.18, .16);
profile.lineTo(.24, .13);
profile.lineTo(-.16, .03);
profile.lineTo(-.20, -.42);
profile.lineTo(-.48, -.88);
profile.lineTo(-.91, -.78);
profile.lineTo(-.78, -.05);
profile.lineTo(-1.05, -.02);
profile.closePath();
const body = new THREE.Mesh(new THREE.ExtrudeGeometry(profile, {
  depth: .25, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .035, bevelThickness: .035
}), steel);
body.position.z = -.125;
body.castShadow = true;
artifact.add(body);
const slide = new THREE.Mesh(new THREE.BoxGeometry(1.72, .12, .29), steelDark);
slide.position.set(-.02, .49, 0);
slide.castShadow = true;
artifact.add(slide);
const barrelAccent = new THREE.Mesh(new THREE.CylinderGeometry(.105, .105, .035, 32), steelDark);
barrelAccent.rotation.x = Math.PI / 2;
barrelAccent.position.set(1.25, .35, .145);
artifact.add(barrelAccent);
const gripPanel = new THREE.Mesh(new THREE.BoxGeometry(.37, .55, .035), gripMat);
gripPanel.position.set(-.62, -.39, .155);
gripPanel.rotation.z = -.18;
artifact.add(gripPanel);
const trim = new THREE.Mesh(new THREE.BoxGeometry(1.35, .018, .012), goldLine);
trim.position.set(-.02, .405, .16);
artifact.add(trim);
const museumRing = new THREE.Mesh(new THREE.TorusGeometry(.88, .012, 10, 100), bronze);
museumRing.rotation.x = Math.PI / 2;
museumRing.position.y = .12;
artifact.add(museumRing);

// Six distinct miniature environments: workshop, archive, 1983 launch,
// large-calibre era, videogame contrast, and closing museum portrait.
const environments = [];
const makeEnvironment = (index) => {
  const group = new THREE.Group();
  scene.add(group);
  const wallMat = new THREE.MeshStandardMaterial({
    color: ['#40362d','#28313a','#343a3d','#382f2b','#172d3a','#252d34'][index],
    roughness: .92, metalness: .04
  });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(12, 7), wallMat);
  wall.position.set(0, 2.8, -3.4);
  group.add(wall);
  const frameMat = new THREE.MeshStandardMaterial({
    color: ['#8e6c48','#75818a','#b08a58','#9a7959','#4c829a','#b59b75'][index],
    metalness: .5, roughness: .48
  });
  for (let j = 0; j < 3; j++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(2.1, .035, .05), frameMat);
    bar.position.set(-2.5 + j * 2.5, 1.2 + (j % 2) * .65, -3.25);
    group.add(bar);
  }
  const glow = new THREE.PointLight(
    ['#d49a5e','#9aafc1','#e2bd83','#d39a67','#4d9ec4','#d9c19a'][index],
    [10,7,12,11,8,13][index], 8
  );
  glow.position.set(index % 2 ? -2.4 : 2.4, 2.6, -1.7);
  group.add(glow);
  // Animated vertical dust motes and archival light strips are deliberately subtle.
  const strip = new THREE.Mesh(new THREE.BoxGeometry(.025, 2.4, .025), frameMat);
  strip.position.set(index - 2.5, 1.5, -3.15);
  group.add(strip);

  // Accessoires narratifs propres à chaque époque : aucun élément mécanique fonctionnel.
  const props = new THREE.Group();
  group.add(props);
  const accent = new THREE.MeshStandardMaterial({
    color: ['#76563a','#71808c','#b08a58','#8e7051','#36738d','#b59b75'][index],
    metalness: .42, roughness: .56
  });
  const muted = new THREE.MeshStandardMaterial({ color: '#202831', roughness: .86 });
  if (index === 0) {
    const bench = new THREE.Mesh(new THREE.BoxGeometry(4.8,.18,1.1), muted);
    bench.position.set(0,.38,-1.8); props.add(bench);
    for (let x of [-1.9,1.9]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(.12,.75,.12), accent);
      leg.position.set(x,.02,-1.8); props.add(leg);
    }
    const lamp = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025,.04,.8,12), accent);
    stem.position.y=.4; lamp.add(stem);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.25,.22,24,1,true), accent);
    shade.position.set(0,.82,0); shade.rotation.x=Math.PI; lamp.add(shade);
    lamp.position.set(-1.7,1.0,-1.65); props.add(lamp);
    group.userData.movingProp = lamp;
  } else if (index === 1) {
    for (let n=0;n<4;n++) {
      const sheet = new THREE.Mesh(new THREE.PlaneGeometry(.72,.94), accent);
      sheet.position.set(-1.5+n*.95,1.0+n*.18,-2.1);
      sheet.rotation.y=(n-1.5)*.12; props.add(sheet);
    }
    group.userData.movingProp = props;
  } else if (index === 2) {
    for (let n=0;n<3;n++) {
      const halo = new THREE.Mesh(new THREE.TorusGeometry(.8+n*.38,.018,8,72), accent);
      halo.position.set(0,1.5,-1.9+n*.08);
      props.add(halo);
    }
    group.userData.movingProp = props;
  } else if (index === 3) {
    for (let n=0;n<5;n++) {
      const marker = new THREE.Mesh(new THREE.BoxGeometry(.12,.35+n*.12,.12), accent);
      marker.position.set(-1.2+n*.6,.18+(n*.06),-2.0);
      props.add(marker);
    }
    group.userData.movingProp = props;
  } else if (index === 4) {
    const portal = new THREE.Mesh(new THREE.TorusGeometry(1.05,.045,12,80), accent);
    portal.position.set(0,1.55,-2.0); props.add(portal);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(.72,.018,8,80), frameMat);
    inner.position.copy(portal.position); props.add(inner);
    group.userData.movingProp = props;
  } else {
    for (let n=0;n<3;n++) {
      const column = new THREE.Mesh(new THREE.BoxGeometry(.045,3.1,.045), accent);
      column.position.set(-1.8+n*1.8,1.55,-2.3); props.add(column);
    }
    group.userData.movingProp = props;
  }
  group.userData.glow = glow;
  group.userData.strip = strip;
  group.visible = index === 0;
  environments.push(group);
};
for (let i = 0; i < 6; i++) makeEnvironment(i);

for (let i = 0; i < 6; i++) makeEnvironment(i);

// Cartouches éditoriaux dessinés en haute résolution : repères historiques
// lisibles dans chaque plan, sans fausses inscriptions générées.
const sceneTitles = [
  ["1979", "LE PROJET PREND FORME", "MAGNUM RESEARCH"],
  ["FIN DES ANNÉES 1970", "UNE IDÉE HORS NORME", "ARCHIVES DE CONCEPTION"],
  ["CONCEPTION", "UN FONCTIONNEMENT INHABITUEL", "ILLUSTRATION DE PRINCIPE"],
  ["1983", "LE MARK I .357 MAGNUM", "PREMIER MODÈLE COMMERCIAL"],
  ["ANNÉES 1990", "LE .50 ACTION EXPRESS", "UNE NOUVELLE DIMENSION"],
  ["HISTOIRE RÉELLE", "UNE ICÔNE DU JEU VIDÉO", "RÉEL ≠ FICTION"]
];
const titleCards = [];
sceneTitles.forEach((lines, index) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(13, 19, 25, 0.82)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#c7a879';
  ctx.fillRect(42, 34, 5, 188);
  ctx.textBaseline = 'middle';
  ctx.font = '500 26px monospace';
  ctx.fillStyle = '#c7a879';
  ctx.fillText(lines[0], 76, 63);
  ctx.font = '700  forty eight px sans-serif'.replace('forty eight', '48');
  ctx.fillStyle = '#f0eee8';
  ctx.fillText(lines[1], 76, 132);
  ctx.font = '22px monospace';
  ctx.fillStyle = '#aeb8c0';
  ctx.fillText(lines[2], 78, 190);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 0.94, depthWrite: false
  });
  const card = new THREE.Mesh(new THREE.PlaneGeometry(3.7, .925), material);
  card.position.set(-1.85, 2.65, -2.95);
  card.visible = index === 0;
  scene.add(card);
  titleCards.push(card);
});

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
let activeCue = null;
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
  activeCue = cue;
  if (index !== activeSceneIndex) {
    activeSceneIndex = index;
    const preset = shotPresets[index % shotPresets.length];
    environments.forEach((environment, sceneIndex) => { environment.visible = sceneIndex === index % environments.length; });
    titleCards.forEach((card, cardIndex) => { card.visible = cardIndex === index % titleCards.length; });
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

  const p = audioReady && audioTimeline ? (artifact.userData.sceneProgress || 0) : 0;
  const shotIndex = Math.max(0, activeSceneIndex);
  const shotPhase = p * Math.PI;
  const cameraDrift = new THREE.Vector3(
    Math.sin(shotPhase) * (shotIndex === 4 ? .34 : .16),
    Math.sin(shotPhase * 2) * .07,
    Math.cos(shotPhase) * (shotIndex === 5 ? .42 : -.12)
  );
  const cameraDesired = targetCamera.clone().add(cameraDrift);
  camera.position.lerp(cameraDesired, damping);
  const lookDrift = new THREE.Vector3(Math.sin(shotPhase) * .08, Math.sin(shotPhase) * .035, 0);
  cameraTarget.lerp(targetLook.clone().add(lookDrift), damping);
  camera.lookAt(cameraTarget);

  if (audioReady && audioTimeline) {
    pedestal.rotation.y += (targetRotation - pedestal.rotation.y) * damping;
    const sceneIndex = Math.max(0, activeSceneIndex);
    artifact.position.set(
      Math.sin(shotPhase) * (sceneIndex === 1 ? .14 : .045),
      1.55 + (sceneIndex === 0 ? -.34 * (1 - smoothstep(p)) : Math.sin(shotPhase) * .045),
      0
    );
    artifact.rotation.x = Math.sin(elapsed * .32) * .018 + (sceneIndex === 2 ? Math.sin(shotPhase) * .045 : 0);
    artifact.rotation.y = Math.sin(elapsed * .18) * .018 + (sceneIndex === 3 ? p * .22 : sceneIndex === 4 ? -p * .12 : 0);
    artifact.rotation.z = sceneIndex === 1 ? Math.sin(shotPhase) * .025 : 0;
    const env = environments[activeSceneIndex % environments.length];
    const titleCard = titleCards[activeSceneIndex % titleCards.length];
    if (titleCard) {
      titleCard.position.y = 2.65 + Math.sin(elapsed * .55) * .018;
      titleCard.material.opacity = .88 + Math.sin(elapsed * .7) * .035;
    }
    if (env) {
      env.userData.strip.position.y = 1.5 + Math.sin(elapsed * .5) * .12;
      env.userData.glow.intensity = 8 + Math.sin(elapsed * .7) * 1.1;
      const prop = env.userData.movingProp;
      if (prop) {
        prop.rotation.y = Math.sin(elapsed * .22 + activeSceneIndex) * .045;
        prop.position.y = Math.sin(elapsed * .48 + activeSceneIndex) * .035;
      }
    }
    const sceneScale = targetScale * (sceneIndex === 4 ? 1 + Math.sin(shotPhase) * .035 : sceneIndex === 5 ? 1 - p * .055 : 1);
    artifact.scale.lerp(new THREE.Vector3(sceneScale, sceneScale, sceneScale), damping);
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
