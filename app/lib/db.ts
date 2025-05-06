import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import { resolve } from 'path';
import { unlink } from 'fs/promises';

// Veri dizinini kontrol et ve oluştur
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Veritabanı dosya yolu
const dbFile = path.join(dataDir, 'sanal-kartvizit.db');

// Diğer veritabanı dosyalarını kontrol et
const alternateDbs = [
  path.join(dataDir, 'sanal_kartvizit.db'),
  path.join(dataDir, 'database.sqlite')
];

// Alternatif veritabanları hakkında bilgilendirme yap
alternateDbs.forEach(altDbFile => {
  if (fs.existsSync(altDbFile) && altDbFile !== dbFile) {
    console.log(`Alternatif veritabanı dosyası bulundu: ${altDbFile}`);
    console.log(`Artık tek veritabanı dosyası kullanılacak: ${dbFile}`);
  }
});

// Prisma client'ı oluştur
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Tüm firmaları veritabanından getirir (Prisma ile)
 * @returns Firma listesi
 */
export async function getAllFirmalar() {
  return await prisma.firmalar.findMany({
    orderBy: {
      firma_adi: 'asc'
    }
  });
}

/**
 * Deletes a file from the uploads directory
 */
export async function deleteUploadedFile(filename: string | null | undefined) {
  if (!filename) return;

  try {
    const filePath = resolve(process.cwd(), 'public/uploads', filename);
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

/**
 * Ensures that the database is ready for use
 * - Creates a default admin user if none exists
 * - Creates default icon priorities if none exist
 */
export async function ensureDatabaseIsReady() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Connected to database');

    try {
      // Create default admin user if none exists
      const adminCount = await prisma.admins.count();
      if (adminCount === 0) {
        const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
        const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.admins.create({
          data: {
            username,
            password: hashedPassword,
          },
        });
        console.log(`Created default admin user: ${username}`);
      }
      
      // Create default icon priorities if none exist
      const iconCount = await prisma.icon.count();
      if (iconCount === 0) {
        const defaultPriorities = [
          { name: 'Telefon', priority: 10 },
          { name: 'WhatsApp', priority: 20 },
          { name: 'Mail', priority: 30 },
          { name: 'Instagram', priority: 40 },
          { name: 'YouTube', priority: 50 },
          { name: 'LinkedIn', priority: 60 },
          { name: 'Twitter', priority: 70 },
          { name: 'Facebook', priority: 80 },
          { name: 'Web Sitesi', priority: 90 },
          { name: 'Harita', priority: 100 },
        ];

        await prisma.icon.createMany({
          data: defaultPriorities,
        });
        console.log('Created default icon priorities');
      }
      
      console.log('Veritabanı tabloları başarıyla oluşturuldu ve güncellendi.');
    } catch (error) {
      console.error('Database setup error:', error);
      throw error;
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Dışa aktar
export default prisma; 