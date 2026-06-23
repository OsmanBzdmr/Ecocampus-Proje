const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecocampus',
});

async function runMigrations() {
  // Migrations tablosunu oluştur (tracking için)
  await db.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // SQL dosyalarını oku, sırala
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    // Daha önce uygulanmış mı?
    const { rows } = await db.query('SELECT id FROM _migrations WHERE name = $1', [file]);
    if (rows.length > 0) {
      console.log(`  SKIP ${file} (zaten uygulanmış)`);
      continue;
    }

    // Uygula
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`  OK ${file} uygulanıyor...`);
    await db.query(sql);
    await db.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
  }
}

module.exports = { runMigrations, db };

// Tek başına çalıştırıldığında
if (require.main === module) {
  (async () => {
    try {
      console.log('\nMigrationlar calistiriliyor...\n');
      await runMigrations();
      console.log('\nMigrationlar basariyla tamamlandi!\n');
      await db.end();
    } catch (err) {
      console.error('Migration hatası:', err.message);
      process.exit(1);
    }
  })();
}
