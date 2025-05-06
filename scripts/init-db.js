// Veritabanı başlatma scripti
// Bu script, veritabanı tablolarını oluşturur ve varsayılan admin kullanıcısını ekler

const fs = require('fs');
const path = require('path');
const sqlite3 = require('better-sqlite3');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

// Veri dizinini kontrol et ve yoksa oluştur
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFile = process.env.DB_FILE;
const dbPath = path.join(process.cwd(), dbFile);

try {
  // SQLite veritabanı bağlantısı oluştur
  const db = new sqlite3(dbPath);
  
  // Admin tablosunu oluştur
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Firmalar tablosunu oluştur
  db.exec(`
    CREATE TABLE IF NOT EXISTS firmalar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firma_adi TEXT NOT NULL,
      firma_aciklama TEXT,
      firma_logo TEXT,
      firma_banner TEXT,
      website TEXT,
      telefon TEXT,
      email TEXT,
      adres TEXT,
      sosyal_medya TEXT,
      qr_kod TEXT,
      slug TEXT UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Varsayılan admin kullanıcısı kontrolü
  const adminKontrol = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
  
  if (!adminKontrol) {
    // Varsayılan şifreyi hashle ve admin kullanıcısını oluştur
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);
    
    db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('Varsayılan admin kullanıcısı oluşturuldu.');
  } else {
    console.log('Admin kullanıcısı zaten mevcut.');
  }
  
  console.log('Veritabanı başarıyla başlatıldı.');
  db.close();
} catch (err) {
  console.error('Veritabanı başlatma hatası:', err);
  process.exit(1);
} 