-- Yöneticiler tablosu
CREATE TABLE IF NOT EXISTS yoneticiler (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kullanici_adi TEXT NOT NULL UNIQUE,
  sifre TEXT NOT NULL,
  ad_soyad TEXT,
  eposta TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Firmalar tablosu
CREATE TABLE IF NOT EXISTS firmalar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firma_adi TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  telefon TEXT,
  eposta TEXT,
  whatsapp TEXT,
  instagram TEXT,
  youtube TEXT,
  website TEXT,
  harita TEXT,
  profil_foto TEXT,
  yetkili_adi TEXT,
  yetkili_pozisyon TEXT,
  goruntulenme INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Örnek yönetici ekle (varsayılan şifre: admin123)
INSERT OR IGNORE INTO yoneticiler (kullanici_adi, sifre, ad_soyad, eposta) 
VALUES ('admin', '$2b$10$mUm0/KXU/KqESTVaQ83YuOKQA6xIxxSe9Sh0WD3Z/p3JVXsA2tN8.', 'Admin Kullanıcı', 'admin@example.com'); 