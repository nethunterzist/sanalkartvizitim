-- SQLite veritabanı tablo eşleme
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "checksum" TEXT NOT NULL,
  "finished_at" DATETIME,
  "migration_name" TEXT NOT NULL,
  "logs" TEXT,
  "rolled_back_at" DATETIME,
  "started_at" DATETIME NOT NULL DEFAULT current_timestamp,
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);

-- Adlandırma eşleştirmeleri
PRAGMA foreign_keys=OFF;

-- firmalar tablosunu Firma modeline eşle
ALTER TABLE "firmalar" RENAME TO "Firma";

-- admins tablosunu User modeline eşle
ALTER TABLE "admins" RENAME TO "User";

-- Icon tablosunu IconPriority modeline eşle
ALTER TABLE "Icon" RENAME TO "IconPriority";

PRAGMA foreign_keys=ON; 