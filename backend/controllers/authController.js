const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Temel alan/format kontrolleri (zorunluluk, e-posta formatı, şifre
    // uzunluğu vb.) artık registerValidation middleware'inde yapılıyor.
    // Burada yalnızca veritabanına özgü iş kuralı (e-posta benzersizliği)
    // kontrol edilir.
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ message: 'Bu e-posta ile zaten bir hesap var' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(username, email, hashedPassword);
    const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Alan zorunluluğu/format kontrolü loginValidation middleware'inde yapılır.
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    const validPassword = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !validPassword) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  try {
    const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(req.user_id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const stats = db.prepare(`
      SELECT
        COUNT(*) as totalListings,
        COALESCE(SUM(CASE WHEN price > 0 THEN 1 ELSE 0 END), 0) as activeListings,
        COALESCE(SUM(CASE WHEN price = 0 THEN 1 ELSE 0 END), 0) as donationListings,
        COALESCE(SUM(price), 0) as totalValue
      FROM products WHERE user_id = ?
    `).get(req.user_id);

    const listings = db.prepare('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC').all(req.user_id);

    res.json({ user, stats, listings });
  } catch (err) {
    next(err);
  }
};
