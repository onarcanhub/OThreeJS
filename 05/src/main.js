import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// ==========================================
// 1. SAHNE, KAMERA VE RENDERER KURULUMU
// ==========================================
// Tuval (Canvas) Seçimi
const canvas = document.querySelector('canvas.webgl');
// Sahne Oluşturma
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0f172a');
// Ekran Boyutları
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};
// Perspektif Kamera Kurulumu
const camera = new THREE.PerspectiveCamera(
  45, 
  sizes.width / sizes.height, 
  0.1, 
  100
);
camera.position.set(0, 4, 12);
scene.add(camera);
// WebGL Renderer Kurulumu
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true // Kenar yumuşatma
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true; // Gölge haritalarını aktif et
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// ==========================================
// 2. KONTROLLER (OrbitControls)
// ==========================================
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Yumuşak duruş efekti
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05; // Yerin altına girmeyi engelle
// ==========================================
// 3. AYDINLATMA (LIGHTING)
// ==========================================
// Ortam Işığı (Ambient Light) - Genel Temel Aydınlatma
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
// Yönlü Işık (Directional Light) - Ana Işık Kaynağı (Güneş Etkisi)
const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(5, 8, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.bias = -0.0001;
scene.add(mainLight);
// Dolgu Işığı (Point Light) - Renkli Detay Aydınlatması
const pointLight = new THREE.PointLight(0x38bdf8, 2, 10);
pointLight.position.set(-4, 2, -1);
scene.add(pointLight);
// ==========================================
// 4. ZEMİN VE ARKA PLAN ELEMANLARI
// ==========================================
// Zemin Geometrisi ve Materyali
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x727f8f,  // #1e293b,
  roughness: 0.4,
  metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);
// ==========================================
// 5. MATERYAL SHOWROOM NESNELERİ
// ==========================================
// Ortak Geometri (Küre)
const sphereGeometry = new THREE.SphereGeometry(0.9, 64, 64);
// ------------------------------------------
// MATERYAL 1: Cam (Glass) - MeshPhysicalMaterial
// ------------------------------------------
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.0,
  roughness: 0.05,
  transmission: 0.95, // Yüksek ışık geçirgenliği
  ior: 1.5,          // Cam için fiziksel kırılma indisi
  thickness: 0.5,    // Kırılma kalınlığı
  transparent: true,
  opacity: 1.0
});
const glassSphere = new THREE.Mesh(sphereGeometry, glassMaterial);
glassSphere.position.set(-4.5, 0, 0);
glassSphere.castShadow = true;
scene.add(glassSphere);
// ------------------------------------------
// MATERYAL 2: Metal (Krom/Çelik) - MeshStandardMaterial
// ------------------------------------------
const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  metalness: 1.0,    // Tam metalik
  roughness: 0.15    // Pürüzsüz, parlak yansıma
});
const metalSphere = new THREE.Mesh(sphereGeometry, metalMaterial);
metalSphere.position.set(-1.5, 0, 0);
metalSphere.castShadow = true;
metalSphere.receiveShadow = true;
scene.add(metalSphere);
// ------------------------------------------
// MATERYAL 3: Cilalı Plastik (Clearcoat Plastic) - MeshPhysicalMaterial
// ------------------------------------------
const plasticMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xef4444,    // Kırmızı tonu
  metalness: 0.0,
  roughness: 0.5,     // Temelde mat plastik
  clearcoat: 1.0,     // Üzerinde şeffaf cila katmanı
  clearcoatRoughness: 0.1
});
const plasticSphere = new THREE.Mesh(sphereGeometry, plasticMaterial);
plasticSphere.position.set(1.5, 0, 0);
plasticSphere.castShadow = true;
plasticSphere.receiveShadow = true;
scene.add(plasticSphere);
// ------------------------------------------
// MATERYAL 4: Ahşap / Mat Yüzey - MeshLambertMaterial
// ------------------------------------------
const matteMaterial = new THREE.MeshLambertMaterial({
  color: 0xd97706,   // Ahşap/Toprak tonu
  wireframe: false
});
const matteSphere = new THREE.Mesh(sphereGeometry, matteMaterial);
matteSphere.position.set(4.5, 0, 0);
matteSphere.castShadow = true;
matteSphere.receiveShadow = true;
scene.add(matteSphere);
// ==========================================
// 6. ANIMASYON VE RENDER DÖNGÜSÜ
// ==========================================
const clock = new THREE.Clock();
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  // Kürelerin hafifçe kendi eksenlerinde ve dikeyde hareketi
  glassSphere.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
  metalSphere.position.y = Math.sin(elapsedTime * 1.5 + 1) * 0.1;
  plasticSphere.position.y = Math.sin(elapsedTime * 1.5 + 2) * 0.1;
  matteSphere.position.y = Math.sin(elapsedTime * 1.5 + 3) * 0.1;
  metalSphere.rotation.y = elapsedTime * 0.2;
  plasticSphere.rotation.y = elapsedTime * 0.2;
  // Kontrolleri güncelle
  controls.update();
  // Sahneyi Yeniden Çiz
  renderer.render(scene, camera);
  // Bir sonraki kare için fonksiyonu çağır
  window.requestAnimationFrame(animate);
};
animate();
// ==========================================
// 7. EKRAN BOYUTU DEĞİŞİMİ (RESIZE) YÖNETİMİ
// ==========================================
window.addEventListener('resize', () => {
  // Boyutları Güncelle
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Kamerayı Güncelle
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Renderer'ı Güncelle
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
