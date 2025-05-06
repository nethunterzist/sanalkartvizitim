import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export default async function QRSayfasi({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  try {
    // Firma bilgilerini al
    const firma = await prisma.firmalar.findFirst({
      where: { slug }
    });
    
    if (!firma) {
      notFound();
    }
    
    // QR kod dosyasının yolu
    const qrCodePath = `/qrcodes/${slug}.png`;
    const fullQrCodePath = path.join(process.cwd(), 'public', 'qrcodes', `${slug}.png`);
    
    // QR kod dosyasının varlığını kontrol et
    let qrCodeExists = false;
    try {
      await fs.promises.access(fullQrCodePath);
      qrCodeExists = true;
    } catch (error) {
      console.error('QR kod dosyası bulunamadı:', error);
    }
    
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-4">{firma.firma_adi} QR Kodu</h1>
            
            <div className="flex flex-col items-center">
              {qrCodeExists ? (
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <Image 
                    src={qrCodePath}
                    alt={`${firma.firma_adi} QR Kodu`}
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="p-4 text-center text-red-600">
                  QR kod henüz oluşturulmadı. Lütfen daha sonra tekrar deneyin.
                </div>
              )}
              
              <p className="text-center mt-4">
                Bu QR kodu telefonunuzla tarayarak {firma.firma_adi} dijital kartvizitine ulaşabilirsiniz.
              </p>
              
              <div className="mt-6">
                <Link 
                  href={`/${slug}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Kartvizite Dön
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('QR sayfası oluşturma hatası:', error);
    return <div>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>;
  }
} 