# 🌿 EcoCampus — Sürdürülebilir Kampüs Pazaryeri

**EcoCampus**, üniversite öğrencilerinin kampüs içinde eşya paylaşmasını, israfı azaltmasını ve öğrenci ekonomisini desteklemesini sağlayan modern bir full-stack pazaryeri platformudur.
> React · Node.js · PostgreSQL · JWT · Tailwind CSS · React Native (Expo)

---

## ✨ Özellikler

- 🔒 **Güvenli Kimlik Doğrulama** — Bcrypt şifre hash'leme + JWT oturum yönetimi, merkezi auth middleware
- 👤 **Kayıt ve Giriş** — Web üzerinden yeni hesap oluşturma (register) ve giriş yapma
- 📱 **Çoklu Platform** — React web dashboard + React Native mobil uygulama
- 🗂️ **Kategori Sistemi** — İlanlar kategorilere ayrılır, kategori seçimi ve etiket gösterimi
- 💚 **Bağış Sistemi** — Fiyatı 0 olan ürünler otomatik bağış olarak işaretlenir
- 🖼️ **Görsel Yükleme** — Dosya seçici ile resim yükleme (JPG/PNG/GIF/WEBP, max 5MB) veya URL girme
- 🔍 **Arama, Filtreleme ve Sayfalama** — Metin arama, kategori filtresi, fiyat aralığı, durum filtresi, sıralama, sayfalama
- 📄 **Ürün Detay Sayfası** — Web'de modal, mobil'de ayrı ekran; resim, kullanıcı, kategori, durum, açıklama
- ❤️ **Favori Yönetimi** — Web ve mobilde kalp ikonuyla favori ekleme/çıkarma; ayrı Favorilerim sekmesi, anlık tazeleme
- 🏷️ **Ürün Durumu** — Aktif / Rezerve / Satıldı badge'leri, web ve mobilde gösterim
- 📊 **Dashboard Analitik** — Toplam ilan, satılık ürün ve bağış sayılarını anlık takip edin
- ✏️ **İlan Düzenleme** — Web ve mobil üzerinden mevcut ilanlarınızı düzenleyin, durum değiştirin
- 🗑️ **İlan Yönetimi** — Kendi ilanlarınızı oluşturun, düzenleyin ve silin (yetkisiz işlemler backend tarafından reddedilir)
- 📱 **Tam Mobil Destek** — Expo ile giriş, kayıt, ilan ekleme/düzenleme/silme, galeriden görsel seçme, pull-to-refresh, profil sayfası, auth guard ve güvenli token yönetimi (expo-secure-store). Arama çubuğu (debounce), kategori/durum chip'leri, fiyat aralığı filtresi ve sonsuz kaydırma (infinite scroll) ile gelişmiş filtreleme
- 🛡️ **Güvenlik Sertleştirmesi** — Helmet güvenlik header'ları, genel ve auth'a özel rate limiting (brute-force koruması), tüm girdiler için sunucu taraflı doğrulama, kısıtlı CORS
- ✅ **Kapsamlı Testler** — Backend'de Jest + Supertest (53 test), Web'de Vitest + Testing Library (26 test), Mobile'da Jest + ts-jest (20 test) — toplam 99 test
- 👤 **Profil Sayfası** — Kullanıcı bilgileri, üyelik tarihi, kendi ilanlarının listesi ve istatistikler (web + mobil)
- 🗑️ **Hesap Silme** — Şifre doğrulamalı kalıcı hesap silme; kullanıcının tüm ilanları ve favorileri cascade ile silinir (web + mobil)
- 🌙 **Dark Mode** — Sistem tercihine uyumlu, localStorage ile kalıcı, manuel toggle (sidebar ve auth sayfalarında)
- 🎨 **Vintage Kağıt Teması** — Özel renk paleti (moss/clay/mustard), etiket bileşeni (tag), receipt-style auth kartları
- ✨ **Animasyonlar** — Sayfa geçişlerinde fade-in/up, modal scale-in, toast slide-in, hover efektleri, loading skeleton
- 📱 **Mobil Sidebar** — Hamburger menü ile slide-out drawer, mobil header
- 🔤 **Custom Tipografi** — Archivo (başlık), IBM Plex Sans (gövde), IBM Plex Mono (kod) — Google Fonts

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Backend | Node.js, Express.js |
| Veritabanı | PostgreSQL |
| Güvenlik | JWT, Bcryptjs, Helmet, express-rate-limit, express-validator |
| Test & Kalite | Jest, Supertest, Vitest, @testing-library/react, ts-jest, ESLint |
| Web Frontend | React 19, Tailwind CSS v3, Axios, Lucide React, Vitest |
| Web Fonts | Google Fonts — Archivo, IBM Plex Sans, IBM Plex Mono |
| Mobil | React Native (Expo), jest, ts-jest, react-test-renderer |
| Build Tool | Vite |
| Görsel Yükleme | Multer |

---

## 📁 Proje Yapısı

```
Eco_campus/
├── backend/
│   ├── config/db.js              # PostgreSQL bağlantısı (Pool)
│   ├── controllers/
│   │   ├── authController.js     # Kayıt, giriş, profil, hesap silme
│   │   ├── productController.js  # Ürün CRUD + detay + filtreleme
│   │   ├── categoryController.js # Kategori listeleme
│   │   └── favoriteController.js # Favori toggle + listeleme
│   ├── db/
│   │   ├── seed.js               # Demo veri (kullanıcı, kategori, ürün)
│   │   └── schema.js             # Migration SQL'lerini okur
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_categories.sql
│   │   ├── 003_create_products.sql
│   │   └── 004_add_product_status.sql  # status kolonu (active/sold/reserved)
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT doğrulama (merkezi)
│   │   ├── rateLimiter.js              # Genel + auth'a özel rate limiting
│   │   └── validationMiddleware.js     # express-validator ile girdi doğrulama
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── productRoutes.js    # /api/products/* (Multer upload dahil)
│   │   ├── categoryRoutes.js   # /api/categories
│   │   └── favoriteRoutes.js   # /api/favorites/*
│   ├── tests/
│   │   ├── auth.test.js        # Auth testleri (16 test — register, login, profil, hesap silme)
│   │   ├── products.test.js    # Ürün testleri (23 test)
│   │   ├── categories.test.js  # Kategori testleri (4 test)
│   │   ├── favorites.test.js   # Favori testleri (10 test)
│   │   └── helpers/            # Mock DB, seed, auth yardımcıları
│   ├── uploads/                # Yüklenen görseller (statik serve edilir)
│   ├── server.js               # Express sunucu (helmet, CORS, rate limiter)
│   ├── setup-db.js             # Migration + seed ile veritabanı kurulumu
│   ├── run-migrations.js       # Migration runner (_migrations tracking)
│   └── .env.example
├── web/
│   ├── src/
│   │   ├── context/
│   │   │   └── ThemeContext.jsx        # Dark/light tema yönetimi (Context + localStorage)
│   ├── components/
│   │   │   ├── LoginPage.jsx          # Giriş formu (fiş tasarımı)
│   │   │   ├── RegisterPage.jsx       # Kayıt formu (fiş tasarımı)
│   │   │   ├── Dashboard.jsx          # Ana panel + arama/filtre/sayfalama + hamburger drawer
│   │   │   ├── ProductForm.jsx        # İlan ekleme/düzenleme (file input + status)
│   │   │   ├── ProductTable.jsx       # Tablo/kart görünümü + tag badge
│   │   │   ├── ProductDetail.jsx      # Ürün detay modalı
│   │   │   ├── StatsCard.jsx          # İstatistik kartları
│   │   │   ├── ProfilePage.jsx        # Profil sayfası
│   │   │   ├── Toast.jsx              # Bildirim bileşeni
│   │   ├── __tests__/             # Component testleri (Vitest + Testing Library)
│   │   │   ├── ProductTable.test.jsx
│   │   │   └── ProductDetail.test.jsx
│   │   └── services/
│   │       ├── api.js             # Axios API katmanı
│   │       └── __tests__/
│   │           └── api.test.js    # API servis testleri
│   ├── vitest.config.ts
│   ├── test-setup.js
│   └── vite.config.js                 # Proxy ile backend yönlendirmesi
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx            # Stack navigator
│   │   ├── login.tsx              # Giriş ekranı
│   │   ├── register.tsx           # Kayıt ekranı
│   │   ├── detail.tsx             # Ürün detay ekranı
│   │   ├── edit-product.tsx       # İlan düzenleme (status + görsel)
│   │   ├── modal.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx        # Tab navigator
│   │   │   ├── index.tsx          # İlan listesi + arama/filtre chip'leri + sonsuz kaydırma
│   │   │   ├── favorites.tsx      # Favorilerim sekmesi (pull-to-refresh)
│   │   │   ├── add-product.tsx    # İlan ekleme (galeriden görsel seç)
│   │   │   └── profile.tsx        # Profil ekranı
│   │   └── __tests__/             # Component testleri
│   │   │   ├── index.test.tsx
│   │   │   ├── detail.test.tsx
│   │   │   └── favorites.test.tsx
│   ├── __mocks__/                 # Jest manual mocks
│   │   ├── axios.ts
│   │   └── expo-constants.ts
│   ├── services/
│   │   ├── __tests__/
│   │   │   └── api.test.ts       # API servis testleri (16 test)
│   │   ├── api.ts                 # Axios API katmanı (FormData desteği)
│   │   └── auth.ts                # Token yönetimi (expo-secure-store)
│   ├── constants/theme.ts         # Eco renk paleti
│   ├── jest.config.js
│   ├── jest-setup.js
│   ├── tsconfig.jest.json
│   ├── babel.config.js
│   └── metro.config.js                # Expo Router için gerekli Metro config
└── README.md
```

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm
- Docker (PostgreSQL için) veya lokal PostgreSQL kurulumu

### 1. Repoyu klonla

```bash
git clone https://github.com/OsmanBzdmr/Eco_campus
cd Eco_campus
```

### 2. PostgreSQL'i başlat (Docker)

```bash
docker run -d --name ecocampus-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ecocampus -p 5432:5432 postgres:16
```

### 3. Veritabanını kur

```bash
cd backend
cp .env.example .env
npm install
node setup-db.js
```

`setup-db.js` otomatik olarak veritabanını, tabloları ve test verilerini oluşturur.

> ⚠️ **Önemli:** `.env` dosyasındaki `JWT_SECRET` zorunludur — boş veya eksik bırakılırsa sunucu güvenlik gereği başlamayı reddeder. Rastgele güçlü bir değer üretmek için:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```
> Çıkan değeri `.env` içindeki `JWT_SECRET=` satırına yapıştırın.

**Test kullanıcısı:**
- Email: `test@university.edu`
- Şifre: `test123`

### 4. Backend'i başlat

```bash
node server.js
# http://localhost:5000
```

> 🧪 **Testler (opsiyonel):** Üç platformda da yazılmış otomatik testleri çalıştırabilirsiniz:
> ```bash
> # Backend (53 test — auth, products, categories, favorites)
> cd backend && npm test
>
> # Web (26 test — API servisleri, component render)
> cd web && npm test
>
> # Mobile (20 test — API servisleri, component render)
> cd mobile && npm test
> ```

### 5. Web dashboard'u başlat

```bash
cd ../web
npm install
npm run dev
# http://localhost:5173
```

### 6. Mobil uygulamayı başlat

```bash
cd ../mobile
npm install
npx expo start
# Expo Go uygulamasıyla QR kodu okutun
```

> 📱 **Not:** Mobil uygulama login-first yaklaşımıyla açılır. Giriş sonrası ilanları görüntüleyebilir, filtreleyebilir, galeriden görsel seçerek ilan ekleyebilirsiniz.

#### Mobil bağlantı sorunları

Telefon ile bilgisayar aynı Wi-Fi ağında olduğu halde Expo Go'da bağlantı kurulamıyorsa (`failed to download remote update`, sonsuza kadar süren "yükleniyor" ekranları vb.), ağ büyük ihtimalle **AP/client isolation** uyguluyordur (okul, kampüs veya misafir ağlarında yaygındır). Bu durumda:

```bash
npx expo start --tunnel
```

ile tünel modunu kullanın. Tünel modunda backend'in de dışarıdan erişilebilir olması gerektiğinden, backend'i ayrıca `npx ngrok http 5000` ile açıp `mobile/services/api.ts` içindeki `getBaseUrl()` fonksiyonunu geçici olarak o adrese sabitlemeniz gerekebilir. Ev/ofis gibi izole olmayan ağlarda standart `npx expo start` (LAN modu) yeterlidir.

Eğer `Cannot find module 'babel-preset-expo'` hatası alırsanız:
```bash
cd mobile
npm install babel-preset-expo@~54.0.11
```

---

## 📡 API Endpoint'leri

| Metod | Endpoint | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı (rate limit'li) | — |
| POST | `/api/auth/login` | Giriş yap, JWT döner (rate limit'li) | — |
| GET | `/api/auth/me` | Giriş yapan kullanıcının profil + istatistik + ilanları | ✅ |
| DELETE | `/api/auth/me` | Hesabı sil — şifre doğrulama gerekli; tüm ilanlar ve favoriler cascade ile silinir | ✅ |
| GET | `/api/categories` | Kategorileri getir | — |
| GET | `/api/products` | İlanları getir (filtreleme + sayfalama + sıralama) | — |
| GET | `/api/products/:id` | Tek ürün detayı (username + category_name ile) | — |
| POST | `/api/products` | Yeni ilan ekle (multipart/form-data ile görsel yükleme) | ✅ |
| PUT | `/api/products/:id` | İlanı güncelle — kısmi güncelleme, status dahil | ✅ |
| DELETE | `/api/products/:id` | İlan sil (sadece sahibi) | ✅ |
| POST | `/api/favorites/:id` | Favori ekle/çıkar (toggle) | ✅ |
| GET | `/api/favorites` | Favori listesini getir | ✅ |

> **GET /api/products** parametreleri:
> - `search` — başlık/açıklamada metin arama
> - `category_id` — kategori filtresi
> - `min_price` / `max_price` — fiyat aralığı
> - `status` — durum filtresi (`active`, `sold`, `reserved`)
> - `page` / `limit` — sayfalama (limit 1-100 arası)
> - `sort` — sıralama (`id`, `title`, `price`, `created_at`)
> - `order` — sıralama yönü (`asc`, `desc`)
>
> Sayfalama aktifken `X-Total-Count`, `X-For-Sale-Count`, `X-Donation-Count`, `X-Page`, `X-Limit`, `X-Total-Pages` response header'larında döner.

> **POST/PUT /api/products:** `Content-Type: multipart/form-data` ile görsel dosyası (`image` alanı) gönderilebilir. Dosya gönderilmezse `image_url` alanı kullanılır.

---

## ⚙️ Ortam Değişkenleri

`backend/.env` dosyasını `.env.example` dosyasından oluşturun:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecocampus
JWT_SECRET=guclu_ve_rastgele_bir_deger_buraya
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

`JWT_SECRET` tanımlı değilse sunucu başlangıçta hata verip kapanır. Rastgele bir değer üretmek için kurulum adımındaki komutu kullanın. Projeye eklenen `.env` dosyası önceden oluşturulmuş güçlü bir rastgele değer içerir, production'da mutlaka kendiniz yenileyin.

> **Web için:** Vite proxy kullanılır (`vite.config.js` → `server.proxy`). `/api/*` istekleri otomatik olarak `http://localhost:5000`'e yönlendirilir.

## 📝 Lisans

MIT License — özgürce kullanabilirsiniz.