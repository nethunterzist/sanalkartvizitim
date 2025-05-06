import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const iller = await prisma.iller.findMany({
      orderBy: {
        ad: 'asc'
      }
    });
    return NextResponse.json({ iller });
  } catch (error) {
    console.error('İller getirilirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'İller getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 