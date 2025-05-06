const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFirmaDetails() {
  try {
    console.log('Veritabanında asdzzz adlı firma kaydı aranıyor...');
    
    const firma = await prisma.firmalar.findFirst({
      where: {
        OR: [
          { slug: 'asdzzz' },
          { firma_adi: { contains: 'asdzzz' } },
        ]
      },
    });
    
    if (!firma) {
      console.log('Firma bulunamadı!');
      return;
    }
    
    console.log('Firma bulundu (ID:', firma.id, ')');
    console.log('----------------------------');
    console.log('TÜM FİRMA VERİLERİ:');
    console.log(JSON.stringify(firma, null, 2));
    console.log('----------------------------');
    
  } catch (error) {
    console.error('Hata oluştu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFirmaDetails(); 