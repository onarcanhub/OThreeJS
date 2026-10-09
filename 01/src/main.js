import * as THREE from 'three';

// 1. SAHNE VE ARKA PLAN
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2e2a7a); //0x05050d);

// 2. KAMERA
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Kamerayı yukarıdan ve açılı bakacak şekilde konumlandırıyoruz
camera.position.set(0, 15, 25);
camera.lookAt(0, 0, 0);

// 3. İŞLEYİCİ (RENDERER)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// ==========================================
// HİYERARŞİK GÜNEŞ SİSTEMİ OLUŞTURMA (GROUPS)
// ==========================================

// 4.1. Güneş Sistemi Grubu (Tüm sistemin ebeveyni)
const solarSystemGroup = new THREE.Group();
scene.add(solarSystemGroup);

// 4.2. Güneş (Sun)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffcc00,
  wireframe: true // Yüzey çizgilerini görebilmek için
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
solarSystemGroup.add(sunMesh);

// 4.3. Dünya Yörünge Grubu (Dünya ve Ay'ın Güneş etrafında dönmesi için)
const earthOrbitGroup = new THREE.Group();
solarSystemGroup.add(earthOrbitGroup);

// 4.4. Dünya (Earth)
const earthGeometry = new THREE.SphereGeometry(0.8, 24, 24);
const earthMaterial = new THREE.MeshBasicMaterial({
  color: 0x2288ff,
  wireframe: true
});
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
// Dünyayı Güneş'ten X ekseninde 8 birim uzaklığa yerleştiriyoruz
earthMesh.position.x = 8;
earthOrbitGroup.add(earthMesh);

// 4.5. Ay Yörünge Grubu (Ay'ın Dünya etrafında dönmesi için)
const moonOrbitGroup = new THREE.Group();
// Ay grubunu Dünya'nın üzerine konumlandırıyoruz (Lokal pozisyon)
moonOrbitGroup.position.x = 8;
earthOrbitGroup.add(moonOrbitGroup);

// 4.6. Ay (Moon)
const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
const moonMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  wireframe: true
});
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
// Ay'ı Dünya merkezinden X ekseninde 2 birim uzağa yerleştiriyoruz
moonMesh.position.x = 2;
moonOrbitGroup.add(moonMesh);

// ==========================================
// 5. ANİMASYON DÖNGÜSÜ VE DÖNÜŞÜMLER
// ==========================================
function animate() {
  requestAnimationFrame(animate);

  // A) Kendi ekseninde dönmeler
  sunMesh.rotation.y += 0.005;   // Güneş'in kendi etrafında dönmesi
  earthMesh.rotation.y += 0.02;  // Dünya'nın kendi etrafında dönmesi

  // B) Yörünge dönmeleri (Grubun Y ekseninde dönmesi ile sağlanır)
  earthOrbitGroup.rotation.y += 0.01; // Dünya'nın Güneş etrafında dönmesi
  moonOrbitGroup.rotation.y += 0.04;  // Ay'ın Dünya etrafında dönmesi

  // C) Sahneyi çizdir
  renderer.render(scene, camera);
}

animate();

// ==========================================
// 6. EKRAN BOYUTU DEĞİŞİMİNE UYUM
// ==========================================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
