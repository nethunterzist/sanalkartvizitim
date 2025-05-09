import { NextRequest, NextResponse } from 'next/server';
import Handlebars from 'handlebars';
import prisma from '../../../../lib/db';
import QRCode from 'qrcode';

// HTML şablonunu kod içinde string olarak tut
const qrTemplate = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{firma_adi}} - QR Kod</title>
</head>
<body>
  <h1>{{firma_adi}}</h1>
  <div style="margin-bottom: 12px;">
    <div style="font-size: 1.1em; font-weight: 500;">{{yetkili_adi}}</div>
    {{#if yetkili_pozisyon}}
      <div style="font-size: 0.95em; color: #666; margin-top: 2px;">{{yetkili_pozisyon}}</div>
    {{/if}}
  </div>
  <img src="{{qr_code_data_url}}" alt="QR Kod" />
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
</body>
</html>
`;

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Firma bilgilerini al
    const firma = await prisma.firmalar.findFirst({
      where: { slug }
    });
    
    if (!firma) {
      return NextResponse.json({ error: 'Firma bulunamadı' }, { status: 404 });
    }

    // QR kodunu anlık olarak oluştur (örneğin firma slug'ına özel bir URL encode edebilirsin)
    const qrData = `${request.nextUrl.origin}/${slug}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 300 });

    // Website alanını dizi olarak hazırla
    let websiteArray: string[] = [];
    if (firma.website) {
      if (typeof firma.website === 'string' && firma.website.startsWith('[')) {
        try {
          websiteArray = JSON.parse(firma.website);
        } catch (e) {
          websiteArray = [firma.website];
        }
      } else {
        websiteArray = [firma.website];
      }
    }

    // HTML'i oluştur
    const compiledTemplate = Handlebars.compile(qrTemplate);
    const html = compiledTemplate({
      firma_adi: firma.firma_adi,
      yetkili_adi: firma.yetkili_adi,
      yetkili_pozisyon: firma.yetkili_pozisyon,
      slug: firma.slug,
      website: websiteArray,
      firma_logo: firma.firma_logo,
      qr_code_data_url: qrCodeDataUrl
    });

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate'
      }
    });
  } catch (error) {
    console.error('QR sayfası oluşturma hatası:', error);
    return NextResponse.json({ error: 'QR sayfası oluşturma hatası' }, { status: 500 });
  }
} 