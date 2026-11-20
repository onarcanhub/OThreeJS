# OThreeJS
***1. Hafta: 3D Web'e Giriş ve Temel Kavramlar***

Web’de 3D Grafik Kütükhanesi: Three.js

Geliştirme Ortamının Kurulması (Node.js, Vite, VS Code)

Three.js’in Temel Yapı Taşları: Sahne (Scene), Kamera (Camera), Render Alıcı (Renderer)

Uygulama: İlk Three.js "Hello World" (Dönen Küp) sahnesinin oluşturulması.
<!-- ![Hello World" (Dönen Küp) sahnesinin oluşturulması](/images/01.png) -->
<img src="/images/01.png" width="30%">


***2. Hafta: Matematiksel Temeller ve Dönüşümler***

3D Uzayda Koordinat Sistemleri (X, Y, Z)

Vektörler (`Vector3`) ve Matrisler

Pozisyon (Position), Dönme (Rotation) ve Ölçekleme (Scale)

`Group` yapısı ile nesneleri hiyerarşik bağlama

Uygulama: Güneş Sistemi modeli (Güneş etrafında dönen gezegenler).

<!--![Güneş Sistemi modeli ](/images/02.png)-->
<img src="/images/02.png" width="30%">

***3. Hafta: Kameralar ve Görüş Açıları***

Perspektif Kamera (`PerspectiveCamera`) vs. Ortografik Kamera (`OrthographicCamera`)

Kamera Parametreleri: FOV (Field of View), Aspect Ratio, Near/Far Düzlemleri

Kamera Kontrolleri: `OrbitControls` entegrasyonu ve özelleştirilmesi

Uygulama: İnteraktif ürün inceleme kamerası yapımı.

<!--![İnteraktif ürün inceleme kamerası yapımı](/images/03.png)-->
<img src="/images/03.png" width="30%">

**4. Hafta: Geometriler – Temel Şekiller**

Yerleşik (Built-in) Geometriler: `Box`, `Sphere`, `Cylinder`, `Plane`, `Toru`s vb.

Segment ve Mesh Yapısı (Wireframe modunda inceleme)

Geometri Özellikleri ve `BufferGeometry` mantığına giriş

Uygulama: Çeşitli temel şekillerden oluşan 3D soyut bir kompozisyon oluşturma.

<!--![Çeşitli temel şekillerden oluşan 3D soyut bir kompozisyon oluşturma](/images/04.png)-->
<img src="/images/04.png" width="30%">

***5. Hafta: Materyaller (Materials) ve Yüzey Özellikleri***

Temel Materyaller: `MeshBasicMaterial`, `MeshLambertMaterial`, `MeshPhongMaterial`

Modern PBR (Physically Based Rendering) Materyalleri: `MeshStandardMaterial`, `MeshPhysicalMaterial`

Metalness, Roughness, Opacity ve Transparent ayarları

Uygulama: Farklı malzeme türlerinin (Cam, Metal, Plastik, Ahşap) görsel karşılaştırması.

<!--![Farklı malzeme türlerinin (Cam, Metal, Plastik, Ahşap) görsel karşılaştırması](/images/05.png)-->
<img src="/images/05.png" width="30%">

***6. Hafta: Işıklar (Lights) ve Gölgeler (Shadows)***
Işık Türleri: `AmbientLight`, `DirectionalLight`, `PointLight`, `SpotLight`, `HemisphereLight`

Light Helpers (Işık yardımcıları) ile çalışmak

Gölge Haritalama (Shadow Maps): Gölgeleri aktif etme, çözünürlük ve performans ayarları

Uygulama: Sinematik bir stüdyo aydınlatması ve gölge sahnesi hazırlama

<img src="/images/06.png" width="30%">


***7. Hafta: Kaplamalar (Textures) ve PBR Mimarisi***
Kaplama Yükleyici (`TextureLoader`) kullanımı

PBR Kaplama Haritaları: Color (Albedo), Normal, Roughness, Metalness, Ambient Occlusion (AO), Displacement Maps

Texture UV haritalama, Repeating, Offset ve Center ayarları

Uygulama: Gerçekçi bir taş/ahşap zemin ve küre yüzeyi kaplama.

<img src="/images/07.png" width="30%">


| Oluşturan | Görsel |
| :--- | :---: |
| AA | <img src="/images/ara/aa_bmw-logo.png" width="30%"> |
| ABO | <img src="/images/ara/abo_saksi.png" width="30%"> |
| AMA | <img src="/images/ara/ama_Lotus.png" width="30%"> |
| BD | <img src="/images/ara/bd_vazo.png" width="30%"> |
| BDM | <img src="/images/ara/bdm_kalp.png" width="30%"> |
| CEE | <img src="/images/ara/cee_KardanAdam.png" width="30%"> |
| EK | <img src="/images/ara/ek_kitap.png" width="30%"> |
| İY | <img src="/images/ara/iy_cup.png" width="30%"> |
| İSD | <img src="/images/ara/isd_Kamera.png" width="30%"> |
| MÜ | <img src="/images/ara/mu_gulbuketi.png" width="30%"> |
| MHY | <img src="/images/ara/mhy_sise.png" width="30%"> |
| MCÖ | <img src="/images/ara/mco_KutupYildizi.png" width="30%"> |
| SE | <img src="/images/ara/se_sehpa.png" width="30%"> |
| ST | <img src="/images/ara/st_kedi.png" width="30%"> |
| ŞA | <img src="/images/ara/sa_ruj.png" width="30%"> |


***8. Hafta: Çevre Haritaları ve HDRI (Environment Maps)***
HDRI nedir? Küresel aydınlatma ve yansımalar

`RGBELoader` ile HDRI arka plan ve çevre kaplaması yükleme

Yansıma ve Kırılma (Refraction) efektleri

Uygulama: HDRI destekli, yüksek gerçekçilikte otomobil/takı sergileme sahnesi.

<img src="/images/08.png" width="30%">


9. Hafta: Kullanıcı Etkileşimi (Interactivity) ve Raycasting
2D Fare Koordinatlarını 3D Uzaya Dönüştürme

`Raycaster Sınıfı`: 3D Nesnelere Tıklama, Üzerine Gelme (Hover) Tespiti

Nesne Seçimi ve Vurgulama

Uygulama: Tıklamayla renk değiştiren ve hareket eden 3D butonlar/menüler. 


<img src="/images/09.png" width="30%">


<!-- yorumunuz-->


<!-- yorumunuz -->
