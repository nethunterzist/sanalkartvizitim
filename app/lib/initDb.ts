import { ensureDatabaseIsReady } from './db';

// Veritabanını başlat
try {
  ensureDatabaseIsReady()
    .then(() => {
      console.log('Veritabanı başarıyla başlatıldı');
    })
    .catch((error) => {
      console.error('Veritabanı başlatılırken hata oluştu:', error);
    });
} catch (error) {
  console.error('Veritabanı başlatılırken hata oluştu:', error);
}

export default function Init() {
  return null;
} 