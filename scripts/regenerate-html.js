// Firma HTML sayfalarını yeniden oluşturmak için script
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
// Import yolunu düzeltelim
const htmlGeneratorPath = path.join(process.cwd(), 'app/lib/htmlGenerator');
console.log(`HTML Generator modülü aranıyor: ${htmlGeneratorPath}`);

// Dosya var mı kontrol edelim
// HTML Generator modülünü bulmaya çalışalım
let htmlGeneratorModule;
try {
  // Farklı olası yolları deneyelim
  const possiblePaths = [
    '../app/lib/htmlGenerator',
    './app/lib/htmlGenerator',
    './lib/htmlGenerator',
    '../lib/htmlGenerator'
  ];
  
  for (const modulePath of possiblePaths) {
    try {
      console.log(`Deneniyor: ${modulePath}`);
      htmlGeneratorModule = require(modulePath);
      console.log(`HTML Generator modülü bulundu: ${modulePath}`);
      break;
    } catch (e) {
      console.log(`${modulePath} bulunamadı`);
    }
  }
  
  if (!htmlGeneratorModule) {
    throw new Error('HTML Generator modülü bulunamadı');
  }
} catch (error) {
  console.error('HTML Generator modülü yükleme hatası:', error);
  console.log('Manuel olarak HTML oluşturma yapılacak');
  
  // htmlGenerator modülünü oluşturalım
  htmlGeneratorModule = {
    generateHtmlForFirma: async function(firma) {
      console.log(`${firma.firma_adi} için HTML manuel oluşturuluyor...`);
      
      // Firma için klasör yolu
      const firmaDir = path.join(process.cwd(), 'public', firma.slug);
      if (!fs.existsSync(firmaDir)) {
        fs.mkdirSync(firmaDir, { recursive: true });
      }
      
      // Var olan HTML dosyasını oku ve temizle
      const htmlPath = path.join(firmaDir, 'index.html');
      
      if (fs.existsSync(htmlPath)) {
        console.log(`Mevcut HTML dosyası temizleniyor: ${htmlPath}`);
        
        // HTML'i oku
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        
        // İkon konteynerini bul ve temizle
        if (htmlContent.includes('id="icons-container"')) {
          const iconContainerStart = htmlContent.indexOf('<div', htmlContent.indexOf('id="icons-container"'));
          if (iconContainerStart !== -1) {
            const iconContainerEndTag = '</div>';
            let iconContainerEnd = -1;
            let depth = 0;
            
            // İç içe div'leri takip ederek doğru container sonunu bul
            for (let i = iconContainerStart; i < htmlContent.length; i++) {
              if (htmlContent.substring(i, i + 5) === '<div ') {
                depth++;
              } else if (htmlContent.substring(i, i + 6) === '</div>') {
                depth--;
                if (depth === 0) {
                  iconContainerEnd = i + 6;
                  break;
                }
              }
            }
            
            if (iconContainerEnd !== -1) {
              // Konteyner içini temizleyelim
              const containerStartContent = htmlContent.substring(0, iconContainerStart);
              const containerEndContent = htmlContent.substring(iconContainerEnd);
              
              // Yeni temiz bir konteyner oluşturalım
              const newIconsContainer = `<div class="container" id="icons-container">\n<div class="row justify-content-center w-100">\n</div>\n</div>`;
              
              // HTML'i güncelle
              htmlContent = containerStartContent + newIconsContainer + containerEndContent;
              
              // Dosyayı kaydet
              fs.writeFileSync(htmlPath, htmlContent);
              console.log(`İkonlar temizlendi: ${firma.slug}`);
            }
          }
        }
        
        return htmlPath;
      } else {
        console.log(`HTML dosyası bulunamadı: ${htmlPath}`);
        return '';
      }
    }
  };
}

const { generateHtmlForFirma } = htmlGeneratorModule;

const prisma = new PrismaClient();

async function regenerateHtml(slugList) {
  try {
    console.log('HTML sayfaları yeniden oluşturuluyor...');
    
    // Tüm firmaları al veya belirli slugları kullan
    let firmalar;
    if (slugList && slugList.length > 0) {
      firmalar = await prisma.firmalar.findMany({
        where: { slug: { in: slugList } }
      });
      console.log(`Belirtilen ${slugList.length} firma için HTML sayfaları yeniden oluşturulacak.`);
    } else {
      firmalar = await prisma.firmalar.findMany();
      console.log(`Toplam ${firmalar.length} firma için HTML sayfaları yeniden oluşturulacak.`);
    }
    
    // Her firma için HTML sayfası oluştur
    for (const firma of firmalar) {
      try {
        console.log(`${firma.firma_adi} (${firma.slug}) için HTML oluşturuluyor...`);
        const htmlPath = await generateHtmlForFirma(firma);
        console.log(`${firma.firma_adi} için HTML başarıyla oluşturuldu: ${htmlPath}`);
      } catch (error) {
        console.error(`${firma.firma_adi} için HTML oluşturulurken hata:`, error);
      }
    }
    
    console.log('HTML sayfaları yeniden oluşturma işlemi tamamlandı.');
  } catch (error) {
    console.error('HTML yeniden oluşturma hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Komut satırından alınan parametreler
const args = process.argv.slice(2);
const slugs = args.length > 0 ? args : ['digital-tekstil', 'anadolu-nakliyat', 'smart-tekstil']; // Boş ise tüm firmalar

// Fonksiyonu çalıştır
regenerateHtml(slugs)
  .then(() => console.log('İşlem tamamlandı.'))
  .catch(console.error); 