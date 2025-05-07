import multer from 'multer';
import { Request } from 'express';
import path from 'path';

// Upload klasörünü oluştur (yoksa)
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Dosya depolama konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    // Orijinal dosya adını al ve özel karakterleri temizle
    const originalName = file.originalname;
    const fileExt = path.extname(originalName);
    const baseName = path.basename(originalName, fileExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    
    // Benzersiz bir dosya adı oluştur
    const uniqueName = `${baseName}-${Date.now()}${fileExt}`;
    cb(null, uniqueName);
  }
});

// Dosya filtreleme (sadece belirli dosya türlerini kabul et)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Profil fotoğrafı için izin verilen dosya türleri
  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  // VCard için izin verilen dosya türleri
  const allowedVCardTypes = [
    'text/vcard',
    'text/x-vcard',
    'application/octet-stream'
  ];
  
  // Dosya türüne göre kontrol et
  if (file.fieldname === 'profilFoto' && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'vcardDosya' && 
            (allowedVCardTypes.includes(file.mimetype) || file.originalname.endsWith('.vcf'))) {
    cb(null, true);
  } else {
    cb(new Error('Desteklenmeyen dosya türü!'));
  }
};

// Multer yapılandırması
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload; 