import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/app/lib/db';

/**
 * Firma sayfasının HTML içeriğini getirir
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    console.log(`[${slug}] HTML içeriği getirme isteği alındı`);
    console.log(`[${slug}] İstek detayları:`, {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    // Önce firmayı kontrol et
    console.log(`[${slug}] Veritabanı sorgusu başlıyor...`);
    const firma = await prisma.firmalar.findFirst({
      where: { slug }
    });
    console.log(`[${slug}] Veritabanı sorgusu tamamlandı:`, firma ? 'Firma bulundu' : 'Firma bulunamadı');
    
    if (!firma) {
      console.log(`[${slug}] Firma bulunamadı`);
      return NextResponse.json(
        { error: 'Firma bulunamadı' },
        { status: 404 }
      );
    }
    
    // HTML dosya yolu
    const htmlPath = path.join(process.cwd(), 'public', slug, 'index.html');
    console.log(`[${slug}] HTML dosya yolu: ${htmlPath}`);
    console.log(`[${slug}] Çalışma dizini: ${process.cwd()}`);
    
    // Dosya var mı kontrol et
    if (!fs.existsSync(htmlPath)) {
      console.log(`[${slug}] HTML dosyası bulunamadı`);
      return NextResponse.json(
        { error: 'Sayfa bulunamadı' },
        { status: 404 }
      );
    }
    
    // HTML içeriğini oku
    console.log(`[${slug}] HTML dosyası okunuyor...`);
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log(`[${slug}] HTML dosyası başarıyla okundu, içerik uzunluğu: ${htmlContent.length} karakter`);
    
    if (!htmlContent || htmlContent.length < 100) {
      console.error(`[${slug}] HTML içeriği geçersiz veya çok kısa:`, {
        contentLength: htmlContent.length,
        contentPreview: htmlContent.substring(0, 100)
      });
      return NextResponse.json(
        { error: 'HTML içeriği geçersiz' },
        { status: 500 }
      );
    }
    
    // HTML içeriğini döndür
    console.log(`[${slug}] HTML içeriği başarıyla döndürülüyor...`);
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error(`[${params.slug}] Sayfa içeriği getirilirken hata:`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    return NextResponse.json(
      { error: 'Sayfa içeriği getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
