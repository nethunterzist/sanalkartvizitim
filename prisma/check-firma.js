const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkFirma() {
  try {
    // Slug veya isim ile firma ara
    const firma = await prisma.firmalar.findFirst({
      where: {
        OR: [
          { slug: 'asdzzz' },
          { firma_adi: { contains: 'asdzzz' } }
        ]
      },
      select: {
        id: true,
        firma_adi: true,
        slug: true,
        yetkili_adi: true,
        yetkili_pozisyon: true
      }
    });

    console.log('Firma bilgileri:', firma);
    
    if (!firma) {
      console.log('Firma bulunamadı');
    } else {
      console.log('Yetkili adı:', firma.yetkili_adi || 'boş');
      console.log('Yetkili pozisyon:', firma.yetkili_pozisyon || 'boş');
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFirma(); 