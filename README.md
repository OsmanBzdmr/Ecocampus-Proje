# 🌿 EcoCampus — Sürdürülebilir Kampüs Pazaryeri

**EcoCampus**, üniversite öğrencilerinin kampüs içinde eşya paylaşmasını, israfı azaltmasını ve öğrenci ekonomisini desteklemesini sağlayan modern bir full-stack pazaryeri platformudur.
> React · Node.js · SQLite · JWT · Tailwind CSS · React Native (Expo)

---

## ✨ Özellikler

- 🔒 **Güvenli Kimlik Doğrulama** — Bcrypt şifre hash'leme + JWT oturum yönetimi, merkezi auth middleware
- 👤 **Kayıt ve Giriş** — Web üzerinden yeni hesap oluşturma (register) ve giriş yapma
- 📱 **Çoklu Platform** — React web dashboard + React Native mobil uygulama
- 🗂️ **Kategori Sistemi** — İlanlar kategorilere ayrılır, web tarafında kategori seçimi ve listede kategori etiketi gösterilir
- 💚 **Bağış Sistemi** — Fiyatı 0 TL olan ürünler otomatik olarak bağış olarak işaretlenir
- 📊 **Dashboard Analitik** — Toplam ilan, satılık ürün ve bağış sayılarını anlık takip edin
- 🗑️ **İlan Yönetimi** — Kendi ilanlarınızı oluşturun, düzenleyin ve silin (yetkisiz işlemler backend tarafından reddedilir)
- 🔍 **Arama, Filtreleme ve Sayfalama** — Başlık/açıklamada arama, kategoriye göre filtreleme; sayfalama opt-in'dir, eski istemcilerle geriye dönük uyumlu kalır
- 📱 **Tam Mobil Destek** — Expo ile giriş, kayıt, ilan ekleme/silme, pull-to-refresh, auth guard ve güvenli token yönetimi (expo-secure-store)
- 🛡️ **Güvenlik Sertleştirmesi** — Helmet güvenlik header'ları, genel ve auth'a özel rate limiting (brute-force koruması), tüm girdiler için sunucu taraflı doğrulama, kısıtlı CORS
- ✅ **Test Edilmiş Backend** — Jest + Supertest ile auth ve ürün uçları için otomatik testler, ESLint ile kod kalitesi kontrolü
- 🎨 **Modern UI** — Tailwind CSS ile responsive tasarım, toast bildirimleri, loading animasyonları

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Backend | Node.js, Express.js |
| Veritabanı | SQLite |
| Güvenlik | JWT, Bcryptjs, Helmet, express-rate-limit, express-validator |
| Test & Kalite | Jest, Supertest, ESLint |
| Web Frontend | React 19, Tailwind CSS v3, Axios, Lucide React |
| Mobil | React Native (Expo) |
| Build Tool | Vite |

---

## 📁 Proje Yapısı

```
Eco_campus/
├── backend/
│   ├── config/db.js          # SQLite bağlantısı
│   ├── controllers/          # İş mantığı
│   ├── db/schema.js          # Paylaşımlı şema + seed (setup-db.js ve testler kullanır)
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT doğrulama (merkezi)
│   │   ├── rateLimiter.js          # Genel + auth'a özel rate limiting
│   │   └── validationMiddleware.js # express-validator ile girdi doğrulama
│   ├── routes/                # API endpoint'leri
│   ├── tests/                 # Jest + Supertest testleri (mock veritabanı ile)
│   ├── server.js              # Express sunucu (helmet, CORS, rate limiter) + merkezi hata yönetimi
│   ├── setup-db.js            # Otomatik veritabanı kurulumu
│   ├── eslint.config.js        # ESLint yapılandırması
│   ├── jest.config.js          # Jest yapılandırması
│   ├── .env.example            # Ortam değişkeni şablonu
│   └── package.json
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── ProductTable.jsx
│   │   ├── services/api.js   # Axios API katmanı
│   │   └── App.jsx
│   └── package.json
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx        # Auth guard + Stack navigator
│   │   ├── login.tsx          # Giriş ekranı
│   │   ├── register.tsx       # Kayıt ekranı
│   │   ├── modal.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx    # Tab navigator (İlanlar, İlan Ekle, Hakkında)
│   │       ├── index.tsx      # İlan listesi (silme, pull-to-refresh)
│   │       ├── add-product.tsx# İlan ekleme formu
│   │       └── explore.tsx    # Hakkında + çıkış butonu
│   ├── services/
│   │   ├── api.ts             # Axios API katmanı (6 endpoint)
│   │   └── auth.ts            # Token saklama (expo-secure-store)
│   ├── constants/theme.ts     # Web ile uyumlu eco renk paleti
└── README.md
```

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 16+
- npm

### 1. Repoyu klonla

```bash
git clone https://github.com/OsmanBzdmr/Ecocampus-Proje
cd ecocampus
```

### 2. Veritabanını kur

`backend/` klasöründe:

```bash
cd backend
cp .env.example .env
npm install
node setup-db.js
```

`setup-db.js` otomatik olarak veritabanını, tabloları ve test verilerini oluşturur.

> ⚠️ **Önemli:** `.env` dosyasındaki `JWT_SECRET` artık zorunludur — boş veya eksik bırakılırsa sunucu güvenlik gereği başlamayı reddeder. Rastgele güçlü bir değer üretmek için:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```
> Çıkan değeri `.env` içindeki `JWT_SECRET=` satırına yapıştırın.

**Test kullanıcısı:**
- Email: `test@university.edu`
- Şifre: `test123`

İstersen web arayüzündeki **"Kayıt ol"** linkinden de yeni bir hesap oluşturabilirsin.

### 3. Backend'i başlat

```bash
node server.js
# http://localhost:5000
```

> 🧪 **Testler (opsiyonel):** Backend için Jest + Supertest ile yazılmış otomatik testleri ve ESLint kontrolünü çalıştırabilirsiniz:
> ```bash
> npm test       # auth ve ürün uçları için testler
> npm run lint   # ESLint kontrolü
> ```

### 4. Web dashboard'u başlat

```bash
cd ../web
npm install
npm run dev
# http://localhost:5173
```

### 5. Mobil uygulamayı başlat

```bash
cd ../mobile
npm install
npx expo start
# Expo Go uygulamasıyla QR kodu okutun
```

> 📱 **Not:** Mobil uygulama açıldığında auth guard sizi giriş ekranına yönlendirir. `test@university.edu` / `test123` ile giriş yapabilir veya "Kayıt ol" linkinden yeni hesap oluşturabilirsiniz. Giriş sonrası ilanları görüntüleyebilir, silebilir ve "İlan Ekle" tab'ından yeni ilan verebilirsiniz.

---

## 📡 API Endpoint'leri

| Metod | Endpoint | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı (rate limit'li) | — |
| POST | `/api/auth/login` | Giriş yap, JWT döner (rate limit'li) | — |
| GET | `/api/products` | İlanları getir — `search`, `category_id`, `page`, `limit` query parametrelerini destekler | — |
| POST | `/api/products` | Yeni ilan ekle | ✅ |
| PUT | `/api/products/:id` | İlanı güncelle (sadece sahibi) | ✅ |
| DELETE | `/api/products/:id` | İlan sil (sadece sahibi) | ✅ |
| GET | `/api/categories` | Kategorileri getir | — |

> `GET /api/products` geriye dönük uyumluluk için varsayılan olarak düz bir dizi döner; `page`/`limit` gönderildiğinde sayfalama devreye girer ve toplam kayıt/sayfa bilgisi `X-Total-Count`, `X-Page`, `X-Limit`, `X-Total-Pages` response header'larında döner.

---

## ⚙️ Ortam Değişkenleri

`backend/.env` dosyasını `.env.example` dosyasından oluşturun:

```env
DB_PATH=./ecocampus.db
JWT_SECRET=guclu_ve_rastgele_bir_deger
PORT=5000
NODE_ENV=development

# CORS - izin verilen origin'ler (virgülle ayrılmış, boşluksuz)
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

# Genel API rate limit (tüm uçlar için, 15dk'da 300 istek)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300

# Auth uçları (login/register) için daha sıkı rate limit (15dk'da 10 deneme)
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10
```

`JWT_SECRET` tanımlı değilse sunucu başlangıçta hata verip kapanır — varsayılan/sabit bir secret ile asla çalışmaz. Rastgele bir değer üretmek için kurulum adımındaki komutu kullanın.

`CORS_ORIGIN` virgülle ayrılmış birden fazla origin alır; Vite `--host` ile başlatıldığında `127.0.0.1` üzerinden de erişilebildiği için her ikisini de eklemeniz önerilir. Rate limit değerleri test ortamında (`NODE_ENV=test`) otomatik devre dışı kalır.

> **Web için:** `web/.env` dosyasında `VITE_API_URL=http://localhost:5000` tanımlıdır. Backend farklı bir portta çalışıyorsa bu değeri güncelleyin.

---

## 📝 Lisans

MIT License — özgürce kullanabilirsiniz.