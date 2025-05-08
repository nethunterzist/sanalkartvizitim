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
    <div className="main-container">
      <div className="background">
        <div className="card-content" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="profile-container mb-3">
            {firma.firma_logo ? (
              <img src={firma.firma_logo} className="profile-image" alt={firma.firma_adi} />
            ) : (
              <img src="/img/profile-default.png" className="profile-image" alt={firma.firma_adi} />
            )}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 8, color: '#222' }}>{firma.firma_adi}</h1>
          {firma.yetkili_adi && (
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: 4, color: '#222' }}>{firma.yetkili_adi}</h2>
          )}
          {firma.yetkili_pozisyon && (
            <p style={{ fontSize: '1.1rem', color: '#888', marginBottom: 18 }}>{firma.yetkili_pozisyon}</p>
          )}
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