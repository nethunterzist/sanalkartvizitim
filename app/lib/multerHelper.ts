import { NextRequest } from 'next/server';
import formidable from 'formidable';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

// Upload dizini
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Upload dizinini oluştur (yoksa)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// FormData'yı ayrıştırır
export async function parseForm(req: NextRequest) {
  console.log('parseForm başladı - Request Method:', req.method);
  console.log('Content-Type:', req.headers.get('content-type'));
  
  try {
    // Upload dizinini kontrol et
    if (!fs.existsSync(uploadDir)) {
      console.log('Upload dizini bulunamadı, oluşturuluyor:', uploadDir);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Formidable options
    const options = {
      uploadDir,
      keepExtensions: true,
      maxFiles: 5,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowEmptyFiles: true,
      multiples: true,
      filename: (name: string, ext: string, part: formidable.Part) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${part.name || 'unknown'}-${uniqueSuffix}${ext}`;
        console.log("Oluşturulan dosya adı:", filename);
        return filename;
      },
      filter: (part: formidable.Part) => {
        console.log('Filter çalıştı, part:', part.name, part.mimetype);
        
        // Alan bir dosya değilse kabul et
        if (!part.mimetype) {
          console.log('Dosya olmayan alan, kabul edildi');
          return true;
        }
        
        // Dosya türü filtreleme
        if (part.name === 'profilFoto') {
          const allowed = part.mimetype?.includes('image/') || false;
          console.log('Profil fotoğrafı filtresi sonucu:', allowed, 'MIME Tipi:', part.mimetype);
          return allowed;
        }
        
        if (part.name === 'vcardDosya') {
          const allowed = part.mimetype?.includes('text/vcard') || 
                      part.originalFilename?.endsWith('.vcf') || 
                      false;
          console.log('vCard filtresi sonucu:', allowed);
          return allowed;
        }
        
        console.log('Diğer alan kabul edildi:', part.name);
        return true;
      }
    };
    
    const form = formidable(options);

    // NextRequest stream'ini formidable için hazırla
    const readableStream = new Readable({
      read() {
        this.push(null);
      },
    });

    const arrayBuffer = await req.arrayBuffer();
    console.log('ArrayBuffer alındı, boyut:', arrayBuffer.byteLength);
    
    if (arrayBuffer.byteLength === 0) {
      console.error('HATA: Boş request body');
      throw new Error('Request body boş');
    }
    
    const buffer = Buffer.from(arrayBuffer);
    readableStream.push(buffer);

    return new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(readableStream as any, (err, fields, files) => {
        if (err) {
          console.error('Form ayrıştırma hatası:', err);
          reject(err);
          return;
        }
        console.log('Form başarıyla ayrıştırıldı. Alanlar:', Object.keys(fields));
        console.log('Yüklenen dosyalar:', Object.keys(files));
        resolve({ fields, files });
      });
    });
  } catch (error) {
    console.error('parseForm fonksiyonunda beklenmeyen hata:', error);
    throw error;
  }
}

// Yüklenen dosyaları işle ve yollarını döndür
export async function processImages(files: any) {
  console.log('processImages başladı, gelen dosyalar:', files);
  let profilFoto = null;
  let vcardDosya = null;

  // Profil fotoğrafı
  if (files.profilFoto && files.profilFoto[0]) {
    const file = files.profilFoto[0];
    profilFoto = `/uploads/${path.basename(file.filepath)}`;
    console.log('Profil fotoğrafı işlendi:', profilFoto);
  }

  // VCard dosyası
  if (files.vcardDosya && files.vcardDosya[0]) {
    const file = files.vcardDosya[0];
    vcardDosya = `/uploads/${path.basename(file.filepath)}`;
    console.log('VCard dosyası işlendi:', vcardDosya);
  }

  return { profilFoto, vcardDosya };
} 