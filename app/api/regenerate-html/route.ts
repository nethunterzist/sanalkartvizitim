import { NextResponse } from 'next/server';
import { getAllFirmalar } from '@/app/lib/db';
import { generateHtmlForFirma } from '@/app/lib/htmlGenerator';

export async function POST() {
  try {
    console.log('Tüm firma HTML sayfalarını yeniden oluşturma isteği alındı');
    
    // Tüm firmaları veritabanından al
    const firmalar = await getAllFirmalar();
    
    if (!firmalar || firmalar.length === 0) {
      console.log('Veritabanında firma bulunamadı.');
      return NextResponse.json(
        { success: false, message: 'Veritabanında firma bulunamadı' },
        { status: 404 }
      );
    }
    
    console.log(`Toplam ${firmalar.length} firma için HTML sayfaları yeniden oluşturulacak.`);
    
    // Her firma için HTML sayfasını yeniden oluştur
    const results = [];
    
    for (const firma of firmalar) {
      try {
        console.log(`${firma.firma_adi} (${firma.slug}) firması için HTML yeniden oluşturuluyor...`);
        const htmlPath = await generateHtmlForFirma(firma);
        
        results.push({
          id: firma.id,
          firma_adi: firma.firma_adi,
          slug: firma.slug,
          success: true,
          path: htmlPath
        });
        
        console.log(`${firma.firma_adi} firması için HTML başarıyla oluşturuldu: ${htmlPath}`);
      } catch (error) {
        console.error(`${firma.firma_adi} firması için HTML oluştururken hata:`, error);
        
        results.push({
          id: firma.id,
          firma_adi: firma.firma_adi,
          slug: firma.slug,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // Başarılı ve başarısız sonuçları sayma
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`HTML yeniden oluşturma işlemi tamamlandı. Başarılı: ${successful}, Başarısız: ${failed}`);
    
    return NextResponse.json({
      success: true,
      message: `${firmalar.length} firmadan ${successful} tanesi için HTML sayfaları başarıyla yeniden oluşturuldu. ${failed} firma başarısız oldu.`,
      results
    });
  } catch (error) {
    console.error('Tüm HTML sayfalarını yeniden oluşturma işlemi sırasında hata:', error);
    return NextResponse.json(
      { success: false, message: 'HTML sayfalarını yeniden oluşturma sırasında bir hata oluştu', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 