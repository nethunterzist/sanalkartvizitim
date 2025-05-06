import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

/**
 * Slug'a göre firma bilgilerini getir
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log(`Slug '${params.slug}' için firma bilgisi getirme isteği alındı`);
    
    // Firma bilgilerini sorgula
    const firma = await prisma.firmalar.findFirst({
      where: { slug: params.slug }
    });
    
    if (!firma) {
      return NextResponse.json(
        { message: 'Firma bulunamadı' },
        { status: 404 }
      );
    }
    
    // Firma bilgilerini döndür
    return NextResponse.json(firma);
  } catch (error) {
    console.error(`Firma bilgileri getirilirken hata: ${error}`);
    return NextResponse.json(
      { message: 'Firma bilgileri getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}