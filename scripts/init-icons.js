
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDefaultIcons() {
  try {
    const defaultIcons = [
      { name: 'Telefon', priority: 1 },
      { name: 'Mail', priority: 2 },
      { name: 'Paylaş', priority: 3 },
      { name: 'IBAN Bilgileri', priority: 4 },
      { name: 'Whatsapp', priority: 5 },
      { name: 'Katalog', priority: 6 },
      { name: 'Hakkımızda', priority: 7 },
      { name: 'Vergi Bilgileri', priority: 8 },
      { name: 'Web Sitesi', priority: 9 },
      { name: 'Instagram', priority: 10 },
      { name: 'Facebook', priority: 11 },
      { name: 'YouTube', priority: 12 },
      { name: 'LinkedIn', priority: 13 },
      { name: 'Twitter', priority: 14 },
      { name: 'Harita', priority: 15 }
    ];
    
    console.log('Varsayılan ikonlar oluşturuluyor...');
    
    // Önce mevcut tüm ikonları temizle
    await prisma.icon.deleteMany({});
    console.log('Mevcut ikonlar temizlendi');
    
    // Yeni ikonları ekle
    for (const icon of defaultIcons) {
      await prisma.icon.create({
        data: icon
      });
      console.log(`Eklendi: ${icon.name}, Öncelik: ${icon.priority}`);
    }
    
    console.log('İşlem tamamlandı!');
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultIcons(); 