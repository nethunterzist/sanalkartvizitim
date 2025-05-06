-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Firma" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firma_adi" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "telefon" TEXT,
    "eposta" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "website" TEXT,
    "harita" TEXT,
    "profil_foto" TEXT,
    "yetkili_adi" TEXT,
    "yetkili_pozisyon" TEXT,
    "katalog" TEXT,
    "firma_hakkinda" TEXT,
    "firma_unvan" TEXT,
    "firma_vergi_no" TEXT,
    "vergi_dairesi" TEXT,
    "bank_accounts" TEXT,
    "goruntulenme" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IconPriority" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "icon_key" TEXT NOT NULL,
    "priority" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setting_key" TEXT NOT NULL,
    "setting_value" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Firma_slug_key" ON "Firma"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "IconPriority_icon_key_key" ON "IconPriority"("icon_key");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_setting_key_key" ON "SiteSettings"("setting_key");
