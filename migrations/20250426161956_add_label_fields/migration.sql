-- CreateTable
CREATE TABLE "sektorler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ad" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "kategoriler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ad" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "iller" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ad" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ilceler" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ad" TEXT NOT NULL,
    "il_id" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_firmalar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firma_adi" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "telefon" TEXT,
    "eposta" TEXT,
    "whatsapp" TEXT,
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
    "firma_hakkinda_baslik" TEXT DEFAULT 'Hakkımızda',
    "firma_unvan" TEXT,
    "firma_vergi_no" TEXT,
    "vergi_dairesi" TEXT,
    "telegram" TEXT,
    "communication_data" TEXT,
    "social_media_data" TEXT,
    "sektor_id" INTEGER,
    "kategori_id" INTEGER,
    "il_id" INTEGER,
    "ilce_id" INTEGER,
    "onay" BOOLEAN NOT NULL DEFAULT false,
    "tip" TEXT
);
INSERT INTO "new_firmalar" ("bank_accounts", "communication_data", "created_at", "eposta", "facebook", "firma_adi", "firma_hakkinda", "firma_hakkinda_baslik", "firma_unvan", "firma_vergi_no", "goruntulenme", "harita", "id", "instagram", "katalog", "linkedin", "profil_foto", "slug", "social_media_data", "telefon", "telegram", "tiktok", "twitter", "updated_at", "vcard_dosya", "vergi_dairesi", "website", "whatsapp", "yetkili_adi", "yetkili_pozisyon", "youtube") SELECT "bank_accounts", "communication_data", "created_at", "eposta", "facebook", "firma_adi", "firma_hakkinda", "firma_hakkinda_baslik", "firma_unvan", "firma_vergi_no", "goruntulenme", "harita", "id", "instagram", "katalog", "linkedin", "profil_foto", "slug", "social_media_data", "telefon", "telegram", "tiktok", "twitter", "updated_at", "vcard_dosya", "vergi_dairesi", "website", "whatsapp", "yetkili_adi", "yetkili_pozisyon", "youtube" FROM "firmalar";
DROP TABLE "firmalar";
ALTER TABLE "new_firmalar" RENAME TO "firmalar";
CREATE UNIQUE INDEX "firmalar_slug_key" ON "firmalar"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
