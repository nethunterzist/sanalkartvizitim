#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Tüm HTML dosyalarında değer gösterimi düzeltiliyor...');

// public klasöründeki tüm HTML dosyalarını bul
const publicDir = path.join(process.cwd(), 'public');
const htmlFiles = glob.sync(path.join(publicDir, '**/index.html'));

console.log(`${htmlFiles.length} HTML dosyası bulundu.`);

// Her dosyayı işle
htmlFiles.forEach(htmlFile => {
  try {
    const firmaDizini = path.basename(path.dirname(htmlFile));
    console.log(`İşleniyor: ${firmaDizini}/index.html`);
    
    // Dosya içeriğini oku
    let htmlContent = fs.readFileSync(htmlFile, 'utf-8');
    
    // İletişim değerlerini kaldır (app/[slug]/page.tsx dosyasındaki yöntem)
    const regex1 = /<span class="mt-1 text-center small icon-value">(.*?)<\/span>/g;
    htmlContent = htmlContent.replace(regex1, '');
    
    // İletişim değerleri (contact-value içinde)
    htmlContent = htmlContent.replace(/<span class="contact-label">(.*?):<\/span>/g, '<span class="contact-label">$1</span>');
    htmlContent = htmlContent.replace(/<a href="(tel|mailto|https):.*?">(.*?)<\/a>/g, '<a href="$1:$2" class="d-none">$2</a>');
    
    // Değişiklikleri dosyaya kaydet
    fs.writeFileSync(htmlFile, htmlContent);
    console.log(`${firmaDizini}/index.html dosyası başarıyla güncellendi.`);
  } catch (error) {
    console.error(`Dosya işlenirken hata: ${htmlFile}`, error);
  }
});

console.log('Tüm HTML dosyalarında değer gösterimi düzeltildi.'); 