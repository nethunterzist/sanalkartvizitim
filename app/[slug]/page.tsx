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
    console.log(`[${slug}] Kartvizit sayfası yükleniyor`);
    
    // Firmayı veritabanından kontrol et
    const firma = await prisma.firmalar.findFirst({
      where: { slug }
    });
    
    if (!firma) {
      console.log(`[${slug}] Firma veritabanında bulunamadı`);
      notFound();
    }
    
    // HTML içeriğini API'den al
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
    console.log(`[${slug}] API URL: ${baseUrl}/api/sayfalar/${slug}`);
    
    const response = await fetch(`${baseUrl}/api/sayfalar/${slug}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'text/html'
      }
    });
    
    if (!response.ok) {
      console.error(`[${slug}] HTML içeriği alınamadı: ${response.status}`);
      throw new Error(`HTML içeriği alınamadı: ${response.status}`);
    }
    
    const htmlContent = await response.text();
    
    if (!htmlContent || htmlContent.length < 100) {
      console.error(`[${slug}] HTML içeriği geçersiz veya çok kısa`);
      throw new Error('HTML içeriği geçersiz');
    }
    
    // Görüntülenme sayısını artır
    try {
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
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  } catch (error) {
    console.error(`[${slug}] Sayfa yükleme hatası:`, error);
    
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