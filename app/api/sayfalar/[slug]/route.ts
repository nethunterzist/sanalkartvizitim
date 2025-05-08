import { NextRequest, NextResponse } from 'next/server';
import Handlebars from 'handlebars';
import prisma from '@/app/lib/db';

// HTML şablonunu kod içinde string olarak tut
const pageTemplate = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{firma_adi}} - Dijital Kartvizit</title>
</head>
<body>
  <h1>{{firma_adi}}</h1>
  <p>{{yetkili_adi}} - {{yetkili_pozisyon}}</p>
  {{#if website}}
    <ul>
      {{#each website}}
        <li><a href="{{this}}" target="_blank">{{this}}</a></li>
      {{/each}}
    </ul>
  {{/if}}
  {{#if firma_logo}}
    <img src="{{firma_logo}}" alt="Logo" style="max-width:150px;" />
  {{/if}}
  <!-- Sosyal medya ve iletişim alanları örnek -->
  {{#if social_media}}
    <h3>Sosyal Medya</h3>
    <ul>
      {{#each social_media}}
        <li><a href="{{this.url}}" target="_blank">{{this.platform}}{{#if this.label}} ({{this.label}}){{/if}}</a></li>
      {{/each}}
    </ul>
  {{/if}}
  {{#if communication}}
    <h3>İletişim</h3>
    <ul>
      {{#each communication}}
        <li>{{this.tip}}: {{this.deger}}</li>
      {{/each}}
    </ul>
  {{/if}}
</body>
</html>
`;

// Sosyal medya platformları için ikon ve label eşlemesi
const SOCIAL_MEDIA_META: Record<string, { icon: string, label: string, urlPrefix: string }> = {
  instagram: { icon: '/img/instagram.png', label: 'Instagram', urlPrefix: 'https://instagram.com/' },
  youtube: { icon: '/img/youtube.png', label: 'YouTube', urlPrefix: 'https://youtube.com/' },
  facebook: { icon: '/img/facebook.png', label: 'Facebook', urlPrefix: 'https://facebook.com/' },
  twitter: { icon: '/img/twitter.png', label: 'Twitter', urlPrefix: 'https://twitter.com/' },
  tiktok: { icon: '/img/tiktok.png', label: 'TikTok', urlPrefix: 'https://tiktok.com/@' },
  linkedin: { icon: '/img/linkedin.png', label: 'LinkedIn', urlPrefix: 'https://linkedin.com/in/' },
  whatsapp: { icon: '/img/whatsapp.png', label: 'WhatsApp', urlPrefix: 'https://wa.me/' }
};

const COMM_META: Record<string, { icon: string, label: string, urlPrefix?: string }> = {
  telefon: { icon: '/img/tel.png', label: 'Telefon', urlPrefix: 'tel:' },
  gsm: { icon: '/img/tel.png', label: 'GSM', urlPrefix: 'tel:' },
  email: { icon: '/img/mail.png', label: 'E-posta', urlPrefix: 'mailto:' },
  mail: { icon: '/img/mail.png', label: 'E-posta', urlPrefix: 'mailto:' },
  eposta: { icon: '/img/mail.png', label: 'E-posta', urlPrefix: 'mailto:' },
  whatsapp: { icon: '/img/wp.png', label: 'WhatsApp', urlPrefix: 'https://wa.me/' },
  telegram: { icon: '/img/telegram.png', label: 'Telegram', urlPrefix: 'https://t.me/' },
  harita: { icon: '/img/adres.png', label: 'Harita' },
  website: { icon: '/img/web.png', label: 'Website', urlPrefix: 'https://' },
  adres: { icon: '/img/adres.png', label: 'Adres' }
};

// Ekstra ikon ve label eşlemesi
const EXTRA_META = {
  about: { icon: '/img/about.png', label: 'Hakkımızda' },
  tax: { icon: '/img/tax.png', label: 'Vergi Bilgileri' },
  katalog: { icon: '/img/pdf.png', label: 'Katalog' },
  iban: { icon: '/img/iban.png', label: 'IBAN Bilgileri' }
};

/**
 * Firma sayfasının HTML içeriğini getirir
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    console.log(`[${slug}] HTML/JSON içeriği getirme isteği alındı`);
    
    // Firma verisini çek
    const firma = await prisma.firmalar.findFirst({ where: { slug } });
    if (!firma) {
      return NextResponse.json({ error: 'Firma bulunamadı' }, { status: 404 });
    }

    // Website alanını dizi olarak hazırla
    let websiteArray: string[] = [];
    if (firma.website) {
      if (typeof firma.website === 'string' && firma.website.startsWith('[')) {
        try { websiteArray = JSON.parse(firma.website); } catch { websiteArray = [firma.website]; }
      } else { websiteArray = [firma.website]; }
    }
    // Sosyal medya ve iletişim alanlarını diziye çevir
    let socialMediaArray: any[] = [];
    if (firma.social_media_data) {
      try {
        const smObj = JSON.parse(firma.social_media_data);
        socialMediaArray = [];
        for (const key in smObj) {
          if (Array.isArray(smObj[key])) {
            smObj[key].forEach((item: any) => {
              const platform = key.replace('lar', '').replace('ler', '');
              const meta = SOCIAL_MEDIA_META[platform] || {};
              const value = item.url || item;
              socialMediaArray.push({
                icon: meta.icon || '',
                label: (typeof item.label === 'string' && item.label.trim() !== '') ? item.label : (meta.label || platform),
                url: value.startsWith('http') ? value : (meta.urlPrefix ? meta.urlPrefix + value : value)
              });
            });
          }
        }
      } catch { socialMediaArray = []; }
    }
    let communicationArray: any[] = [];
    if (firma.communication_data) {
      try {
        const commObj = JSON.parse(firma.communication_data);
        communicationArray = [];
        for (const key in commObj) {
          if (Array.isArray(commObj[key])) {
            commObj[key].forEach((item: any) => {
              const tip = key.replace('lar', '').replace('ler', '');
              const meta = COMM_META[tip] || {};
              const value = item.value || item;
              communicationArray.push({
                icon: meta.icon || '',
                label: (typeof item.label === 'string' && item.label.trim() !== '') ? item.label : (meta.label || tip),
                url: meta.urlPrefix ? meta.urlPrefix + value : '',
                value
              });
            });
          }
        }
      } catch { communicationArray = []; }
    }

    // Accept header'ına göre response tipi belirle
    const accept = request.headers.get('accept') || '';
    if (accept.includes('application/json') || accept.includes('*/')) {
      // JSON response
      return NextResponse.json({
        firma_adi: firma.firma_adi,
        yetkili_adi: firma.yetkili_adi,
        yetkili_pozisyon: firma.yetkili_pozisyon,
        slug: firma.slug,
        website: websiteArray,
        firma_logo: firma.firma_logo,
        social_media: socialMediaArray,
        communication: communicationArray,
        firma_hakkinda: firma.firma_hakkinda,
        firma_hakkinda_baslik: firma.firma_hakkinda_baslik,
        katalog: firma.katalog ? { icon: EXTRA_META.katalog.icon, label: EXTRA_META.katalog.label, url: firma.katalog } : undefined,
        iban: firma.bank_accounts ? { icon: EXTRA_META.iban.icon, label: EXTRA_META.iban.label, value: firma.bank_accounts } : undefined,
        tax: (firma.firma_unvan || firma.firma_vergi_no || firma.vergi_dairesi) ? {
          icon: EXTRA_META.tax.icon,
          label: EXTRA_META.tax.label,
          firma_unvan: firma.firma_unvan,
          firma_vergi_no: firma.firma_vergi_no,
          vergi_dairesi: firma.vergi_dairesi
        } : undefined,
        about: firma.firma_hakkinda ? { icon: EXTRA_META.about.icon, label: EXTRA_META.about.label, content: firma.firma_hakkinda } : undefined,
        profil_foto: firma.profil_foto
      });
    } else {
      // HTML response
      const compiledTemplate = Handlebars.compile(pageTemplate);
      const html = compiledTemplate({
        firma_adi: firma.firma_adi,
        yetkili_adi: firma.yetkili_adi,
        yetkili_pozisyon: firma.yetkili_pozisyon,
        slug: firma.slug,
        website: websiteArray,
        firma_logo: firma.firma_logo,
        social_media: socialMediaArray,
        communication: communicationArray
      });
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate'
        }
      });
    }
  } catch (error) {
    console.error('Sayfa içeriği oluşturulurken hata:', error);
    return NextResponse.json({ error: 'Sayfa içeriği oluşturulurken bir hata oluştu' }, { status: 500 });
  }
}
