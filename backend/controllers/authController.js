const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    res.json(newUser.rows[0]);
  } catch (err) { res.status(500).json(err.message); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) return res.status(401).json("E-posta bulunamadı!");

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json("Şifre hatalı!");

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET || 'gizlisifre', { expiresIn: '1h' });
    res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });
  } catch (err) { res.status(500).json(err.message); }
};