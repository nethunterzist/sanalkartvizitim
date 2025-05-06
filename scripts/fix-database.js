// Veritabanı onarım betiği - Eksik alanları eklemek için
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// Ana veritabanı dosya yolu
const dbPath = path.join(__dirname, '../data/sanal-kartvizit.db');

async function fixDatabase() {
  console.log(`Veritabanı onarım betiği başlatılıyor...`);
  console.log(`Veritabanı yolu: ${dbPath}`);

  try {
    // SQLite veritabanını aç
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('Veritabanı bağlantısı başarılı.');

    // Eksik alanları kontrol et ve ekle
    // Tablo bilgilerini al
    const tableInfo = await db.all("PRAGMA table_info(firmalar)");
    
    // Mevcut alan adlarını al
    const columnNames = tableInfo.map(col => col.name);
    console.log('Mevcut alanlar:', columnNames.join(', '));

    // Olması gereken alanları tanımla
    const requiredColumns = [
      { name: 'firma_logo', type: 'TEXT' },
      // Diğer olması gereken alanlar buraya eklenebilir
    ];

    // Eksik alanları ekle
    for (const column of requiredColumns) {
      if (!columnNames.includes(column.name)) {
        console.log(`Eksik alan tespit edildi: ${column.name}, ekleniyor...`);
        
        try {
          await db.exec(`ALTER TABLE firmalar ADD COLUMN ${column.name} ${column.type};`);
          console.log(`Alan başarıyla eklendi: ${column.name}`);
        } catch (error) {
          console.error(`Alan eklenirken hata oluştu: ${column.name}`, error);
        }
      } else {
        console.log(`Alan zaten mevcut: ${column.name}`);
      }
    }

    // Prisma şemasını güncelle
    console.log('Prisma şemasını güncellemek için çalıştırmanız gereken komutlar:');
    console.log('npx prisma db pull');
    console.log('npx prisma generate');

    await db.close();
    console.log('Veritabanı bağlantısı kapatıldı.');
    console.log('Veritabanı onarım işlemi tamamlandı.');

  } catch (error) {
    console.error('Veritabanı onarım hatası:', error);
  }
}

// Betiği çalıştır
fixDatabase(); 