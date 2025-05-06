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
    if (!fs.existsSync(htmlFilePath)) {
      console.error(`[${slug}] HTML dosyası bulunamadı: ${htmlFilePath}`);
      notFound();
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
  } catch (error) {
    console.error(`[${slug}] Sayfa yükleme hatası:`, error);
    throw error; // Bu Next.js'in kendi hata sayfasını göstermesine neden olacak
  }
}