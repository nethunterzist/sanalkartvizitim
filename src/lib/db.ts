import mysql from 'mysql2/promise';

// Veritabanı bağlantı bilgileri
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sanal_kartvizit',
  port: parseInt(process.env.DB_PORT || '3306')
};

// Bağlantı havuzu oluşturma
const pool = mysql.createPool(dbConfig);

// Veritabanı sorgularını çalıştırmak için yardımcı fonksiyon
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Veritabanı sorgusu çalıştırılırken hata oluştu:', error);
    throw error;
  }
}

// Veritabanı tablolarını oluşturma
export async function initializeDatabase() {
  try {
    // Admin tablosu
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Firmalar tablosu
    await query(`
      CREATE TABLE IF NOT EXISTS firmalar (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firma_adi VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        telefon VARCHAR(20),
        eposta VARCHAR(100),
        whatsapp VARCHAR(20),
        instagram VARCHAR(255),
        youtube VARCHAR(255),
        website VARCHAR(255),
        harita TEXT,
        profil_foto VARCHAR(255),
        vcard_dosya VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Veritabanı tabloları başarıyla oluşturuldu.');
    
    // Admin kullanıcısı kontrol etme ve yoksa oluşturma
    const admins = await query('SELECT * FROM admins LIMIT 1');
    if (Array.isArray(admins) && admins.length === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await query(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('Varsayılan admin kullanıcısı oluşturuldu.');
    }
  } catch (error) {
    console.error('Veritabanı başlatılırken hata oluştu:', error);
    throw error;
  }
}

export default pool; 