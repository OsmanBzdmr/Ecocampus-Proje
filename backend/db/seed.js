const bcrypt = require('bcryptjs');

async function seedDemoData(db) {
  const existingCategories = await db.query('SELECT COUNT(*)::int as cnt FROM categories');
  if (existingCategories.rows[0].cnt === 0) {
    await db.query('INSERT INTO categories (name, icon) VALUES ($1, $2)', ['Ders Materyalleri', 'book']);
    await db.query('INSERT INTO categories (name, icon) VALUES ($1, $2)', ['Elektronik', 'laptop']);
    await db.query('INSERT INTO categories (name, icon) VALUES ($1, $2)', ['Eşya', 'home']);
  }

  const existingUsers = await db.query('SELECT COUNT(*)::int as cnt FROM users');
  if (existingUsers.rows[0].cnt === 0) {
    const hashedPassword = bcrypt.hashSync('test123', 10);
    await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      ['testuser', 'test@university.edu', hashedPassword]
    );
  }

  const existingProducts = await db.query('SELECT COUNT(*)::int as cnt FROM products');
  if (existingProducts.rows[0].cnt === 0) {
    const userResult = await db.query('SELECT id FROM users WHERE email = $1', ['test@university.edu']);
    const userId = userResult.rows[0].id;
    const catResult = await db.query('SELECT id FROM categories ORDER BY id');
    const cats = catResult.rows.map(r => r.id);

    await db.query(
      'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['Kullanılmış Laptop', 500, 'Dell laptop, çalışıyor', 'https://via.placeholder.com/300', userId, cats[1], 'active']
    );
    await db.query(
      'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['Bağış: Fizik Ders Notları', 0, 'Bedava dağıtılıyor', 'https://via.placeholder.com/300', userId, cats[0], 'active']
    );
    await db.query(
      'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['USB Kablo', 25, 'Type-C kablo', 'https://via.placeholder.com/300', userId, cats[1], 'reserved']
    );
  }
}

module.exports = { seedDemoData };
