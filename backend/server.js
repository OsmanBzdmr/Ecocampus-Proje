const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rotaları Tanımla
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // <--- EKSİK OLAN SATIR BUYDU, EKLE!

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda modüler olarak çalışıyor.`));