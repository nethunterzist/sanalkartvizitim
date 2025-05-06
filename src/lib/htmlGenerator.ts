import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { Firma } from './types';

/**
 * Firma bilgilerini kullanarak statik HTML dosyası oluşturur
 * @param firma Firma bilgileri
 * @param oldSlug (opsiyonel) Firmanın eski slug değeri (güncelleme durumunda)
 * @returns Oluşturulan HTML dosyasının yolu
 */
export function generateHtmlForFirma(firma: Firma, oldSlug?: string) {
  try {
    console.log(`HTML oluşturma başladı. Firma: ${firma.firma_adi}, Slug: ${firma.slug}`);
    
    // Eğer firma güncelleniyorsa ve slug değiştiyse, eski dizini sil
    if (oldSlug && oldSlug !== firma.slug) {
      const oldFirmaDir = path.join(process.cwd(), 'public', oldSlug);
      if (fs.existsSync(oldFirmaDir)) {
        fs.rmSync(oldFirmaDir, { recursive: true, force: true });
        console.log(`Eski firma dizini silindi: ${oldFirmaDir}`);
      }
    }

    // Şablon dosyasını oku
    const templatePath = path.join(process.cwd(), 'templates/index-template.html');
    console.log(`Şablon dosyası yolu: ${templatePath}`);
    
    if (!fs.existsSync(templatePath)) {
      console.error(`HATA: Şablon dosyası bulunamadı: ${templatePath}`);
      throw new Error(`Şablon dosyası bulunamadı: ${templatePath}`);
    }
    
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    console.log('Şablon dosyası başarıyla okundu');
    
    // Handlebars şablonu derleme
    const template = Handlebars.compile(templateContent);
    
    // Fotoğraf ve vCard dosya yollarını düzenleme
    const profilFoto = firma.profil_foto 
      ? `/uploads/${path.basename(firma.profil_foto)}` 
      : '/placeholder-profile.png'; // varsayılan görsel

    const vcardDosya = firma.vcard_dosya 
      ? `/uploads/${path.basename(firma.vcard_dosya)}` 
      : '#'; // dosya yoksa link çalışmasın
    
    console.log(`Profil fotoğrafı yolu: ${profilFoto}`);
    console.log(`vCard dosya yolu: ${vcardDosya}`);
    
    // Şablona verileri uygulama
    const htmlContent = template({
      firmaAdi: firma.firma_adi,
      telefon: firma.telefon,
      eposta: firma.eposta,
      whatsapp: firma.whatsapp,
      instagram: firma.instagram,
      youtube: firma.youtube,
      website: firma.website,
      harita: firma.harita,
      yetkiliAdi: firma.yetkili_adi || 'Furkan Yiğit', // Varsayılan değer
      yetkiliPozisyon: firma.yetkili_pozisyon || 'Genel Müdür', // Varsayılan değer
      profilFoto,
      vcardDosya,
      slug: firma.slug // Slug bilgisini de şablona gönder
    });
    
    // Firma için klasör oluşturma
    const firmaDir = path.join(process.cwd(), 'public', firma.slug);
    console.log(`Firma dizini oluşturuluyor: ${firmaDir}`);
    
    if (!fs.existsSync(firmaDir)) {
      fs.mkdirSync(firmaDir, { recursive: true });
      console.log(`Firma dizini oluşturuldu: ${firmaDir}`);
    } else {
      console.log(`Firma dizini zaten mevcut: ${firmaDir}`);
    }
    
    // HTML dosyasını yazma
    const outputPath = path.join(firmaDir, 'index.html');
    fs.writeFileSync(outputPath, htmlContent);
    
    console.log(`HTML dosyası başarıyla oluşturuldu: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('HTML dosyası oluşturulurken hata oluştu:', error);
    throw error;
  }
}

/**
 * Verilen slug'a sahip firmanın HTML dosyasını siler
 * @param slug Firma slug'ı
 * @returns İşlemin başarı durumu
 */
export function deleteHtmlForFirma(slug: string): boolean {
  try {
    console.log(`Firma HTML dosyaları siliniyor. Slug: ${slug}`);
    const firmaDir = path.join(process.cwd(), 'public', slug);
    
    if (fs.existsSync(firmaDir)) {
      fs.rmSync(firmaDir, { recursive: true, force: true });
      console.log(`Firma HTML dosyaları silindi: ${firmaDir}`);
      return true;
    }
    
    console.log(`Silinecek firma dizini bulunamadı: ${firmaDir}`);
    return false; // Dosya/dizin bulunamadı
  } catch (error) {
    console.error('HTML dosyası silinirken hata oluştu:', error);
    return false;
  }
} 