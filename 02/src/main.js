import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. SAHNE OLUŞTURMA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);

// 2. EKRAN BOYUTLARI VE PARAMETRELER
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth / window.innerHeight
};

// 3. KAMERANIN HAZIRLANMASI

// A) Perspektif Kamera (Varsayılan)
const perspectiveCamera = new THREE.PerspectiveCamera(60, sizes.aspect, 0.1, 100);
perspectiveCamera.position.set(4, 3, 5);

// B) Ortografik Kamera
const frustumSize = 6;
const orthographicCamera = new THREE.OrthographicCamera(
  (frustumSize * sizes.aspect) / -2,
  (frustumSize * sizes.aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  100
);
orthographicCamera.position.set(4, 3, 5);

// Aktif olarak kullanılan kamera referansı
let activeCamera = perspectiveCamera;

// 4. İŞLEYİCİ (RENDERER)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 5. ORBIT CONTROLS ENTEGRASYONU
let controls = new OrbitControls(activeCamera, renderer.domElement);
controls.enableDamping = true;      // Yumuşak kamera sönümlemesi
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // Kameranın yerin altına girmesini engeller

// 6. SAHNE ELEMANLARI (Ürün Stant Modeli)
// 6.1. Zemin / Stant
const floorGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 32);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x334155, wireframe: true });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
scene.add(floor);

// 6.2. Merkezdeki Ürün Nesnesi (Soyut Şekil)
const productGroup = new THREE.Group();

const coreGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);

const ringGeometry = new THREE.TorusGeometry(1.5, 0.08, 16, 100);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true });
const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
ringMesh.rotation.x = Math.PI / 2;

productGroup.add(coreMesh);
productGroup.add(ringMesh);
productGroup.position.y = 1;
scene.add(productGroup);

// 7. KAMERA DEĞİŞTİRME BUTON MANTIĞI
const btn = document.getElementById('toggle-camera-btn');
btn.addEventListener('click', () => {
  if (activeCamera === perspectiveCamera) {
    // Ortografik kameraya geçiş
    activeCamera = orthographicCamera;
    btn.textContent = 'Perspektif Kameraya Geç';
  } else {
    // Perspektif kameraya geçiş
    activeCamera = perspectiveCamera;
    btn.textContent = 'Ortografik Kameraya Geç';
  }

  // Kontrolleri yeni aktif kameraya bağlama
  controls.dispose(); // Eski kontrolü temizle
  controls = new OrbitControls(activeCamera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
});

// 8. EKRAN BOYUTU DEĞİŞİMİ (RESPONSIVE)
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.aspect = sizes.width / sizes.height;

  // Perspektif kamera güncelleme
  perspectiveCamera.aspect = sizes.aspect;
  perspectiveCamera.updateProjectionMatrix();

  // Ortografik kamera güncelleme
  orthographicCamera.left = (frustumSize * sizes.aspect) / -2;
  orthographicCamera.right = (frustumSize * sizes.aspect) / 2;
  orthographicCamera.top = frustumSize / 2;
  orthographicCamera.bottom = frustumSize / -2;
  orthographicCamera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 9. ANİMASYON DÖNGÜSÜ
function animate() {
  requestAnimationFrame(animate);

  // Ürünün kendi etrafında dönmesi
  productGroup.rotation.y += 0.008;

  // OrbitControls yumuşak hareket (damping) güncellemesi
  controls.update();

  renderer.render(scene, activeCamera);
}

animate();
