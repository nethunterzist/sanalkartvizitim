import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { slug, html } = await req.json();
    if (!slug || !html) {
      return NextResponse.json(
        { message: 'Slug ve HTML içeriği gereklidir' },
        { status: 400 }
      );
    }
    // Dosya sistemi işlemleri kaldırıldı. Sadece response dönülüyor.
    return NextResponse.json({ 
      success: true, 
      message: 'HTML içeriği başarıyla alındı',
      slug,
      html_length: html.length
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'HTML içeriği işlenirken bir hata oluştu', error: String(error) },
      { status: 500 }
    );
  }
} 