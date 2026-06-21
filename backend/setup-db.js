const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH || './ecocampus.db');
console.log('Veritabanı yolu:', dbPath);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function setupDatabase() {
  try {
    console.log('\nVeritabanı kurulumu başlıyor...\n');

    console.log('Tablolar oluşturuluyor...');

    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    console.log('  OK users tablosu oluşturuldu');

    db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL,
        icon VARCHAR(50)
      )
    `);
    console.log('  OK categories tablosu oluşturuldu');

    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(100) NOT NULL,
        price REAL DEFAULT 0,
        description TEXT,
        image_url TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id)
      )
    `);
    console.log('  OK products tablosu oluşturuldu\n');

    console.log('Örnek veriler ekleniyor...');

    const existingCategories = db.prepare('SELECT COUNT(*) as cnt FROM categories').get();
    if (existingCategories.cnt === 0) {
      db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)').run('Ders Materyalleri', 'book');
      db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)').run('Elektronik', 'laptop');
      db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)').run('Eşya', 'home');
      console.log('  OK 3 kategori eklendi');
    }

    const existingUsers = db.prepare('SELECT COUNT(*) as cnt FROM users').get();
    if (existingUsers.cnt === 0) {
      db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)").run(
        'testuser', 'test@university.edu', '$2b$10$lU0uWjkpTh/G8eK2a4hWIutkncnrMfBbBLwblBXn8VebHWysi0aYu'
      );
      console.log('  OK Test kullanıcı eklendi (email: test@university.edu, sifre: test123)');
    }

    const existingProducts = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
    if (existingProducts.cnt === 0) {
      const insertProduct = db.prepare('INSERT INTO products (title, price, description, image_url, user_id, category_id) VALUES (?, ?, ?, ?, ?, ?)');
      insertProduct.run('Kullanılmış Laptop', 500, 'Dell laptop, çalışıyor', 'https://via.placeholder.com/300', 1, 2);
      insertProduct.run('Bağış: Fizik Ders Notları', 0, 'Bedava dağıtılıyor', 'https://via.placeholder.com/300', 1, 1);
      insertProduct.run('USB Kablo', 25, 'Type-C kablo', 'https://via.placeholder.com/300', 1, 2);
      console.log('  OK 3 test ürünü eklendi\n');
    }

    console.log('Veritabanı kurulumu başarıyla tamamlandı!\n');
    console.log('Test Bilgileri:');
    console.log('   Email: test@university.edu');
    console.log('   Sifre: test123\n');

    db.close();
  } catch (error) {
    console.error('Hata:', error.message);
    process.exit(1);
  }
}

setupDatabase();
