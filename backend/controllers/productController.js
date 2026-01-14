const pool = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const allProducts = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(allProducts.rows);
  } catch (err) { res.status(500).json(err.message); }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, image_url, category_id, user_id } = req.body;
    const newProduct = await pool.query(
      'INSERT INTO products (title, price, description, image_url, category_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, price, description, image_url, category_id, user_id]
    );
    res.json(newProduct.rows[0]);
  } catch (err) { res.status(500).json(err.message); }
};