// Prisma modelini veritabanıyla senkronize etmek için betik
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Komut çalıştırılıyor: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Komut hatası: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        reject(error);
        return;
      }
      
      console.log(`Stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function regeneratePrisma() {
  try {
    console.log('Prisma yeniden oluşturma başladı...');
    
    // 1. Prisma önbellek ve modüllerini temizle
    console.log('Önbellekleri temizleme...');
    await runCommand('rm -rf node_modules/.prisma node_modules/@prisma .next');
    
    // 2. Package.json'a ekstra bilgi ekle
    const packageJsonPath = path.join(__dirname, '../package.json');
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Script'e özel alanlar ekle (opsiyonel)
    packageJson.prisma = packageJson.prisma || {};
    packageJson.prisma.seed = 'node scripts/init-db.js';
    
    // 3. Prisma şemasını veritabanından güncelle
    console.log('Prisma şemasını güncelliyor...');
    await runCommand('npx prisma db pull');
    
    // 4. Manual düzeltme: Prisma şemasını kontrol et ve gerekirse düzelt
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // firma_logo alanı varsa ve doğru tanımlanmışsa kontrol et
    if (!schemaContent.includes('firma_logo')) {
      console.log('firma_logo alanı şemada bulunamadı, ekleniyor...');
      
      // firmalar modeline ekle
      const firmalarModelRegex = /model firmalar {([^}]*)}/s;
      const firmalarModel = schemaContent.match(firmalarModelRegex)[1];
      
      // firma_logo tanımını ekle
      const updatedFirmalarModel = firmalarModel.replace(
        'profil_foto       String?',
        'profil_foto       String?\n  firma_logo        String?'
      );
      
      // Güncelleme
      schemaContent = schemaContent.replace(firmalarModelRegex, `model firmalar {${updatedFirmalarModel}}`);
      fs.writeFileSync(schemaPath, schemaContent);
      
      console.log('firma_logo alanı Prisma şemasına eklendi.');
    } else {
      console.log('firma_logo alanı zaten şemada mevcut.');
    }
    
    // 5. Prisma istemcisini yeniden oluştur
    console.log('Prisma istemcisini oluşturuyor...');
    await runCommand('npx prisma generate');
    
    // 6. Veritabanı senkronizasyonu
    console.log('Veritabanını senkronize ediyor...');
    await runCommand('npx prisma db push');
    
    console.log('Prisma yeniden oluşturma tamamlandı.');
    console.log('\nŞimdi uygulamayı yeniden başlatın: npm run dev');
    
  } catch (error) {
    console.error('Prisma yeniden oluşturma sırasında hata:', error);
  }
}

// Betiği çalıştır
regeneratePrisma(); 