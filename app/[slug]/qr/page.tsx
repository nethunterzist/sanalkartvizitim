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
    <div className="main-container" style={{ maxWidth: 450, margin: '0 auto', minHeight: '100vh', background: 'white', boxShadow: '0 0 15px rgba(0,0,0,0.1)', position: 'relative' }}>
      <div className="background" style={{ background: `url('/img/back.jpeg') no-repeat center center`, backgroundSize: 'cover', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card-content" style={{ textAlign: 'center', width: '90%', maxWidth: 400, margin: '0 auto', padding: '32px 0' }}>
          <div className="container">
            <div className="row justify-content-center mb-2">
              <div className="col-12 text-center">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 5, color: '#000' }}>{firma.firma_adi}</h1>
                {firma.yetkili_adi && (
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: 5, color: '#000' }}>{firma.yetkili_adi}</h2>
                )}
                {firma.yetkili_pozisyon && (
                  <p style={{ fontSize: '1rem', color: '#666' }}>{firma.yetkili_pozisyon}</p>
                )}
              </div>
            </div>
          </div>
          <div className="my-4 d-flex flex-column align-items-center">
            <img src={qrCodeDataUrl} alt="QR Kod" style={{ width: 220, height: 220, borderRadius: 8, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
          </div>
          <p className="text-muted mt-3" style={{ fontSize: '1.05rem' }}>
            Bu QR kodu tarayarak dijital kartvizite erişebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
} 