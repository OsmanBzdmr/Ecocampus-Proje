const { runMigrations, db } = require('./run-migrations');
const { seedDemoData } = require('./db/seed');

async function setupDatabase() {
  try {
    console.log('\nVeritabanı kurulumu başlıyor...\n');

    console.log('Migrationlar calistiriliyor...');
    await runMigrations();
    console.log('  OK Tum migrationlar basariyla uygulandi\n');

    console.log('Ornek veriler ekleniyor...');
    await seedDemoData(db);
    console.log('  OK 3 kategori eklendi');
    console.log('  OK Test kullanici eklendi (email: test@university.edu, sifre: test123)');
    console.log('  OK 10 test urunu eklendi\n');

    console.log('Veritabani kurulumu basariyla tamamlandi!\n');
    console.log('Test Bilgileri:');
    console.log('   Email: test@university.edu');
    console.log('   Sifre: test123\n');

    await db.end();
  } catch (error) {
    console.error('Hata:', error.message);
    process.exit(1);
  }
}

setupDatabase();
