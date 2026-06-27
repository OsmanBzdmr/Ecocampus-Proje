const db = require('./mockDbSingleton');
const { createSchema, seedDemoData } = require('../../db/schema');

/**
 * Mock veritabanını temizler, şemayı yeniden kurar ve demo verileri
 * (3 kategori, test kullanıcısı, 10 ürün) ekler. Testlerde beforeEach
 * içinde çağrılarak her testin temiz/öngörülebilir bir durumdan
 * başlaması sağlanır.
 */
async function resetAndSeed() {
  db.__reset();
  await createSchema(db);
  await seedDemoData(db);
}

module.exports = { db, resetAndSeed };
