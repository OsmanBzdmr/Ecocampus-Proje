const db = require('../config/db');

function buildWhere(params, search, category_id, min_price, max_price, status) {
  const clauses = [];
  let idx = 0;

  if (search) {
    idx += 2;
    clauses.push(`(title ILIKE $${idx - 1} OR description ILIKE $${idx})`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category_id) {
    idx++;
    clauses.push(`category_id = $${idx}`);
    params.push(category_id);
  }

  if (min_price !== undefined && min_price !== '') {
    idx++;
    clauses.push(`price >= $${idx}`);
    params.push(parseFloat(min_price));
  }

  if (max_price !== undefined && max_price !== '') {
    idx++;
    clauses.push(`price <= $${idx}`);
    params.push(parseFloat(max_price));
  }

  if (status) {
    idx++;
    clauses.push(`status = $${idx}`);
    params.push(status);
  }

  return clauses.length > 0 ? 'WHERE ' + clauses.join(' AND ') : '';
}

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = (await db.query(
      'SELECT p.*, u.username, c.name as category_name FROM products p JOIN users u ON p.user_id = u.id JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
      [id]
    )).rows[0];

    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category_id, min_price, max_price, status, page, limit, sort, order } = req.query;

    const params = [];
    const whereSQL = buildWhere(params, search, category_id, min_price, max_price, status);

    const allowedSortCols = ['id', 'title', 'price', 'created_at'];
    const sortCol = allowedSortCols.includes(sort) ? sort : 'id';
    const sortDir = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const orderSQL = `ORDER BY ${sortCol} ${sortDir}`;

    if (page && limit) {
      const countRow = (await db.query(`SELECT COUNT(*)::int as cnt FROM products ${whereSQL}`, params)).rows[0];
      const total = countRow.cnt;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const totalPages = Math.ceil(total / limitNum);
      const offset = (pageNum - 1) * limitNum;

      const products = (await db.query(
        `SELECT p.*, u.username, c.name as category_name FROM products p JOIN users u ON p.user_id = u.id JOIN categories c ON p.category_id = c.id ${whereSQL} ${orderSQL} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limitNum, offset]
      )).rows;

      const forSaleRow = (await db.query(`SELECT COUNT(*)::int as cnt FROM products WHERE price > 0 ${whereSQL.replace('WHERE', 'AND')}`, params)).rows[0];
      const donationRow = (await db.query(`SELECT COUNT(*)::int as cnt FROM products WHERE price = 0 ${whereSQL.replace('WHERE', 'AND')}`, params)).rows[0];

      res.set({
        'X-Total-Count': total,
        'X-Page': pageNum,
        'X-Limit': limitNum,
        'X-Total-Pages': totalPages,
        'X-For-Sale-Count': forSaleRow.cnt,
        'X-Donation-Count': donationRow.cnt,
      });
      return res.json(products);
    }

    const products = (await db.query(`SELECT p.*, u.username, c.name as category_name FROM products p JOIN users u ON p.user_id = u.id JOIN categories c ON p.category_id = c.id ${whereSQL} ${orderSQL}`, params)).rows;
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { title, price, description, category_id } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;

    const result = await db.query(
      'INSERT INTO products (title, price, description, image_url, category_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, price, description, image_url, category_id || 1, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { id } = req.params;
    const { title, price, description, image_url, category_id, status } = req.body;

    const product = (await db.query('SELECT * FROM products WHERE id = $1', [id])).rows[0];
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    if (product.user_id !== user_id) return res.status(403).json({ message: 'Bu ürünü düzenleme yetkiniz yok' });

    const setClauses = [];
    const params = [];
    let idx = 0;

    if (title !== undefined) { idx++; setClauses.push(`title = $${idx}`); params.push(title); }
    if (price !== undefined) { idx++; setClauses.push(`price = $${idx}`); params.push(price); }
    if (description !== undefined) { idx++; setClauses.push(`description = $${idx}`); params.push(description); }
    if (image_url !== undefined) { idx++; setClauses.push(`image_url = $${idx}`); params.push(image_url); }
    if (category_id !== undefined) { idx++; setClauses.push(`category_id = $${idx}`); params.push(category_id); }
    if (status !== undefined) { idx++; setClauses.push(`status = $${idx}`); params.push(status); }

    // uploaded file overrides image_url
    if (req.file) {
      idx++; setClauses.push(`image_url = $${idx}`); params.push(`/uploads/${req.file.filename}`);
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ message: 'Güncellenecek alan bulunamadı' });
    }

    params.push(id);
    const result = await db.query(
      `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${idx + 1} RETURNING *`,
      params
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const { id } = req.params;

    const product = (await db.query('SELECT * FROM products WHERE id = $1', [id])).rows[0];
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    if (product.user_id !== user_id) return res.status(403).json({ message: 'Bu ürünü silme yetkiniz yok' });

    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Ürün silindi' });
  } catch (err) {
    next(err);
  }
};
