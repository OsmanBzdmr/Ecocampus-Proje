const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(username, email, hashedPassword);
    const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.json(user);
  } catch (err) { res.status(500).json(err.message); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json("E-posta bulunamadı!");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json("Şifre hatalı!");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'gizlisifre', { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) { res.status(500).json(err.message); }
};
