import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { message: 'Firma slug\'ı gereklidir' },
        { status: 400 }
      );
    }
    
    // Firma var mı kontrol et
    const firma = await prisma.firmalar.findFirst({
      where: { slug }
    });
    
    // Firma bulunamadı ise hata döndür
    if (!firma) {
      return NextResponse.json(
        { message: 'Firma bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(firma);
  } catch (error) {
    console.error('Firma getirilirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'Firma getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 