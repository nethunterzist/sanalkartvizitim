import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';

const prisma = new PrismaClient();

// UYARI: Bu script sadece local geliştirme için kullanılmalıdır. Vercel gibi sunucusuz ortamlarda çalışmaz!
// QR kodlarını dosya sistemine yazmak Vercel'de mümkün değildir.
// Sadece toDataURL ile base64 olarak QR kodu üretip kullanın.

// QR kod oluşturma fonksiyonu
async function generateQRCode(slug: string, domain: string = 'sanalkartvizitim.com'): Promise<string> {
  const url = `https://${domain}/${slug}`;
  const dirPath = path.join(process.cwd(), 'public', 'qrcodes');
  const filePath = path.join(dirPath, `${slug}.png`);
  
  // QR kod klasörü kontrolü
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // QR kod oluşturma
  try {
    await QRCode.toFile(filePath, url, {
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      width: 256,
      margin: 1,
      errorCorrectionLevel: 'H'
    });
    
    return `/qrcodes/${slug}.png`;
  } catch (error) {
    console.error('QR kod oluşturma hatası:', error);
    throw error;
  }
}

async function main() {
  try {
    // Tüm firmaları al
    const firmalar = await prisma.firmalar.findMany();
    
    console.log(`Toplam ${firmalar.length} firma için QR kod oluşturulacak`);
    
    let basarili = 0;
    let basarisiz = 0;
    
    // Her firma için QR kod oluştur
    for (const firma of firmalar) {
      try {
        console.log(`${firma.firma_adi} (${firma.slug}) için QR kod oluşturuluyor...`);
        await generateQRCode(firma.slug);
        basarili++;
      } catch (error) {
        console.error(`${firma.firma_adi} (${firma.slug}) için QR kod oluşturulurken hata:`, error);
        basarisiz++;
      }
    }
    
    console.log(`İşlem tamamlandı: ${basarili} başarılı, ${basarisiz} başarısız`);
  } catch (error) {
    console.error('QR kod oluşturma hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Scripti çalıştır
main(); 