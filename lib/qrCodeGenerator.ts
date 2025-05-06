import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export async function generateQRCode(slug: string, domain: string = 'sanalkartvizitim.com'): Promise<string> {
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