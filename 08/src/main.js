import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// ==========================================
// 1. SAHNE, KAMERA VE RENDERER KURULUMU
// ==========================================
const container = document.getElementById('app');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0c);
const camera = new THREE.PerspectiveCamera(
    45, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    100
);
camera.position.set(0, 2.5, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Fotogerçekçi renk yönetimi (Tone Mapping) ayarları
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
container.appendChild(renderer.domElement);
// ==========================================
// 2. KONTROLLER (ORBITCONTROLS)
// ==========================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.01; // Kameranın yerin altına girmesini engeller
controls.minDistance = 2;
controls.maxDistance = 10;
// ==========================================
// 3. PROSEDÜREL DÜŞÜK MALİYETLİ DÜŞÜŞ (FALLBACK) ÇEVRE HARİTASI
// ==========================================
// HDRI dosyası yüklenemezse veya gecikirse kullanılacak alternatif gradyan harita
function createProceduralEnvironment() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    // Dikey gradyan oluşturma (Stüdyo ışıklandırma simülasyonu)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffffff'); // Tavan ışığı
    gradient.addColorStop(0.3, '#3b82f6'); // Yumuşak mavi üst yansıma
    gradient.addColorStop(0.7, '#1e1e24'); // Koyu gri ufak hat
    gradient.addColorStop(1, '#050505'); // Zemin
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
}
// Başlangıçta prosedürel haritayı ata
const fallbackEnvMap = createProceduralEnvironment();
scene.environment = fallbackEnvMap;
// ==========================================
// 4. HDRI YÜKLEME İŞLEMİ (RGBELoader)
// ==========================================
const rgbeLoader = new RGBELoader();
// Örnek harici HDRI bağlantısı (Poly Haven ekosisteminden)
const hdriUrl = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr';
rgbeLoader.load(
    hdriUrl,
    (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        
        // Arka planı hafifçe bulanıklaştırarak HDRI'ı arka plana yerleştirme
        scene.background = texture;
        scene.backgroundBlurriness = 0.3;
        scene.backgroundIntensity = 0.5;
        console.log('HDRI başarıyla yüklendi ve sahneye uygulandı.');
    },
    (progress) => {
        if (progress.lengthComputable) {
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`HDRI Yükleniyor: %${percent.toFixed(1)}`);
        }
    },
    (error) => {
        console.warn('HDRI yüklenirken hata oluştu. Prosedürel çevre haritası kullanılıyor.', error);
    }
);
// ==========================================
// 5. NESNELER VE GELIŞMIŞ MATERYALLER
// ==========================================
// Podyum Zemin Materyali
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x111115,
    roughness: 0.1,
    metalness: 0.8
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);
// Ana Sergileme Grubu
const displayGroup = new THREE.Group();
scene.add(displayGroup);
// A) Metalik Dış Gövde (Otomobil Kaportası / Takı Gövdesi Simülasyonu)
const outerGeometry = new THREE.TorusKnotGeometry(0.6, 0.22, 128, 32);
const carPaintMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0284c7, // Safir Mavi
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 1.0, // Vernik Katmanı
    clearcoatRoughness: 0.05,
    reflectivity: 1.0
});
const outerMesh = new THREE.Mesh(outerGeometry, carPaintMaterial);
outerMesh.position.set(-1.2, 0.4, 0);
outerMesh.castShadow = true;
displayGroup.add(outerMesh);
// B) Kırılmalı Cam / Kristal Nesne (MeshPhysicalMaterial Transmisyon)
const glassGeometry = new THREE.IcosahedronGeometry(0.7, 0);
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.98, // Tam Saydamlık
    ior: 1.52, // Cam Kırılma İndeksi
    thickness: 1.2, // Nesne İç Kalınlığı (Işık Kırınımı İçin)
    specularIntensity: 1.0,
    transparent: true,
    opacity: 1.0
});
const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
glassMesh.position.set(1.2, 0.5, 0);
glassMesh.castShadow = true;
displayGroup.add(glassMesh);
// C) Altın Stüdyo Tabakası
const pedestalGeometry = new THREE.CylinderGeometry(2, 2.2, 0.2, 64);
const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 1.0,
    roughness: 0.25
});
const pedestal = new THREE.Mesh(pedestalGeometry, goldMaterial);
pedestal.position.y = -0.6;
pedestal.receiveShadow = true;
scene.add(pedestal);
// ==========================================
// 6. DESTEKLEYİCİ IŞIKLAR
// ==========================================
// HDRI ana aydınlatmayı sağlasa da yönlü vurgu ışıkları derinlik katar
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 8, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
fillLight.position.set(-5, 3, -2);
scene.add(fillLight);
// ==========================================
// 7. EKRAN BOYUTU GÜNCELLEMESİ (RESIZE)
// ==========================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// ==========================================
// 8. ANIMASYON DÖNGÜSÜ (RENDER LOOP)
// ==========================================
//const clock = new THREE.Clock();
const timer = new THREE.Timer();
function animate() {
    requestAnimationFrame(animate);
    //const elapsedTime = clock.getElapsedTime();
    timer.update();
    const elapsedTime = timer.getDelta();
    // Nesnelerin kendi ekseninde dönmesi
    outerMesh.rotation.x = elapsedTime * 0.3;
    outerMesh.rotation.y = elapsedTime * 0.5;
    glassMesh.rotation.x = -elapsedTime * 0.2;
    glassMesh.rotation.y = elapsedTime * 0.4;
    // Yumuşak dikey sallanma hareketi
    displayGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.05;
    // Kontrolleri güncelle
    controls.update();
    // Sahneyi çiz
    renderer.render(scene, camera);
}
animate();
