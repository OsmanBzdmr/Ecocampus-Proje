const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
  console.error('HATA: JWT_SECRET ortam değişkeni tanımlı değil. .env dosyanızı kontrol edin (.env.example üzerinden oluşturabilirsiniz).');
  process.exit(1);
}

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Güvenlik header'ları (X-Frame-Options, X-Content-Type-Options, CSP vb.)
app.use(helmet());

// CORS yalnızca bilinen istemcilere (web paneli, mobil dev sunucusu) açılır.
// CORS_ORIGIN ortam değişkeni virgülle ayrılmış birden fazla origin alabilir.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // origin olmadan gelen istekler (Postman, mobil uygulama, curl) kabul edilir
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS politikası tarafından engellendi'));
  },
}));

app.use(express.json());

// Tüm API için genel rate limiter; auth uçları kendi içinde daha sıkı bir
// limit olan authLimiter'ı ayrıca kullanır (bkz. authRoutes.js).
app.use(generalLimiter);

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

// 404 - tanımsız route'lar için
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint bulunamadı' });
});

// Merkezi hata yönetimi middleware'i (her zaman son middleware olmalı)
app.use((err, req, res, _next) => {
  console.error('Hata yakalandı:', err);

  const isDev = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Sunucuda bir hata oluştu',
  });
});

const PORT = process.env.PORT || 5000;

// app.listen yalnızca bu dosya doğrudan çalıştırıldığında tetiklenir
// (`node server.js`). Testlerde `require('./server')` ile app import
// edilirken gerçek bir port dinlenmesini önler; supertest app'i
// doğrudan kullanır.
if (require.main === module) {
  app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
}

module.exports = app;
