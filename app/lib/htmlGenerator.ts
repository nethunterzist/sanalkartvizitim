import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import { Firma } from './types';
import { getBankLogoUrl } from './bankLogos';

// Handlebars helpers
handlebars.registerHelper('ifEquals', function(this: any, arg1: any, arg2: any, options: any) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

/**
 * Firma bilgileri için vCard (VCF) dosyası oluşturur
 * @param firma Firma bilgileri
 * @returns Oluşturulan vCard dosyasının yolu
 */
function generateVCardFile(firma: Firma): string {
  try {
    console.log(`vCard dosyası oluşturuluyor. Firma: ${firma.firma_adi}`);
    
    // Firma dizinini kontrol et
    const firmaDir = path.join(process.cwd(), 'public', firma.slug);
    if (!fs.existsSync(firmaDir)) {
      fs.mkdirSync(firmaDir, { recursive: true });
    }
    
    // Dosya adını temizle (boşluk ve özel karakterleri kaldır)
    const safeFileName = firma.firma_adi
      .replace(/[^\w\sığüşöçİĞÜŞÖÇ]/g, '')  // Türkçe karakterlere izin ver
      .replace(/\s+/g, '-')
      .toLowerCase();
    
    // İletişim bilgilerini al
    let telefon = '';
    let eposta = '';
    
    // İletişim verilerini communication_data'dan al (varsa)
    if (firma.communication_data) {
      try {
        const commData = JSON.parse(firma.communication_data);
        
        // İlk telefon ve e-postayı al
        if (commData.telefonlar && commData.telefonlar.length > 0) {
          // Nesne kontrolü - değer veya value özelliğini kullan
          if (typeof commData.telefonlar[0] === 'object' && commData.telefonlar[0] !== null) {
            telefon = commData.telefonlar[0].value || commData.telefonlar[0].tel || '';
          } else {
            telefon = commData.telefonlar[0];
          }
        }
        
        if (commData.epostalar && commData.epostalar.length > 0) {
          // Nesne kontrolü - değer veya value özelliğini kullan  
          if (typeof commData.epostalar[0] === 'object' && commData.epostalar[0] !== null) {
            eposta = commData.epostalar[0].value || commData.epostalar[0].mail || '';
          } else {
            eposta = commData.epostalar[0];
          }
        }
      } catch (error) {
        console.error('vCard için iletişim verileri parse edilirken hata:', error);
      }
    } else {
      // Doğrudan telefon ve e-posta değerlerini al (varsa)
      if (firma.telefon) {
        if (typeof firma.telefon === 'object' && firma.telefon !== null) {
          if (Array.isArray(firma.telefon) && (firma.telefon as any[]).length > 0) {
            const tel = (firma.telefon as any[])[0];
            const telValue =
              typeof tel === 'object' && tel !== null
                ? (tel as any).value || (tel as any).tel || (tel as any).telefon || ''
                : String(tel || '');
            telefon = telValue;
          } else {
            const telValue =
              (firma.telefon as any).value || 
              (firma.telefon as any).tel || 
              (firma.telefon as any).telefon || 
              '';
            telefon = telValue;
          }
        } else {
          telefon = String(firma.telefon || '');
        }
      }
      
      if (firma.eposta) {
        if (typeof firma.eposta === 'object' && firma.eposta !== null) {
          if (Array.isArray(firma.eposta) && (firma.eposta as any[]).length > 0) {
            const mail = (firma.eposta as any[])[0];
            const mailValue =
              typeof mail === 'object' && mail !== null
                ? (mail as any).value || (mail as any).mail || (mail as any).eposta || ''
                : String(mail || '');
            eposta = mailValue;
          } else {
            const mailValue =
              (firma.eposta as any).value || 
              (firma.eposta as any).mail || 
              (firma.eposta as any).eposta || 
              '';
            eposta = mailValue;
          }
        } else {
          eposta = String(firma.eposta || '');
        }
      }
    }
    
    // website string veya dizi olabilir
    let websiteStr = '';
    if (firma.website) {
      if (Array.isArray(firma.website)) {
        const website = (firma.website as any[])[0];
        if (typeof website === 'object' && website !== null) {
          websiteStr = (website as any).url || (website as any).value || (website as any).website || '';
        } else {
          websiteStr = String(website || '');
        }
        websiteStr = websiteStr.replace(/[\[\]"{}]/g, '');
      } else if (typeof firma.website === 'object' && firma.website !== null) {
        websiteStr = (firma.website as any).url || (firma.website as any).value || (firma.website as any).website || '';
        websiteStr = websiteStr.replace(/[\[\]"{}]/g, '');
      } else {
        websiteStr = String(firma.website || '').replace(/[\[\]"{}]/g, '');
      }
    }
    
    // İsim bilgisi güvenlik kontrolü
    const firmaIsim = firma.yetkili_adi 
      ? (typeof firma.yetkili_adi === 'string' ? firma.yetkili_adi : 'İsimsiz Kişi') 
      : (typeof firma.firma_adi === 'string' ? firma.firma_adi : 'İsimsiz Firma');
    
    // vCard içeriği oluştur
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${firmaIsim}
${telefon ? `TEL;TYPE=WORK,VOICE:${telefon}` : ''}
${eposta ? `EMAIL;TYPE=WORK:${eposta}` : ''}
${websiteStr ? `URL:${websiteStr}` : ''}
END:VCARD`;
    
    // Dosya yolu
    const vCardPath = path.join(firmaDir, `${safeFileName}.vcf`);
    
    // Dosyayı yaz - sonundaki % karakterinin eklenmemesi için trim() kullanıyoruz
    fs.writeFileSync(vCardPath, vCardContent.trim());
    
    console.log(`vCard dosyası başarıyla oluşturuldu: ${vCardPath}`);
    
    // Firma dizinine göre relatif yol döndür
    return `/${firma.slug}/${safeFileName}.vcf`;
  } catch (error) {
    console.error('vCard dosyası oluşturulurken hata oluştu:', error);
    return '#'; // Hata durumunda boş link döndür
  }
}

// Banca hesabını temsil eden arayüz
interface BankAccount {
  bank_id: string;
  bank_label: string;
  bank_logo: string | null;
  account_holder: string;
  iban: string;
}

interface FirmaHTMLProps {
  id: number;
  firma_adi: string;
  slug: string;
  telefon?: Array<{value: string; label?: string}> | null;
  eposta?: Array<{value: string; label?: string}> | null;
  whatsapp?: Array<{value: string; label?: string}> | null;
  telegram?: Array<{value: string; label?: string}> | null;
  instagram?: Array<{url: string; label?: string}> | null;
  youtube?: Array<{url: string; label?: string}> | null;
  linkedin?: Array<{url: string; label?: string}> | null;
  twitter?: Array<{url: string; label?: string}> | null;
  facebook?: Array<{url: string; label?: string}> | null;
  tiktok?: Array<{url: string; label?: string}> | null;
  website?: Array<{url: string; label?: string}> | null;
  harita?: Array<{url: string; label?: string}> | null;
  profil_foto?: string | null;
  vcard_dosya?: string | null;
  vcard_path?: string | null;
  yetkili_adi?: string | null;
  yetkili_pozisyon?: string | null;
  firma_hakkinda?: string | null;
  firma_hakkinda_baslik?: string | null;
  katalog?: string | null;
  firma_unvan?: string | null;
  firma_vergi_no?: string | null;
  vergi_dairesi?: string | null;
  bank_accounts?: BankAccount[] | null;
  communication_data?: string | null;
  social_media_data?: string | null;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}

/**
 * Firma bilgilerine göre HTML sayfası oluşturur
 * @param firma Firma bilgileri
 * @returns HTML dosyasının yolu
 */
export async function generateHtml(firma: FirmaHTMLProps): Promise<string> {
  try {
    console.log(`HTML oluşturma başladı. Firma: ${firma.firma_adi}, Slug: ${firma.slug}`);
    
    // Şablonu oku
    const templatePath = path.join(process.cwd(), 'templates', 'index-template.html');
    console.log('Şablon dosyası yolu:', templatePath);
    
    let templateContent = '';
    
    try {
    if (!fs.existsSync(templatePath)) {
      console.error(`HATA: Şablon dosyası bulunamadı: ${templatePath}`);
      throw new Error(`Şablon dosyası bulunamadı: ${templatePath}`);
    }
    
      templateContent = fs.readFileSync(templatePath, 'utf-8');
      console.log('Şablon dosyası başarıyla okundu, şablon boyutu:', templateContent.length);
      
      if (templateContent.length < 100) {
        console.error('HATA: Şablon içeriği çok kısa veya geçersiz olabilir');
      }
    } catch (error) {
      console.error('Şablon dosyası okuma hatası:', error);
      
      // Varsayılan şablon içeriği
      templateContent = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{firma_adi}} - Dijital Kartvizit</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .card {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
            margin-bottom: 20px;
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
        }
        .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #e0e0e0;
            margin-right: 20px;
            overflow: hidden;
        }
        .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            flex: 1;
        }
        h1 {
            margin: 0 0 5px 0;
            color: #0066cc;
        }
        .contact-info {
            margin-top: 30px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        .contact-icon {
            width: 24px;
            height: 24px;
            margin-right: 15px;
            color: #0066cc;
        }
        .social-links {
            display: flex;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #f0f0f0;
            margin-right: 10px;
            margin-bottom: 10px;
            color: #333;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        .social-link:hover {
            background-color: #0066cc;
            color: white;
        }
        .map {
            margin-top: 20px;
            border-radius: 10px;
            overflow: hidden;
            height: 300px;
        }
        .map iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .download-vcard {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #0066cc;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .download-vcard:hover {
            background-color: #0055b3;
        }
        @media (max-width: 600px) {
            .header {
                flex-direction: column;
                text-align: center;
            }
            .avatar {
                margin-right: 0;
                margin-bottom: 20px;
            }
        }
        .social-icon {
          display: flex;
          align-items: center;
          margin: 0 5px;
          position: relative;
        }

        .social-icon a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }

        .social-icon i {
          font-size: 18px;
          margin-right: 5px;
        }

        .social-label {
          font-size: 12px;
          margin-left: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <div class="avatar">
                    {{#if profil_foto}}
                    <img src="{{profil_foto}}" alt="{{firma_adi}}">
                    {{else}}
                    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:36px;color:#999;">
                        {{firma_adi.[0]}}
                    </div>
                    {{/if}}
                </div>
                <div class="info">
                    <h1>{{firma_adi}}</h1>
                    {{#if yetkili_adi}}
                    <p>{{yetkili_adi}}{{#if yetkili_pozisyon}}, {{yetkili_pozisyon}}{{/if}}</p>
                    {{/if}}
                    {{#if vcard_path}}
                    <a href="{{vcard_path}}" class="download-vcard" download="{{firma_adi}}.vcf">Rehbere Ekle</a>
                    {{/if}}
                </div>
            </div>
            
            <div class="contact-info">
                {{#each telefonlar}}
                <div class="contact-item">
                    <div class="contact-icon">📞</div>
                    <div>
                        <strong>{{#if this.label}}{{this.label}}{{else}}Telefon{{/if}}</strong>
                        <a href="tel:{{this.value}}">{{this.value}}</a>
                    </div>
                </div>
                {{/each}}
                
                {{#each epostalar}}
                <div class="contact-item">
                    <div class="contact-icon">✉️</div>
                    <div>
                        <strong>{{#if this.label}}{{this.label}}{{else}}E-posta{{/if}}</strong>
                        <a href="mailto:{{this.value}}">{{this.value}}</a>
                    </div>
                </div>
                {{/each}}
                
                {{#each whatsapplar}}
                <div class="contact-item">
                    <div class="contact-icon">📱</div>
                    <div>
                        <strong>{{#if this.label}}{{this.label}}{{else}}WhatsApp{{/if}}</strong>
                        <a href="https://wa.me/{{this.value}}" target="_blank">{{this.value}}</a>
                    </div>
                </div>
                {{/each}}
                
                {{#each telegramlar}}
                <div class="contact-item">
                    <div class="contact-icon">📨</div>
                    <div>
                        <strong>{{#if this.label}}{{this.label}}{{else}}Telegram{{/if}}</strong>
                        <a href="https://t.me/{{this.value}}" target="_blank">{{this.value}}</a>
                    </div>
                </div>
                {{/each}}
                
                {{#if website}}
                <div class="contact-item">
                    <div class="contact-icon">🌐</div>
                    <div>
                        <strong>Web Sitesi:</strong>
                        <a href="{{website}}" target="_blank">{{website}}</a>
                    </div>
                </div>
                {{/if}}
            </div>
            
            <div class="social-links">
                {{#if instagram}}
                <div class="social-icon">
                    <a href="{{instagram.url}}" target="_blank" title="Instagram">
                        <i>📸</i>
                        {{#if instagram.label}}
                        <span class="social-label">{{instagram.label}}</span>
                        {{/if}}
                    </a>
                </div>
                {{/if}}
                
                {{#if youtube}}
                <div class="social-icon">
                    <a href="{{youtube.url}}" target="_blank" title="YouTube">
                        <i>📺</i>
                        {{#if youtube.label}}
                        <span class="social-label">{{youtube.label}}</span>
                        {{/if}}
                    </a>
                </div>
                {{/if}}
                
                {{#if linkedin}}
                <div class="social-icon">
                    <a href="{{linkedin.url}}" target="_blank" title="LinkedIn">
                        <i>💼</i>
                        {{#if linkedin.label}}
                        <span class="social-label">{{linkedin.label}}</span>
                        {{/if}}
                    </a>
                </div>
                {{/if}}
                
                {{#if twitter}}
                <div class="social-icon">
                    <a href="{{twitter.url}}" target="_blank" title="Twitter">
                        <i>🐦</i>
                        {{#if twitter.label}}
                        <span class="social-label">{{twitter.label}}</span>
                        {{/if}}
                    </a>
                </div>
                {{/if}}
                
                {{#if facebook}}
                <div class="social-icon">
                    <a href="{{facebook.url}}" target="_blank" title="Facebook">
                        <i>👍</i>
                        {{#if facebook.label}}
                        <span class="social-label">{{facebook.label}}</span>
                        {{/if}}
                    </a>
                </div>
                {{/if}}
                
                {{#if harita}}
                <div class="social-icon">
                    <a href="{{harita.url}}" target="_blank" title="Harita">
                        <i>📍</i>
                        {{#if harita.label}}
                        <span class="social-label">{{harita.label}}</span>
                        {{/if}}
                    </a>
                </div>
                {{/if}}
            </div>
            
            {{#if harita}}
            <div class="map">
                <iframe src="{{harita}}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            {{/if}}
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
            <p>Powered by Sanal Kartvizit</p>
        </div>
    </div>
</body>
</html>`;
    }
    
    // Handlebars ile şablonu derle
    try {
      const template = handlebars.compile(templateContent);
      console.log('Şablon başarıyla derlendi');
      
      // Firma bilgilerini hazırla
      const templateData = {
        firma_adi: firma.firma_adi,
        slug: firma.slug,
        telefon: firma.telefon,
        eposta: firma.eposta,
        website: firma.website,
        whatsapp: firma.whatsapp,
        instagram: firma.instagram,
        youtube: firma.youtube,
        linkedin: firma.linkedin,
        twitter: firma.twitter,
        facebook: firma.facebook,
        harita: firma.harita,
        vcard_path: firma.vcard_path,
        profil_foto: firma.profil_foto,
        yetkili_adi: firma.yetkili_adi,
        yetkili_pozisyon: firma.yetkili_pozisyon,
        katalog: firma.katalog,
        firma_hakkinda: firma.firma_hakkinda,
        firma_hakkinda_baslik: firma.firma_hakkinda_baslik,
        firma_unvan: firma.firma_unvan,
        firma_vergi_no: firma.firma_vergi_no,
        vergi_dairesi: firma.vergi_dairesi,
        bank_accounts: firma.bank_accounts
      };
      
      console.log('Hazırlanan şablon verileri:', JSON.stringify(templateData, null, 2));
      
      // İkon önceliklerini al
      const iconPriorities = await getIconPriorities();
      
      // İkon önceliklerini şablona ekle
      const jsonIconPriorities = JSON.stringify(iconPriorities);
      
      // HTML içeriğini oluştur
      console.log(`HTML içeriği oluşturuluyor...`);
      console.log(`Yetkili bilgileri kontrolü: yetkili_adi=${templateData.yetkili_adi}, yetkili_pozisyon=${templateData.yetkili_pozisyon}`);
      const htmlContent = template({
        ...templateData,
        icon_priorities: jsonIconPriorities
      });
      console.log(`HTML içeriği başarıyla oluşturuldu, uzunluk: ${htmlContent.length}`);
      
      if (htmlContent.length < 100) {
        console.error(`UYARI: Oluşturulan HTML içeriği çok kısa (${htmlContent.length} karakter), şablon düzgün çalışmamış olabilir!`);
      }
      
      return htmlContent;
    } catch (error) {
      console.error('Şablon işleme hatası:', error);
      throw error;
    }
  } catch (error) {
    console.error('HTML oluşturulurken hata:', error);
    return '';
  }
}

// İkon önceliklerini almak için yardımcı fonksiyon
async function getIconPriorities() {
  // Varsayılan ikon sıralaması
  return {
    order: ['telefon', 'eposta', 'whatsapp', 'telegram', 'website', 'harita', 'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok']
  };
}

/**
 * Firma için HTML sayfası oluşturur ve eski dizini siler (eğer slug değiştiyse)
 * @param firma Firma bilgileri
 * @param oldSlug Eski slug (değiştiyse)
 * @returns HTML dosyasının yolu
 */
export async function generateHtmlForFirma(firma: any, oldSlug?: string): Promise<string> {
  try {
    console.log('HTML oluşturuluyor, firma:', firma);
    
    // VCard dosyası oluştur
    const vcardPath = generateVCardFile(firma);
    
    // İletişim verilerini parse et
    let telefonlar: Array<{value: string; label?: string}> = [];
    let epostalar: Array<{value: string; label?: string}> = [];
    let whatsapplar: Array<{value: string; label?: string}> = [];
    let telegramlar: Array<{value: string; label?: string}> = [];
    
    // İletişim verilerini communication_data'dan al (varsa)
    if (firma.communication_data) {
      try {
        const commData = JSON.parse(firma.communication_data);
        console.log('İletişim verileri parse edildi:', commData);
        
        // Her bir iletişim türü için verileri işle
        if (commData.telefonlar && Array.isArray(commData.telefonlar)) {
          telefonlar = commData.telefonlar;
        }
        
        if (commData.epostalar && Array.isArray(commData.epostalar)) {
          epostalar = commData.epostalar;
        }
        
        if (commData.whatsapplar && Array.isArray(commData.whatsapplar)) {
          whatsapplar = commData.whatsapplar;
        }
        
        if (commData.telegramlar && Array.isArray(commData.telegramlar)) {
          telegramlar = commData.telegramlar;
        }
        
        console.log('İşlenmiş iletişim verileri:', {
          telefonlar,
          epostalar,
          whatsapplar,
          telegramlar
        });
      } catch (error) {
        console.error('İletişim verileri parse edilirken hata:', error);
      }
    }
    
    // Sosyal medya verilerini parse et
    let instagramlar = firma.instagram;
    let youtubelar = firma.youtube;
    let linkedinler = firma.linkedin;
    let twitterlar = firma.twitter;
    let facebooklar = firma.facebook;
    let tiktoklar = firma.tiktok;
    let websiteler = firma.website;
    let haritalar = firma.harita;
    
    // Sosyal medya verilerini social_media_data'dan al (varsa)
    if (firma.social_media_data) {
      try {
        const socialData = JSON.parse(firma.social_media_data);
        
        // Eğer varsa, diğer değerlerin üzerine yaz
        if (socialData.instagramlar && socialData.instagramlar.length > 0) {
          instagramlar = (socialData.instagramlar as any[]).map((item: any) => ({
            url: item.url || item,
            label: item.label || undefined
          }));
        }
        
        if (socialData.youtubelar && socialData.youtubelar.length > 0) {
          youtubelar = (socialData.youtubelar as any[]).map((item: any) => ({
            url: item.url || item,
            label: item.label || undefined
          }));
        }
        
        if (socialData.linkedinler && socialData.linkedinler.length > 0) {
          linkedinler = (socialData.linkedinler as any[]).map((item: any) => ({
            url: item.url || item,
            label: item.label || undefined
          }));
        }
        
        if (socialData.twitterlar && socialData.twitterlar.length > 0) {
          twitterlar = (socialData.twitterlar as any[]).map((item: any) => ({
            url: item.url || item,
            label: item.label || undefined
          }));
        }
        
        if (socialData.facebooklar && socialData.facebooklar.length > 0) {
          facebooklar = (socialData.facebooklar as any[]).map((item: any) => ({
            url: item.url || item,
            label: item.label || undefined
          }));
        }
        
        if (socialData.tiktoklar && socialData.tiktoklar.length > 0) {
          tiktoklar = (socialData.tiktoklar as any[]).map((item: any) => ({
            url: item.url || item,
            label: item.label || undefined
          }));
        }
        
        if (socialData.websiteler && socialData.websiteler.length > 0) {
          websiteler = (socialData.websiteler as any[]).map((item: any) => ({
            url: item.url || item,
            label: item.label || undefined
          }));
        }
        
        if (socialData.haritalar && socialData.haritalar.length > 0) {
          haritalar = (socialData.haritalar as any[]).map((item: any) => ({
            url: item.url || item,
            label: item.label || undefined
          }));
        }
        
        console.log('Sosyal medya verileri işlendi:', {
          instagramlar,
          youtubelar,
          linkedinler,
          twitterlar,
          facebooklar,
          tiktoklar,
          websiteler,
          haritalar
        });
      } catch (error) {
        console.error('Sosyal medya verileri parse edilirken hata:', error);
      }
    }
    
    // Banka hesaplarını parse et
    const bankAccounts = firma.bank_accounts ? JSON.parse(firma.bank_accounts) : null;
    
    // Şablon veri nesnesi oluştur
    const templateData: FirmaHTMLProps = {
      id: firma.id,
      firma_adi: firma.firma_adi,
      slug: firma.slug,
      telefon: telefonlar,
      eposta: epostalar,
      whatsapp: whatsapplar,
      telegram: telegramlar,
      instagram: instagramlar,
      youtube: youtubelar,
      linkedin: linkedinler,
      twitter: twitterlar,
      facebook: facebooklar,
      tiktok: tiktoklar,
      website: websiteler,
      harita: haritalar,
      profil_foto: firma.profil_foto,
      vcard_dosya: vcardPath || firma.vcard_dosya,
      vcard_path: firma.vcard_path || vcardPath,
      yetkili_adi: firma.yetkili_adi,
      yetkili_pozisyon: firma.yetkili_pozisyon,
      firma_hakkinda: firma.firma_hakkinda,
      firma_hakkinda_baslik: firma.firma_hakkinda_baslik,
      katalog: firma.katalog,
      firma_unvan: firma.firma_unvan,
      firma_vergi_no: firma.firma_vergi_no,
      vergi_dairesi: firma.vergi_dairesi,
      bank_accounts: bankAccounts,
      communication_data: firma.communication_data,
      social_media_data: firma.social_media_data,
      created_at: firma.created_at,
      updated_at: firma.updated_at
    };
    
    // generateHtml fonksiyonunu çağırarak HTML içeriğini oluştur
    const htmlContent = await generateHtml(templateData);
    console.log('HTML oluşturuldu, içerik:', htmlContent);
    
    return htmlContent;
  } catch (error) {
    console.error('HTML oluşturulurken hata:', error);
    return '';
  }
}