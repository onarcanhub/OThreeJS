//npm install lil-gui
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
/**
 * 1. Kurulum ve Sahne Yapılandırması
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0f19');
// GUI Arayüzü
const gui = new GUI({ title: 'Aydınlatma & Gölge Kontrolü' });
// Ekran Boyutları
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
/**
 * 2. Renderer (İşleyici) ve Gölge Ayarları
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Adım 1: Renderer üzerinde gölge haritalarını aktif et
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Yumuşak gölge tipi
/**
 * 3. Kamera ve Kontroller
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 4, 9);
scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
/**
 * 4. Materyaller ve Geometriler (Sahne Elemanları)
 */
// Standart Parlak Materyal
const mainMaterial = new THREE.MeshStandardMaterial({
  color: 0x3b82f6,
  roughness: 0.2,
  metalness: 0.5
});
// Zemin Materyali
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.8,
  metalness: 0.2
});
// Zemin (Ground Plane)
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  floorMaterial
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
// Adım 4: Zemin gölge alacak
floor.receiveShadow = true;
scene.add(floor);
// Ana Obje: TorusKnot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.2, 128, 32),
  mainMaterial
);
torusKnot.position.set(0, 1.5, 0);
// Adım 3: Obje gölge düşürecek ve kendi üstüne gölge alacak
torusKnot.castShadow = true;
torusKnot.receiveShadow = true;
scene.add(torusKnot);
// Yan Obje: Küre
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
);
sphere.position.set(-2, 0.5, 1);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);
/**
 * 5. Sinematik Üç Noktalı Aydınlatma (3-Point Lighting)
 */
// A) Key Light (Ana Işık) - Yönlü Işık
const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.5);
keyLight.position.set(3, 5, 2);
// Adım 2: Işığın gölge üretmesini sağla
keyLight.castShadow = true;
// Gölge Kalite ve Alan Ayarları (Optimizasyon)
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 12;
keyLight.shadow.camera.left = -4;
keyLight.shadow.camera.right = 4; //-4;
keyLight.shadow.camera.top = 4;
keyLight.shadow.camera.bottom = -4;
keyLight.shadow.bias = -0.0005; // Shadow Acne önleme
scene.add(keyLight);
// B) Fill Light (Dolgu Işığı) - Gölgeleri yumuşatan ortam/küresel ışık
const fillLight = new THREE.HemisphereLight(0x87ceeb, 0x111122, 0.8);
scene.add(fillLight);
// C) Back / Rim Light (Arka / Kenar Işığı) - Objeyi arka plandan ayıran Spot Light
const rimLight = new THREE.SpotLight(0x38bdf8, 4, 10, Math.PI * 0.15, 0.25, 1);
rimLight.position.set(-3, 4, -3);
rimLight.target = torusKnot;
rimLight.castShadow = true;
rimLight.shadow.mapSize.width = 1024;
rimLight.shadow.mapSize.height = 1024;
scene.add(rimLight);
// D) Dynamic Point Light (Hareketli Noktasal Işık)
const movingPointLight = new THREE.PointLight(0xf59e0b, 3, 8);
movingPointLight.castShadow = true;
movingPointLight.shadow.mapSize.width = 1024;
movingPointLight.shadow.mapSize.height = 1024;
scene.add(movingPointLight);
/**
 * 6. Light Helpers (Işık Yardımcıları)
 */
const keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 0.5);
const rimLightHelper = new THREE.SpotLightHelper(rimLight);
const pointLightHelper = new THREE.PointLightHelper(movingPointLight, 0.2);
scene.add(keyLightHelper);
scene.add(rimLightHelper);
scene.add(pointLightHelper);
// Görünürlüklerini varsayılan olarak kapatalım
keyLightHelper.visible = false;
rimLightHelper.visible = false;
pointLightHelper.visible = false;
/**
 * 7. GUI Kontrolleri
 */
const helpersFolder = gui.addFolder('Işık Yardımcıları');
helpersFolder.add(keyLightHelper, 'visible').name('Ana Işık Helper');
helpersFolder.add(rimLightHelper, 'visible').name('Kenar Işık Helper');
helpersFolder.add(pointLightHelper, 'visible').name('Nokta Işık Helper');
const lightsFolder = gui.addFolder('Işık Şiddetleri');
lightsFolder.add(keyLight, 'intensity').min(0).max(10).step(0.1).name('Ana Işık (Key)');
lightsFolder.add(fillLight, 'intensity').min(0).max(5).step(0.1).name('Dolgu (Fill)');
lightsFolder.add(rimLight, 'intensity').min(0).max(10).step(0.1).name('Kenar (Rim)');
lightsFolder.add(movingPointLight, 'intensity').min(0).max(10).step(0.1).name('Hareketli Işık');
/**
 * 8. Pencerelerin Yeniden Boyutlandırılması
 */
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * 9. Animasyon Döngüsü (Render Loop)
 */
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Ana Objenin Kendi Etrafında Dönmesi
  torusKnot.rotation.y = elapsedTime * 0.3;
  torusKnot.rotation.x = elapsedTime * 0.2;
  // Hareketli Noktasal Işığın Yörünge Hareketi
  movingPointLight.position.x = Math.sin(elapsedTime * 1.5) * 2.5;
  movingPointLight.position.z = Math.cos(elapsedTime * 1.5) * 2.5;
  movingPointLight.position.y = 1 + Math.sin(elapsedTime * 3) * 0.5;
  // SpotLight Helper Güncellemesi
  if (rimLightHelper.visible) {
    rimLightHelper.update();
  }
  // Kontrolleri Güncelle
  controls.update();
  // Sahneyi Çiz
  renderer.render(scene, camera);
  // Bir Sonraki Kare
  window.requestAnimationFrame(tick);
};
tick();

