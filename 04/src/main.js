import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ==========================================
// 1. SAHNE, KAMERA VE RENDERER KURULUMU
// ==========================================

// Sahne Oluşturma
const scene = new THREE.Scene();
scene.background = new THREE.Color('#050508');

// Kamera Kurulumu (Perspektif)
const camera = new THREE.PerspectiveCamera(
  60, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);

camera.position.set(0, 5, 15);

// WebGL Renderer Kurulumu
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.id = 'webgl-canvas';
document.body.appendChild(renderer.domElement);

// OrbitControls Kurulumu (Kullanıcı İletileşimi)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// ==========================================
// 2. IŞIKLANDIRMA
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
pointLight.position.set(5, 8, 5);
scene.add(pointLight);

// ==========================================
// 3. GEOMETRİLER VE MESH GRUPLARI
// ==========================================

// Geometrilerin listesi ve parametreleri
const geometriesData = [
  { 
    geom: new THREE.BoxGeometry(2, 2, 2, 4, 4, 4), 
    name: 'BoxGeometry', 
    pos: [-6, 0, 0], 
    color: 0x6366f1 //blue
  },

  { 
    geom: new THREE.SphereGeometry(1.4, 16, 16), 
    name: 'SphereGeometry', 
    pos: [-2.4, 0, 0], 
    color: 0xec4899 //pink
  },

  { 
    geom: new THREE.CylinderGeometry(1, 1, 2.5, 16, 4), 
    name: 'CylinderGeometry', 
    pos: [1.2, 0, 0], 
    color: 0x10b981 //green
  },

  { 
    geom: new THREE.TorusGeometry(1.2, 0.4, 12, 24), 
    name: 'TorusGeometry', 
    pos: [4.8, 0, 0], 
    color: 0xffe599 // yellow 
  },

  { 

    geom: new THREE.ConeGeometry(1.2, 2.5, 16, 4), 
    name: 'ConeGeometry', 
    pos: [-4, 4, -2], 
    color: 0xeeeeee //gray 
  }

];

// Özel BufferGeometry Oluşturma (Üçgen)
const customGeometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -1.5, -1.0,  0.0,
   1.5, -1.0,  0.0,
   0.0,  1.5,  0.0
]);

customGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometriesData.push({
  geom: customGeometry,
  name: 'CustomBufferGeometry',
  pos: [2, 4, -2],
  color: 0x06b6d4
});

// Mesh Yapılarını Tutacak Dizi
const meshes = [];

// Geometrileri Sahneye Ekleme
geometriesData.forEach((item) => {
  // Katı (Solid) Malzeme
  const solidMaterial = new THREE.MeshStandardMaterial({
    color: item.color,
    roughness: 0.3,
    metalness: 0.2,
    flatShading: true
  });

  // Tel Kafes (Wireframe) Malzemesi
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });

  const solidMesh = new THREE.Mesh(item.geom, solidMaterial);

  const wireframeMesh = new THREE.Mesh(item.geom, wireframeMaterial);

  // İki Mesh'i bir grup içinde birleştirme
  const group = new THREE.Group();
  group.add(solidMesh);
  group.add(wireframeMesh);
  group.position.set(...item.pos);
  scene.add(group);

  meshes.push({
    group: group,
    solid: solidMesh,
    wireframe: wireframeMesh
  });
});

// Zemin Düzlemi (PlaneGeometry)
const planeGeometry = new THREE.PlaneGeometry(30, 30, 20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  wireframe: true
});

const floor = new THREE.Mesh(planeGeometry, planeMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.5;
scene.add(floor);

// ==========================================
// 4. ETKİLEŞİM VE GÖRÜNÜM MODLARI
// ==========================================

let displayMode = 0; // 0: Katı + Wireframe, 1: Sadece Katı, 2: Sadece Wireframe
const modeText = document.getElementById('mode-indicator');

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    displayMode = (displayMode + 1) % 3;
    meshes.forEach((item) => {
      if (displayMode === 0) {
        item.solid.visible = true;
        item.wireframe.visible = true;
        modeText.innerText = 'Mevcut Mod: Katı + Tel Kafes';

      } else if (displayMode === 1) {
        item.solid.visible = true;
        item.wireframe.visible = false;
        modeText.innerText = 'Mevcut Mod: Sadece Katı (Solid)';

      } else if (displayMode === 2) {
        item.solid.visible = false;
        item.wireframe.visible = true;
        modeText.innerText = 'Mevcut Mod: Sadece Tel Kafes (Wireframe)';
      }

    });

  }

});

// Pencere Boyutu Değişimi Yönetimi
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 5. ANİMASYON DÖNGÜSÜ (ANIMATION LOOP)
// ==========================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // Objelere Dönme ve Yüzme Efekti Verme
  meshes.forEach((item, index) => {
    item.group.rotation.x = elapsedTime * 0.3 * (index % 2 === 0 ? 1 : -1);
    item.group.rotation.y = elapsedTime * 0.4;
    item.group.position.y = item.group.position.y + Math.sin(elapsedTime * 2 + index) * 0.003;
  });

  // Kontrolleri ve Sahneyi Güncelleme
  controls.update();

  renderer.render(scene, camera);

}

animate();
