import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// ==========================================
// 1. SAHNE, KAMERA VE RENDERER KURULUMU
// ==========================================
const container = document.getElementById('canvas-container');
const infoBox = document.getElementById('info-box');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0f172a');
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 4, 8);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);
// Kamera Kontrolleri (OrbitControls)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// ==========================================
// 2. IŞIKLANDIRMA
// ==========================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);
// ==========================================
// 3. ZEMİN VE ETKİLEŞİMLİ NESNELERİN OLUŞTURULMASI
// ==========================================
// Zemin
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);
// Performans için sadece etkileşime girecek nesneleri tutacağımız dizi
const interactableObjects = [];
// Geometri ve Materyal Tanımlamaları
const geometries = [
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.CylinderGeometry(0.6, 0.6, 1.4, 32),
  new THREE.TorusGeometry(0.6, 0.25, 16, 100)
];
const baseColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b];
const names = ['Kırmızı Küp', 'Mavi Küre', 'Yeşil Silindir', 'Turuncu Torus'];
// Nesneleri Sahneye Yan Yana Yerleştirme
for (let i = 0; i < 4; i++) {
  const material = new THREE.MeshStandardMaterial({
    color: baseColors[i],
    roughness: 0.3,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(geometries[i], material);
  mesh.position.set((i - 1.5) * 2.2, 1, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  // Nesne üzerine özel durum verileri ekleme
  mesh.userData = {
    id: i,
    name: names[i],
    baseColor: baseColors[i],
    hoverColor: 0xec4899, // Hover durumundaki pembe renk
    isClicked: false,
    originalScale: new THREE.Vector3(1, 1, 1),
    targetScale: new THREE.Vector3(1, 1, 1)
  };
  scene.add(mesh);
  interactableObjects.push(mesh); // Sadece bu diziyi Raycast edeceğiz
}
// ==========================================
// 4. RAYCASTING VE ETKİLEŞİM YÖNETİMİ
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-1000, -1000); // Başlangıçta ekran dışında
let hoveredObject = null;
// Fare Hareketi (Pointermove)
window.addEventListener('pointermove', (event) => {
  // 2D Ekran koordinatlarını NDC (-1 ile +1) formatına dönüştürme
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
// Tıklama Olayı (Pointerdown)
window.addEventListener('pointerdown', () => {
  if (hoveredObject) {
    const data = hoveredObject.userData;
    
    // Tıklama durumunu değiştir (Toggle)
    data.isClicked = !data.isClicked;
    if (data.isClicked) {
      // Tıklandığında ölçeği büyüt
      data.targetScale.set(1.3, 1.3, 1.3);
      infoBox.innerText = `Seçildi: ${data.name} (Aktif)`;
      infoBox.style.borderLeftColor = '#10b981';
    } else {
      // Tekrar tıklandığında normal ölçeğe dön
      data.targetScale.set(1, 1, 1);
      infoBox.innerText = `Seçim Kaldırıldı: ${data.name}`;
      infoBox.style.borderLeftColor = '#38bdf8';
    }
  }
});
// ==========================================
// 5. EKRAN BOYUTU GÜNCELLEME
// ==========================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// ==========================================
// 6. ANİMASYON VE RENDER DÖNGÜSÜ
// ==========================================
function animate() {
  requestAnimationFrame(animate);
  // OrbitControls güncellemesi
  controls.update();
  // Raycaster Işınını Kameradan Farenin Olduğu Yöne Ayarla
  raycaster.setFromCamera(mouse, camera);
  // Sadece etkileşimli nesneleri kapsayan dizide kesişim sorgula (PERFORMANS İPUCU)
  const intersects = raycaster.intersectObjects(interactableObjects, false);
  if (intersects.length > 0) {
    // Işının çarptığı ilk (en yakın) nesne
    const currentIntersected = intersects[0].object;
    if (hoveredObject !== currentIntersected) {
      // Önceki hover olan nesneyi eski haline getir
      if (hoveredObject) {
        hoveredObject.material.color.setHex(hoveredObject.userData.baseColor);
      }
      // Yeni nesneye hover uygula
      hoveredObject = currentIntersected;
      hoveredObject.material.color.setHex(hoveredObject.userData.hoverColor);
      document.body.style.cursor = 'pointer';
      
      if (!hoveredObject.userData.isClicked) {
        infoBox.innerText = `Üzerinde: ${hoveredObject.userData.name}`;
      }
    }
  } else {
    // Fare boşluğa geldiğinde hover durumunu sıfırla
    if (hoveredObject) {
      hoveredObject.material.color.setHex(hoveredObject.userData.baseColor);
      document.body.style.cursor = 'default';
      
      if (!hoveredObject.userData.isClicked) {
        infoBox.innerText = 'Seçilen Nesne: Yok';
        infoBox.style.borderLeftColor = '#38bdf8';
      }
    }
    hoveredObject = null;
  }
  // Nesne Ölçek (Scale) İnterpolasyonu (Pürüzsüz Geçiş / Lerp)
  interactableObjects.forEach((obj) => {
    obj.scale.lerp(obj.userData.targetScale, 0.1);
    
    // Yavaşça kendi ekseni etrafında döndürme
    obj.rotation.y += 0.005;
  });
  renderer.render(scene, camera);
}
// Animasyon Döngüsünü Başlat
animate();

