// Veritabanı migration betiği
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data/firma.db'
  },
  useNullAsDefault: true
});

console.log('Veritabanı şema güncelleme işlemi başlatılıyor...');

// Veri dizinini kontrol et ve oluştur
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Data dizini oluşturuldu:', dataDir);
}

// Tüm veritabanı dosyalarını bul
const dbFiles = [
  path.join(dataDir, 'database.sqlite'),
  path.join(dataDir, 'sanal_kartvizit.db'),
  path.join(dataDir, 'sanal-kartvizit.db'),
  path.join(dataDir, 'firma.db')
].filter(dbFile => fs.existsSync(dbFile));

if (dbFiles.length === 0) {
  console.log('Hiçbir veritabanı dosyası bulunamadı, varsayılan olarak database.sqlite oluşturulacak');
  dbFiles.push(path.join(dataDir, 'database.sqlite'));
}

console.log(`${dbFiles.length} veritabanı dosyası bulundu:`, dbFiles.join(', '));

// Her veritabanını güncelle
for (const dbFile of dbFiles) {
  console.log(`\n"${dbFile}" dosyası işleniyor...`);

  try {
    // SQLite bağlantısı oluştur
    const db = new Database(dbFile);

    try {
      // Mevcut tablolar listesini al
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='firmalar'").all();
      
      if (tables.length > 0) {
        console.log('Firmalar tablosu mevcut, sütun yapısı kontrol ediliyor...');
        
        // Mevcut sütunları kontrol et
        const columns = db.prepare("PRAGMA table_info(firmalar)").all();
        const columnNames = columns.map(col => col.name);
        console.log('Mevcut sütunlar:', columnNames.join(', '));
        
        // Gerekli sütunları tanımla
        const requiredColumns = [
          { name: 'bank_accounts', type: 'TEXT' },
          { name: 'linkedin', type: 'TEXT' },
          { name: 'twitter', type: 'TEXT' },
          { name: 'facebook', type: 'TEXT' },
          { name: 'goruntulenme', type: 'INTEGER DEFAULT 0' },
          { name: 'katalog', type: 'TEXT' },
          { name: 'firma_hakkinda', type: 'TEXT' },
          { name: 'firma_unvan', type: 'TEXT' },
          { name: 'firma_vergi_no', type: 'TEXT' },
          { name: 'vergi_dairesi', type: 'TEXT' }
        ];
        
        // Eksik sütunları ekle
        for (const col of requiredColumns) {
          if (!columnNames.includes(col.name)) {
            console.log(`"${col.name}" sütunu eksik, ekleniyor...`);
            try {
              db.prepare(`ALTER TABLE firmalar ADD COLUMN ${col.name} ${col.type}`).run();
              console.log(`"${col.name}" sütunu başarıyla eklendi.`);
            } catch (error) {
              console.error(`"${col.name}" sütunu eklenirken hata:`, error);
            }
          } else {
            console.log(`"${col.name}" sütunu zaten mevcut.`);
          }
        }
      } else {
        console.log('Firmalar tablosu bulunamadı, yeni tablo oluşturuluyor...');
        
        // Firmalar tablosunu oluştur
        db.prepare(`
        CREATE TABLE firmalar (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firma_adi TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          telefon TEXT,
          eposta TEXT,
          whatsapp TEXT,
          instagram TEXT,
          youtube TEXT,
          linkedin TEXT,
          twitter TEXT,
          facebook TEXT,
          website TEXT,
          harita TEXT,
          profil_foto TEXT,
          vcard_dosya TEXT,
          yetkili_adi TEXT,
          yetkili_pozisyon TEXT,
          bank_accounts TEXT,
          katalog TEXT,
          goruntulenme INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `).run();
        
        console.log('Firmalar tablosu başarıyla oluşturuldu.');
      }
      
      console.log(`"${dbFile}" dosyası için veritabanı şema güncelleme işlemi tamamlandı.`);
    } catch (error) {
      console.error(`"${dbFile}" dosyası işlenirken veritabanı hatası:`, error);
    } finally {
      // Bağlantıyı kapat
      db.close();
    }
  } catch (error) {
    console.error(`"${dbFile}" dosyası açılırken hata:`, error);
  }
}

console.log('\nTüm veritabanları için şema güncelleme işlemi tamamlandı.');
console.log('\nYAPLAN DEĞİŞİKLİKLER:');
console.log('1. Tüm veritabanı dosyaları tarandı ve güncellendi');
console.log('2. Eksik sütunlar (linkedin, twitter, facebook, bank_accounts, goruntulenme, katalog) eklendi');
console.log('3. Her veritabanı için tek tek işlem yapıldı');
console.log('\nÖNERİLER:');
console.log('1. Bu projede tek bir veritabanı dosyası kullanılması önerilir (database.sqlite)');
console.log('2. app/lib/db.ts dosyasında varsayılan veritabanı dosyası yapılandırılmıştır');
console.log('3. Yeni şema değişiklikleri eklendiğinde bu betiği tekrar çalıştırın');
console.log('\nUYGULAMAYI BAŞLATMA:');
console.log('npm run dev');

// Tablolar var mı kontrol et, yoksa oluştur
async function createTables() {
  // Firmalar tablosu
  const firmaTableExists = await knex.schema.hasTable('firmalar');
  
  if (!firmaTableExists) {
    console.log('Firmalar tablosu oluşturuluyor...');
    
    await knex.schema.createTable('firmalar', (table) => {
      table.increments('id').primary();
      table.string('firma_adi').notNullable();
      table.string('slug').notNullable().unique();
      table.string('telefon');
      table.string('eposta');
      table.string('whatsapp');
      table.string('instagram');
      table.string('youtube');
      table.string('website');
      table.string('harita');
      table.string('linkedin');
      table.string('twitter');
      table.string('facebook');
      table.string('profil_foto');
      table.string('vcard_dosya');
      table.string('katalog'); // Katalog PDF dosyası için alan
      table.timestamps(true, true);
    });
    
    console.log('Firmalar tablosu başarıyla oluşturuldu.');
  } else {
    // Tabloyu güncelle, katalog alanı var mı kontrol et
    const hasKatalogColumn = await knex.schema.hasColumn('firmalar', 'katalog');
    
    if (!hasKatalogColumn) {
      console.log('Firmalar tablosuna katalog alanı ekleniyor...');
      
      await knex.schema.table('firmalar', (table) => {
        table.string('katalog');
      });
      
      console.log('Katalog alanı başarıyla eklendi.');
    }
  }
}

// Tabloları oluştur ve bağlantıyı kapat
createTables()
  .then(() => {
    console.log('Migration tamamlandı.');
    return knex.destroy();
  })
  .catch((error) => {
    console.error('Migration hatası:', error);
    return knex.destroy();
  }); 