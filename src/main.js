import * as THREE from 'three';
import './style.css';

const host = document.querySelector('#stage');
const state = document.querySelector('#render-state');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#151d26');
scene.fog = new THREE.Fog('#151d26', 8, 19);

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(5.3, 3.1, 7.4);
camera.lookAt(0, 0.55, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xc7d5e4, 0x28211a, 1.15));
const key = new THREE.DirectionalLight(0xffe2bd, 3.0);
key.position.set(-3.5, 6, 4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);
const fill = new THREE.PointLight(0x8ba9c8, 18, 12);
fill.position.set(4, 2, 2);
scene.add(fill);
const rim = new THREE.SpotLight(0xd7b889, 28, 18, Math.PI / 5, .5, 1);
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

// Abstract museum artefact: deliberately non-functional sculptural forms.
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

const grid = new THREE.GridHelper(30, 50, 0x37414b, 0x28323c);
grid.position.y = -.025;
scene.add(grid);

// Pointer input changes targets; the displayed rotation eases toward them.
let dragging = false;
let lastX = 0;
let lastY = 0;
let targetRotY = 0;
let targetRotX = 0;
let currentRotY = 0;
let currentRotX = 0;

renderer.domElement.addEventListener('pointerdown', event => {
  dragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});
renderer.domElement.addEventListener('pointermove', event => {
  if (!dragging) return;
  targetRotY += (event.clientX - lastX) * .006;
  targetRotX = THREE.MathUtils.clamp(
    targetRotX + (event.clientY - lastY) * .003,
    -.35,
    .35
  );
  lastX = event.clientX;
  lastY = event.clientY;
});
function stopDragging() {
  dragging = false;
}
renderer.domElement.addEventListener('pointerup', stopDragging);
renderer.domElement.addEventListener('pointercancel', stopDragging);
renderer.domElement.addEventListener('lostpointercapture', stopDragging);

const settings = { brightness: 100, contrast: 100, saturation: 100 };
function applyGrade() {
  const b = settings.brightness / 100;
  const c = settings.contrast / 100;
  const s = settings.saturation / 100;
  renderer.toneMappingExposure = b;
  renderer.domElement.style.filter = `contrast(${c * 100}%) saturate(${s * 100}%)`;
  for (const name of ['brightness', 'contrast', 'saturation']) {
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

state.textContent = 'RENDU 3D · THREE.JS';

// Delta-time animation keeps movement consistent across different frame rates.
// Damping smooths both idle movement and touch/mouse interaction without adding lag.
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), .05);
  const elapsed = clock.elapsedTime;

  if (!dragging) targetRotY += delta * .16;

  const easing = 1 - Math.exp(-7 * delta);
  currentRotY += (targetRotY - currentRotY) * easing;
  currentRotX += (targetRotX - currentRotX) * easing;

  pedestal.rotation.y = currentRotY;
  artifact.rotation.x = currentRotX + Math.sin(elapsed * .45) * .025;
  artifact.rotation.y = Math.sin(elapsed * .3) * .055;

  renderer.render(scene, camera);
});

applyGrade();
