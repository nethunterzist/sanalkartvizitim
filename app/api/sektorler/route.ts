import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sektorler = await prisma.sektorler.findMany({
      orderBy: {
        ad: 'asc'
      }
    });
    return NextResponse.json({ sektorler });
  } catch (error) {
    console.error('Sektörler getirilirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'Sektörler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 