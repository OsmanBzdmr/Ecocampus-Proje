const bcrypt = require('bcryptjs');

function createSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      icon VARCHAR(50)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(100) NOT NULL,
      price REAL DEFAULT 0,
      description TEXT,
      image_url TEXT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function seedDemoData(db) {
  const existingCategories = db.prepare('SELECT COUNT(*) as cnt FROM categories').get();
  if (existingCategories.cnt === 0) {
    db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)').run('Ders Materyalleri', 'book');
    db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)').run('Elektronik', 'laptop');
    db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)').run('Eşya', 'home');
  }

  const existingUsers = db.prepare('SELECT COUNT(*) as cnt FROM users').get();
  if (existingUsers.cnt === 0) {
    const hashedPassword = bcrypt.hashSync('test123', 10);
    db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(
      'testuser', 'test@university.edu', hashedPassword
    );
  }

  const existingProducts = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
  if (existingProducts.cnt === 0) {
    const insertProduct = db.prepare('INSERT INTO products (title, price, description, image_url, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)');
    insertProduct.run('Kullanılmış Laptop', 500, 'Dell laptop, çalışıyor', 'https://via.placeholder.com/300', 1, 2);
    insertProduct.run('Bağış: Fizik Ders Notları', 0, 'Bedava dağıtılıyor', 'https://via.placeholder.com/300', 1, 1);
    insertProduct.run('USB Kablo', 25, 'Type-C kablo', 'https://via.placeholder.com/300', 1, 2);
  }
}

module.exports = { createSchema, seedDemoData };
