import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

function generateVCard(firma: any): string {
  // Temel vCard alanları
  let vcard = `BEGIN:VCARD\nVERSION:3.0\n`;
  vcard += `FN:${firma.firma_adi || ''}\n`;
  vcard += `ORG:${firma.firma_adi || ''}\n`;
  if (firma.yetkili_adi) vcard += `N:${firma.yetkili_adi}\n`;
  if (firma.telefon) vcard += `TEL;TYPE=WORK,VOICE:${firma.telefon}\n`;
  if (firma.eposta) vcard += `EMAIL;TYPE=WORK:${firma.eposta}\n`;
  if (firma.website) vcard += `URL:${firma.website}\n`;
  if (firma.adres) vcard += `ADR;TYPE=WORK:${firma.adres}\n`;
  vcard += `END:VCARD`;
  return vcard;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const firma = await prisma.firmalar.findFirst({ where: { slug } });
    if (!firma) {
      return NextResponse.json({ error: 'Firma bulunamadı' }, { status: 404 });
    }
    const vcardContent = generateVCard(firma);
    return new NextResponse(vcardContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${firma.slug}.vcf"`
      }
    });
  } catch (error) {
    console.error('vCard oluşturulurken hata:', error);
    return NextResponse.json({ error: 'vCard oluşturulurken bir hata oluştu' }, { status: 500 });
  }
} 