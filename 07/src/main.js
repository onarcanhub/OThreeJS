import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
/**
 * 1. PROSEDÜREL PBR DOKU ÜRETİCİLERİ (Canvas Texture Generator)
 * Harici dosya bağımlılığını ortadan kaldırmak için canvas üzerinde PBR haritaları simüle edilir.
 */
// Color / Albedo Map Oluşturucu
function createProceduralColorCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    // Temel Taş Rengi Zemin
    ctx.fillStyle = '#6e6e6e';
    ctx.fillRect(0, 0, 512, 512);
    // Gürültü ve Taş Desenleri
    for (let i = 0; i < 8000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 3 + 1;
        const colorVal = Math.floor(Math.random() * 60 + 80);
        ctx.fillStyle = `rgb(${colorVal}, ${colorVal}, ${colorVal})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    return canvas;
}
// Normal Map Oluşturucu (RGB: Yüzey Açıları)
function createProceduralNormalCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    // Varsayılan Düz Normal Rengi (RGB: 128, 128, 255)
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, 512, 512);
    // Pürüz Derinlik Eğrileri
    for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const rx = Math.floor(Math.random() * 100 + 100);
        const ry = Math.floor(Math.random() * 100 + 100);
        ctx.fillStyle = `rgb(${rx}, ${ry}, 230)`;
        ctx.fillRect(x, y, 4, 4);
    }
    return canvas;
}
// Roughness Map Oluşturucu (Siyah: Parlak, Beyaz: Mat)
function createProceduralRoughnessCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    // Orta Düzey Pürüzlülük Grisi
    ctx.fillStyle = 'rgb(180, 180, 180)';
    ctx.fillRect(0, 0, 512, 512);
    // Parlak ve Mat Lekeler
    for (let i = 0; i < 400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 20 + 5;
        const val = Math.floor(Math.random() * 120 + 100);
        ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    return canvas;
}
/**
 * 2. SAHNE, KAMERA VE RENDERER KURULUMU
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0f19');
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(3, 2, 4);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);
/**
 * 3. LOADING MANAGER VE KAPLAMA YÜKLEME SİMÜLASYONU
 */
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const loadingManager = new THREE.LoadingManager(
    // Yükleme Tamamlandığında
    () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => loadingOverlay.remove(), 500);
        }, 400);
    },
    // İlerleme Durumu
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progress = Math.round((itemsLoaded / itemsTotal) * 100);
        loadingText.innerText = `Kaplamalar Oluşturuluyor... %${progress}`;
    }
);
// Prosedürel Dokuları CanvasTexture ile Three.js'e Aktarma
const colorCanvas = createProceduralColorCanvas();
const normalCanvas = createProceduralNormalCanvas();
const roughnessCanvas = createProceduralRoughnessCanvas();
const colorTexture = new THREE.CanvasTexture(colorCanvas);
const normalTexture = new THREE.CanvasTexture(normalCanvas);
const roughnessTexture = new THREE.CanvasTexture(roughnessCanvas);
// Canvas Yüklemelerini LoadingManager Takibine Bildirme Simülasyonu
loadingManager.itemStart('colorTexture');
loadingManager.itemStart('normalTexture');
loadingManager.itemStart('roughnessTexture');
setTimeout(() => loadingManager.itemEnd('colorTexture'), 200);
setTimeout(() => loadingManager.itemEnd('normalTexture'), 400);
setTimeout(() => loadingManager.itemEnd('roughnessTexture'), 600);
/**
 * 4. KAPLAMA DÖNÜŞÜMLERİ VE FİLTRELEME (TRANSFORMS & FILTERING)
 */
const textures = [colorTexture, normalTexture, roughnessTexture];
textures.forEach((texture) => {
    // Repeat (Tekrarlama) ayarları
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    // Filtreleme Ayarları (Kalite ve Performans Optimization)
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
});
/**
 * 5. IŞIKLANDIRMA (LIGHTING)
 * PBR materyallerin detaylarını gösterebilmesi için doğru ışıklandırma şarttır.
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0x0ea5e9, 2, 10);
pointLight.position.set(-2, 1, 2);
scene.add(pointLight);
/**
 * 6. GEOMETRİ VE PBR MATERYAL OLUŞTURMA
 */
// Küre Geometrisi (Sphere)
const sphereGeometry = new THREE.SphereGeometry(1.2, 64, 64);
// aoMap için gerekli olan ikinci UV koordinat setini kopyalama
sphereGeometry.attributes.uv2 = sphereGeometry.attributes.uv;
// PBR Material (MeshStandardMaterial)
const pbrMaterial = new THREE.MeshStandardMaterial({
    map: colorTexture,                  // Albedo / Color Map
    normalMap: normalTexture,          // Normal Map
    normalScale: new THREE.Vector2(1.5, 1.5), // Normal derinlik çarpanı
    roughnessMap: roughnessTexture,    // Roughness Map
    roughness: 0.8,                     // Genel pürüzlülük çarpanı
    metalness: 0.1                      // Yalıtkan yüzey
});
const sphereMesh = new THREE.Mesh(sphereGeometry, pbrMaterial);
sphereMesh.position.x = -1.5;
scene.add(sphereMesh);
// Küp Geometrisi (Box)
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
boxGeometry.attributes.uv2 = boxGeometry.attributes.uv;
const boxMesh = new THREE.Mesh(boxGeometry, pbrMaterial);
boxMesh.position.x = 1.5;
scene.add(boxMesh);
/**
 * 7. KONTROLLER VE ETKİLEŞİM (OrbitControls)
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
/**
 * 8. EKRAN BOYUTU GÜNCELLEMESİ (RESIZE HANDLING)
 */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * 9. ANIMASYON VE RENDER DÖNGÜSÜ (ANIMATION LOOP)
 */
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    // Nesneleri Kendi Ekseninde Döndürme
    sphereMesh.rotation.y = elapsedTime * 0.15;
    boxMesh.rotation.y = elapsedTime * 0.15;
    boxMesh.rotation.x = elapsedTime * 0.1;
    // Kamera Kontrollerini Güncelleme
    controls.update();
    // Sahneyi Çizme
    renderer.render(scene, camera);
}
animate();
