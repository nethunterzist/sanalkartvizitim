import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '../../lib/db';

// Dinamik metadatayı oluşturan fonksiyon
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  
  try {
    // Firmayı veritabanından getir
    const firma = await prisma.firmalar.findFirst({
      where: { slug }
    });

    if (!firma) {
      return { title: "Firma Bulunamadı" };
    }

    // Firma adını title olarak ayarla
    return {
      title: `${firma.firma_adi} - Dijital Kartvizit`,
    };
  } catch (error) {
    console.error(`[${slug}] Metadata oluşturma hatası:`, error);
    return {
      title: "Sanal Kartvizit"
    };
  }
}

export default async function FirmaSayfasi({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  try {
    console.log(`[${slug}] Kartvizit sayfası yükleniyor - Başlangıç`);
    
    // Firmayı veritabanından kontrol et
    console.log(`[${slug}] Veritabanı sorgusu başlıyor...`);
    const firma = await prisma.firmalar.findFirst({
      where: { slug }
    });
    console.log(`[${slug}] Veritabanı sorgusu tamamlandı:`, firma ? 'Firma bulundu' : 'Firma bulunamadı');
    
    if (!firma) {
      console.log(`[${slug}] Firma veritabanında bulunamadı`);
      notFound();
    }
    
    // HTML içeriğini API'den al
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
    const apiUrl = `${baseUrl}/api/sayfalar/${slug}`;
    console.log(`[${slug}] API URL: ${apiUrl}`);
    console.log(`[${slug}] Environment değişkenleri:`, {
      VERCEL_URL: process.env.VERCEL_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV
    });
    
    console.log(`[${slug}] API isteği gönderiliyor...`);
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/html'
      }
    });
    console.log(`[${slug}] API yanıtı alındı:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${slug}] HTML içeriği alınamadı:`, {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`HTML içeriği alınamadı: ${response.status} - ${errorText}`);
    }
    
    const htmlContent = await response.text();
    console.log(`[${slug}] HTML içeriği alındı, uzunluk: ${htmlContent.length} karakter`);
    
    if (!htmlContent || htmlContent.length < 100) {
      console.error(`[${slug}] HTML içeriği geçersiz veya çok kısa:`, {
        contentLength: htmlContent.length,
        contentPreview: htmlContent.substring(0, 100)
      });
      throw new Error('HTML içeriği geçersiz');
    }
    
    // Görüntülenme sayısını artır
    try {
      console.log(`[${slug}] Görüntülenme sayısı güncelleniyor...`);
      await prisma.firmalar.update({
        where: { id: firma.id },
        data: {
          goruntulenme: {
            increment: 1
          }
        }
      });
      console.log(`[${slug}] Görüntülenme sayısı artırıldı`);
    } catch (e) {
      console.error(`[${slug}] Görüntülenme sayısı güncelleme hatası:`, e);
    }
    
    // HTML içeriği döndür
    console.log(`[${slug}] Sayfa render ediliyor...`);
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  } catch (error) {
    console.error(`[${slug}] Sayfa yükleme hatası:`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    
    // Hata sayfası gösterme
    return (
      <div className="container py-5 text-center">
        <h1>Bir sorun oluştu</h1>
        <p>Kartvizit yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        <p className="text-muted small">Hata detayı: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}