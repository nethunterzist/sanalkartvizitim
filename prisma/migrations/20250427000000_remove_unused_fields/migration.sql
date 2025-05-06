-- Önce firmalar tablosundan kullanılmayan alanları kaldıralım
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_firmalar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firma_adi" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "telefon" TEXT,
    "eposta" TEXT,
    "whatsapp" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "website" TEXT,
    "harita" TEXT,
    "profil_foto" TEXT,
    "vcard_dosya" TEXT,
    "yetkili_adi" TEXT,
    "yetkili_pozisyon" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goruntulenme" INTEGER NOT NULL DEFAULT 0,
    "bank_accounts" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "tiktok" TEXT,
    "katalog" TEXT,
    "firma_hakkinda" TEXT,
    "firma_unvan" TEXT,
    "firma_vergi_no" TEXT,
    "vergi_dairesi" TEXT,
    "firma_hakkinda_baslik" TEXT,
    "communication_data" TEXT,
    "social_media_data" TEXT,
    "instagram_label" TEXT,
    "facebook_label" TEXT,
    "twitter_label" TEXT,
    "linkedin_label" TEXT,
    "youtube_label" TEXT,
    "tiktok_label" TEXT,
    "website_label" TEXT,
    "harita_label" TEXT
);

INSERT INTO "new_firmalar" (
    "id", "firma_adi", "slug", "telefon", "eposta", "whatsapp", "telegram", "instagram", 
    "youtube", "website", "harita", "profil_foto", "vcard_dosya", "yetkili_adi", 
    "yetkili_pozisyon", "created_at", "updated_at", "goruntulenme", "bank_accounts", 
    "linkedin", "twitter", "facebook", "tiktok", "katalog", "firma_hakkinda", 
    "firma_unvan", "firma_vergi_no", "vergi_dairesi", "firma_hakkinda_baslik", 
    "communication_data", "social_media_data", "instagram_label", "facebook_label", 
    "twitter_label", "linkedin_label", "youtube_label", "tiktok_label", 
    "website_label", "harita_label"
) SELECT 
    "id", "firma_adi", "slug", "telefon", "eposta", "whatsapp", "telegram", "instagram", 
    "youtube", "website", "harita", "profil_foto", "vcard_dosya", "yetkili_adi", 
    "yetkili_pozisyon", "created_at", "updated_at", "goruntulenme", "bank_accounts", 
    "linkedin", "twitter", "facebook", "tiktok", "katalog", "firma_hakkinda", 
    "firma_unvan", "firma_vergi_no", "vergi_dairesi", "firma_hakkinda_baslik", 
    "communication_data", "social_media_data", "instagram_label", "facebook_label", 
    "twitter_label", "linkedin_label", "youtube_label", "tiktok_label", 
    "website_label", "harita_label"
FROM "firmalar";

DROP TABLE "firmalar";
ALTER TABLE "new_firmalar" RENAME TO "firmalar";
CREATE UNIQUE INDEX "firmalar_slug_key" ON "firmalar"("slug");

-- Kullanılmayan tabloları kaldıralım
DROP TABLE IF EXISTS "sektorler";
DROP TABLE IF EXISTS "kategoriler";
DROP TABLE IF EXISTS "iller";
DROP TABLE IF EXISTS "ilceler";

PRAGMA foreign_keys=ON; 