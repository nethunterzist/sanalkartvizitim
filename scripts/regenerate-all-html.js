const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { generateHtmlForFirma } = require('../app/lib/htmlGenerator');
const { generateVcard } = require('../app/lib/vcardGenerator');

const prisma = new PrismaClient();

async function regenerateAllHtml() {
  console.log('Tüm HTML sayfalarını yeniden oluşturma başlatılıyor...');
  
  try {
    // Tüm firmaları getir
    const firmalar = await prisma.firmalar.findMany();
    console.log(`${firmalar.length} firma bulundu.`);
    
    for (const firma of firmalar) {
      console.log(`İşleniyor: ${firma.firma_adi} (${firma.slug})`);
      
      try {
        // Firma verilerini hazırla
        const firmaData = {
          firma_adi: firma.firma_adi,
          slug: firma.slug,
          telefon: firma.telefon,
          eposta: firma.eposta,
          whatsapp: firma.whatsapp,
          telegram: firma.telegram,
          instagram: firma.instagram,
          youtube: firma.youtube,
          linkedin: firma.linkedin,
          twitter: firma.twitter,
          facebook: firma.facebook,
          tiktok: firma.tiktok,
          website: firma.website,
          harita: firma.harita,
          profil_foto: firma.profil_foto,
          yetkili_adi: firma.yetkili_adi,
          yetkili_pozisyon: firma.yetkili_pozisyon,
          katalog: firma.katalog,
          firma_hakkinda: firma.firma_hakkinda,
          firma_hakkinda_baslik: firma.firma_hakkinda_baslik,
          firma_unvan: firma.firma_unvan,
          firma_vergi_no: firma.firma_vergi_no,
          vergi_dairesi: firma.vergi_dairesi,
          bank_accounts: firma.bank_accounts,
          // Etiketler
          instagram_label: firma.instagram_label,
          facebook_label: firma.facebook_label,
          twitter_label: firma.twitter_label,
          linkedin_label: firma.linkedin_label,
          youtube_label: firma.youtube_label,
          tiktok_label: firma.tiktok_label,
          website_label: firma.website_label,
          harita_label: firma.harita_label,
          communication_data: firma.communication_data,
          social_media_data: firma.social_media_data
        };
        
        // İletişim verileri ve sosyal medya verilerini parse et
        if (firma.communication_data) {
          try {
            firmaData.communicationData = JSON.parse(firma.communication_data);
          } catch (e) {
            console.warn(`${firma.slug} için iletişim verileri parse edilemedi:`, e.message);
          }
        }
        
        if (firma.social_media_data) {
          try {
            firmaData.socialMediaData = JSON.parse(firma.social_media_data);
          } catch (e) {
            console.warn(`${firma.slug} için sosyal medya verileri parse edilemedi:`, e.message);
          }
        }
        
        // HTML içeriğini oluştur
        const htmlContent = await generateHtmlForFirma(firmaData);
        
        // Firma için klasör oluştur
        const firmaDirPath = path.join(process.cwd(), 'public', firma.slug);
        if (!fs.existsSync(firmaDirPath)) {
          fs.mkdirSync(firmaDirPath, { recursive: true });
        }
        
        // HTML dosyasını kaydet
        const htmlPath = path.join(firmaDirPath, 'index.html');
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`${firma.slug} için HTML sayfası oluşturuldu: ${htmlPath}`);
        
        // vCard dosyasını oluştur ve kaydet
        try {
          const vcardContent = generateVcard(firmaData);
          const vcardPath = path.join(firmaDirPath, `${firma.slug}.vcf`);
          fs.writeFileSync(vcardPath, vcardContent);
          console.log(`${firma.slug} için vCard dosyası oluşturuldu: ${vcardPath}`);
        } catch (e) {
          console.warn(`${firma.slug} için vCard oluşturulamadı:`, e.message);
        }
      } catch (error) {
        console.error(`${firma.slug} işlenirken hata oluştu:`, error);
      }
    }
    
    console.log('Tüm HTML sayfaları başarıyla yeniden oluşturuldu.');
  } catch (error) {
    console.error('HTML sayfalarını yeniden oluşturma hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Scripti çalıştır
regenerateAllHtml(); 