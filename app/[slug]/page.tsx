import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

const prisma = new PrismaClient();

// Dinamik metadatayı oluşturan fonksiyon
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  
  try {
    // Firmayı veritabanından getir
    const firma = await prisma.firmalar.findFirst({
      where: {
        slug: slug
      }
    })

    if (!firma) {
      return {
        title: "Firma Bulunamadı"
      }
    }

    // Firma adını title olarak ayarla
    return {
      title: `${firma.firma_adi}`,
    }
  } catch (error) {
    console.error(`[${slug}] Metadata oluşturma hatası:`, error)
    return {
      title: "Sanal Kartvizit"
    }
  }
}

export default async function FirmaSayfasi({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  try {
    // Firma bilgilerini al
    const firma = await prisma.firmalar.findFirst({
      where: { slug }
    });
    
    if (!firma) {
      notFound();
    }
    
    // Website alanını dizi olarak hazırla
    let websiteArray: string[] = [];
    if (firma.website) {
      // Website bilgisi JSON formatında ise parse et
      if (typeof firma.website === 'string' && firma.website.startsWith('[')) {
        try {
          websiteArray = JSON.parse(firma.website);
        } catch (e) {
          console.error('Website JSON parse hatası:', e);
          websiteArray = [firma.website];
        }
      } else {
        websiteArray = [firma.website];
      }
    }
    
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {firma.firma_logo && (
            <div className="p-4 flex justify-center">
              <Image 
                src={firma.firma_logo} 
                alt={`${firma.firma_adi} Logo`} 
                width={200} 
                height={200} 
                className="object-contain"
              />
            </div>
          )}
          
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-4">{firma.firma_adi}</h1>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Yetkili Bilgileri</h2>
              <p><strong>Adı:</strong> {firma.yetkili_adi}</p>
              {firma.yetkili_pozisyon && (
                <p><strong>Pozisyon:</strong> {firma.yetkili_pozisyon}</p>
              )}
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">İletişim</h2>
              {firma.telefon && (
                <p>
                  <strong>Telefon:</strong>{' '}
                  <a href={`tel:${firma.telefon}`} className="text-blue-600 hover:underline">
                    {firma.telefon}
                  </a>
                </p>
              )}
              
              {websiteArray.length > 0 && (
                <div>
                  <strong>Website:</strong>
                  <ul>
                    {websiteArray.map((site, index) => (
                      <li key={index}>
                        <a 
                          href={site.startsWith('http') ? site : `https://${site}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {site}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Link 
                href={`/${slug}/qr`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                QR Kod Görüntüle
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Firma sayfası oluşturma hatası:', error);
    return <div>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>;
  }
}