const db = require('../config/db');

exports.getCategories = (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
    res.json(categories);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
