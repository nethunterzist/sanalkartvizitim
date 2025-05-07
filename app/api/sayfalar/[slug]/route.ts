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
              socialMediaArray.push({
                platform: key.replace('lar', '').replace('ler', ''),
                url: item.url || item,
                label: item.label || undefined
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
              communicationArray.push({
                tip: key.replace('lar', '').replace('ler', ''),
                deger: item.value || item
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
        katalog: firma.katalog,
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
