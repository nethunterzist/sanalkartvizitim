import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    
    // HTML dosya yolu
    const htmlPath = path.join(process.cwd(), 'public', slug, 'index.html');
    console.log(`[${slug}] HTML dosya yolu: ${htmlPath}`);
    
    // Dosya var mı kontrol et
    if (!fs.existsSync(htmlPath)) {
      console.log(`[${slug}] HTML dosyası bulunamadı`);
      return NextResponse.json(
        { error: 'Sayfa bulunamadı' },
        { status: 404 }
      );
    }
    
    // HTML içeriğini oku
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    console.log(`[${slug}] HTML dosyası başarıyla okundu, içerik uzunluğu: ${htmlContent.length} karakter`);
    
    // HTML içeriğini döndür
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Sayfa içeriği getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Sayfa içeriği getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
