import { Metadata } from 'next';
import prisma from '@/app/lib/db';
import QRCode from 'qrcode';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const firma = await prisma.firmalar.findFirst({
    where: { slug: params.slug }
  });

  if (!firma) {
    return {
      title: 'QR Kod Bulunamadı',
      description: 'İstenen QR kod sayfası bulunamadı.'
    };
  }

  return {
    title: `${firma.firma_adi} - QR Kod`,
    description: `${firma.firma_adi} firma kartvizitinin QR kodu.`
  };
}

export default async function QRPage({ params }: { params: { slug: string } }) {
  const firma = await prisma.firmalar.findFirst({
    where: { slug: params.slug }
  });

  if (!firma) {
    return (
      <div className="container text-center py-5">
        <h1>QR Kod Bulunamadı</h1>
        <p>İstenen QR kod sayfası bulunamadı.</p>
      </div>
    );
  }

  // QR kodunu oluştur
  const qrData = `${process.env.VERCEL_URL || 'http://localhost:3000'}/${params.slug}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 300 });

  return (
    <div className="container text-center py-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h1 className="card-title h3 mb-4">{firma.firma_adi}</h1>
          {firma.firma_logo && (
            <img 
              src={firma.firma_logo} 
              alt={`${firma.firma_adi} Logo`} 
              className="img-fluid mb-4" 
              style={{ maxHeight: '100px' }}
            />
          )}
          <div className="mb-4">
            <img 
              src={qrCodeDataUrl} 
              alt="QR Kod" 
              className="img-fluid"
            />
          </div>
          <p className="text-muted mb-0">
            Bu QR kodu tarayarak dijital kartvizite erişebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
} 