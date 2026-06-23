const fs = require('fs');
const path = require('path');
const { seedDemoData } = require('./seed');

async function createSchema(db) {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await db.query(sql);
  }
}

module.exports = { createSchema, seedDemoData };
