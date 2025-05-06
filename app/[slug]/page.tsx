import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
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
    
    try {
      // Firmayı veritabanından kontrol et
      const firma = await prisma.firmalar.findFirst({
        where: { slug }
      });
      
      if (!firma) {
        console.log(`[${slug}] Firma veritabanında bulunamadı`);
        notFound();
      }
      
      // HTML dosyasının yolunu belirle
      const htmlFilePath = path.join(process.cwd(), 'public', slug, 'index.html');
      console.log(`[${slug}] HTML dosya yolu: ${htmlFilePath}`);
      
      // HTML dosyasının varlığını kontrol et
      let htmlFileExists = false;
      try {
        htmlFileExists = fs.existsSync(htmlFilePath);
        console.log(`[${slug}] HTML dosyası kontrol edildi, varlık: ${htmlFileExists}`);
      } catch (fsError) {
        console.error(`[${slug}] HTML dosyası kontrol hatası:`, fsError);
        throw new Error(`HTML dosyası kontrol edilemedi: ${fsError instanceof Error ? fsError.message : String(fsError)}`);
      }
      
      if (!htmlFileExists) {
        console.error(`[${slug}] HTML dosyası bulunamadı: ${htmlFilePath}`);
        // Dosya yoksa şablon oluşturma denenebilir
        return (
          <div className="container py-5 text-center">
            <h1>Kartvizit içeriği bulunamadı</h1>
            <p>Bu firma için kartvizit şablonu oluşturulmamış.</p>
            <p>Firma adı: {firma.firma_adi}</p>
          </div>
        );
      }
      
      // HTML içeriğini oku
      let htmlContent;
      try {
        htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        console.log(`[${slug}] HTML içeriği başarıyla okundu. Boyut: ${htmlContent.length} bayt`);
        
        if (htmlContent.length < 100) {
          console.error(`[${slug}] UYARI: HTML içeriği çok kısa (${htmlContent.length} bayt)`);
        }
      } catch (htmlError) {
        console.error(`[${slug}] HTML dosyası okuma hatası:`, htmlError);
        throw new Error(`HTML içeriği okunamadı: ${htmlError instanceof Error ? htmlError.message : String(htmlError)}`);
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
        // Görüntülenme sayısı güncelleme hatası, sayfanın gösterilmesini engellemeyecek
      }
      
      // HTML içeriği döndür
      return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      );
    } catch (dbError) {
      console.error(`[${slug}] Veritabanı işlemi hatası:`, dbError);
      throw new Error(`Firma verileri alınamadı: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
    }
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