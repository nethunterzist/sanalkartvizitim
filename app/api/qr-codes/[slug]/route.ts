import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import Handlebars from 'handlebars';
import fs from 'fs';
import prisma from '../../../../lib/db';
import { generateQRCode } from '../../../../lib/qrCodeGenerator';

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
    
    // QR kod dosyasının varlığını kontrol et
    const qrCodePath = path.join(process.cwd(), 'public', 'qrcodes', `${slug}.png`);
    if (!fs.existsSync(qrCodePath)) {
      // QR kod yoksa oluştur
      await generateQRCode(slug);
    }
    
    // QR sayfa şablonunu oku
    const templatePath = path.join(process.cwd(), 'templates', 'qr-template.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    // Şablonu derle
    const compiledTemplate = Handlebars.compile(template);
    
    // Website alanını dizi olarak hazırla
    let websiteArray: string[] = [];
    if (firma.website) {
      // Website bilgisi JSON formatında ise parse et
      if (typeof firma.website === 'string' && firma.website.startsWith('[')) {
        try {
          websiteArray = JSON.parse(firma.website);
        } catch (e) {
          console.error('Website JSON parse hatası:', e);
          websiteArray = [firma.website];
        }
      } else {
        websiteArray = [firma.website];
      }
    }
    
    // HTML'i oluştur
    const html = compiledTemplate({
      firma_adi: firma.firma_adi,
      yetkili_adi: firma.yetkili_adi,
      yetkili_pozisyon: firma.yetkili_pozisyon,
      slug: firma.slug,
      website: websiteArray,
      firma_logo: firma.firma_logo
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