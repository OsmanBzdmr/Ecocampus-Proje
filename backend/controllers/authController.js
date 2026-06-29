const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = (await db.query('SELECT id FROM users WHERE email = $1', [email])).rows[0];
    if (existing) {
      return res.status(409).json({ message: 'Bu e-posta ile zaten bir hesap var' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = (await db.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
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

exports.deleteAccount = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { password } = req.body;

    const user = (await db.query('SELECT * FROM users WHERE id = $1', [user_id])).rows[0];
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Şifre hatalı' });

    await db.query('DELETE FROM users WHERE id = $1', [user_id]);
    res.json({ message: 'Hesabınız başarıyla silindi' });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user_id = req.user_id;

    const user = (await db.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [user_id])).rows[0];
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    const products = (await db.query('SELECT * FROM products WHERE user_id = $1 ORDER BY id DESC', [user_id])).rows;

    const totalListings = products.length;
    const donationListings = products.filter((p) => parseFloat(p.price) === 0).length;
    const activeListings = products.filter((p) => p.status === 'active').length;
    const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);

    res.json({
      user,
      stats: { totalListings, activeListings, donationListings, totalValue },
      listings: products,
    });
  } catch (err) {
    next(err);
  }
};
