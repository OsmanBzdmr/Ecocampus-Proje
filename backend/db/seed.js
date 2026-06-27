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
  if (existingProducts.rows[0].cnt > 0) {
    await db.query('DELETE FROM products');
  }

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
  await db.query(
    'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    ['İstatistik Kitabı', 60, 'Yeni gibi, 2. baskı', 'https://via.placeholder.com/300', userId, cats[0], 'active']
  );
  await db.query(
    'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    ['Kamp Masası', 150, 'Hafif ve katlanabilir', 'https://via.placeholder.com/300', userId, cats[2], 'active']
  );
  await db.query(
    'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    ['iPhone Şarj Aleti', 0, 'İhtiyacı olana ücretsiz', 'https://via.placeholder.com/300', userId, cats[1], 'active']
  );
  await db.query(
    'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    ['Tükenmez Kalem Seti', 0, '5 adet renkli kalem', 'https://via.placeholder.com/300', userId, cats[0], 'active']
  );
  await db.query(
    'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    ['Monitör', 800, '27 inç IPS panel', 'https://via.placeholder.com/300', userId, cats[1], 'active']
  );
  await db.query(
    'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    ['Çalışma Masası', 200, 'Ayarlanabilir yükseklik', 'https://via.placeholder.com/300', userId, cats[2], 'sold']
  );
  await db.query(
    'INSERT INTO products (title, price, description, image_url, user_id, category_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    ['C# Ders Notları', 45, 'I. dönem ders notları', 'https://via.placeholder.com/300', userId, cats[0], 'active']
  );
}

module.exports = { seedDemoData };
