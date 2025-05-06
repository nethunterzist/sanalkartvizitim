import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const ilId = req.nextUrl.searchParams.get('il_id');
    
    if (!ilId) {
      return NextResponse.json(
        { message: 'İl ID parametresi gerekli' },
        { status: 400 }
      );
    }
    
    const ilceler = await prisma.ilceler.findMany({
      where: {
        il_id: parseInt(ilId)
      },
      orderBy: {
        ad: 'asc'
      }
    });
    
    return NextResponse.json({ ilceler });
  } catch (error) {
    console.error('İlçeler getirilirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'İlçeler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 