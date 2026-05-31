# 🌿 EcoCampus — Sürdürülebilir Kampüs Pazaryeri


**EcoCampus**, üniversite öğrencilerinin kampüs içinde eşya paylaşmasını, israfı azaltmasını ve öğrenci ekonomisini desteklemesini sağlayan modern bir full-stack pazaryeri platformudur.
> React · Node.js · PostgreSQL · JWT · Tailwind CSS · React Native (Expo)

---

## ✨ Özellikler

- 🔒 **Güvenli Kimlik Doğrulama** — Bcrypt şifre hash'leme + JWT oturum yönetimi
- 📱 **Çoklu Platform** — React web dashboard + React Native mobil uygulama
- 💚 **Bağış Sistemi** — Fiyatı 0 TL olan ürünler otomatik olarak bağış olarak işaretlenir
- 📊 **Dashboard Analitik** — Toplam ilan, satılık ürün ve bağış sayılarını anlık takip edin
- 🗑️ **İlan Yönetimi** — Kendi ilanlarınızı oluşturun ve silin
- 🎨 **Modern UI** — Tailwind CSS ile responsive tasarım, toast bildirimleri, loading animasyonları

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Backend | Node.js, Express.js |
| Veritabanı | PostgreSQL |
| Güvenlik | JWT, Bcryptjs |
| Web Frontend | React 19, Tailwind CSS v3, Axios, Lucide React |
| Mobil | React Native (Expo) |
| Build Tool | Vite |

---

## 📁 Proje Yapısı

```
Eco_campus/
├── backend/
│   ├── config/db.js          # PostgreSQL bağlantısı
│   ├── controllers/          # İş mantığı
│   ├── routes/               # API endpoint'leri
│   ├── server.js             # Express sunucu
│   ├── setup-db.js           # Otomatik veritabanı kurulumu
│   ├── .env.example          # Ortam değişkeni şablonu
│   └── package.json
├── web/
│   ├── src/
│   │   ├── components/       # React bileşenleri
│   │   ├── services/api.js   # Axios API katmanı
│   │   └── App.jsx
│   └── package.json
├── mobile/                   # React Native (Expo)
├── database.sql              # Veritabanı şeması
└── README.md
```

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 16+
- PostgreSQL 12+
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
# .env dosyasını kendi PostgreSQL bilgilerinizle düzenleyin
npm install
node setup-db.js
```

`setup-db.js` otomatik olarak veritabanını, tabloları ve test verilerini oluşturur.

**Test kullanıcısı:**
- Email: `test@university.edu`
- Şifre: `test123`

### 3. Backend'i başlat

```bash
node server.js
# http://localhost:5000
```

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

---

## 📡 API Endpoint'leri

| Metod | Endpoint | Açıklama | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı | — |
| POST | `/api/auth/login` | Giriş yap, JWT döner | — |
| GET | `/api/products` | Tüm ilanları getir | — |
| POST | `/api/products` | Yeni ilan ekle | ✅ |
| DELETE | `/api/products/:id` | İlan sil (sadece sahibi) | ✅ |
| GET | `/api/categories` | Kategorileri getir | — |

---


---

## ⚙️ Ortam Değişkenleri

`backend/.env` dosyasını `.env.example` dosyasından oluşturun:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ecocampus_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## 📝 Lisans

MIT License — özgürce kullanabilirsiniz.
