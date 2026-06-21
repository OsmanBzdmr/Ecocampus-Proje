const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getProducts = (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
    res.json(products);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.createProduct = (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json('Token gerekli');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizlisifre');
    const user_id = decoded.id;

    const { title, price, description, image_url, category_id } = req.body;

    if (!title || price === undefined || price === '') {
      return res.status(400).json('Başlık ve fiyat zorunludur');
    }

    const stmt = db.prepare(
      'INSERT INTO products (title, price, description, image_url, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(title, price, description, image_url, category_id || 1, user_id);
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
    res.json(product);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.deleteProduct = (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json('Token gerekli');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizlisifre');
    const user_id = decoded.id;

    const { id } = req.params;

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).json('Ürün bulunamadı');
    if (product.user_id !== user_id) return res.status(403).json('Bu ürünü silme yetkiniz yok');

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ message: 'Ürün silindi' });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
