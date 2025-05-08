import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import QRCode from 'qrcode';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/sayfalar/${slug}`;
    const response = await fetch(apiUrl, { 
      cache: 'no-store', 
      headers: { 'Accept': 'application/json' } 
    });
    if (!response.ok) {
      return {
        title: 'QR Kod Bulunamadı',
        description: 'İstenen QR kod sayfası bulunamadı.'
      };
    }
    const data = await response.json();
    return {
      title: `${data.firma_adi} - QR Kod`,
      description: `${data.firma_adi} firma kartvizitinin QR kodu.`
    };
  } catch {
    return {
      title: 'QR Kod Bulunamadı',
      description: 'İstenen QR kod sayfası bulunamadı.'
    };
  }
}

export default async function QRPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/sayfalar/${slug}`;
    const response = await fetch(apiUrl, { 
      cache: 'no-store', 
      headers: { 'Accept': 'application/json' } 
    });
    if (!response.ok) {
      return notFound();
    }
    const firma = await response.json();

    // QR kodunu oluştur
    const qrData = `${baseUrl}/${slug}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 300 });

    // Web sitesi (varsa) dizi olarak hazırla
    let website = '';
    if (firma.website) {
      if (typeof firma.website === 'string' && firma.website.startsWith('[')) {
        try {
          const arr = JSON.parse(firma.website);
          website = arr[0] || '';
        } catch {
          website = firma.website;
        }
      } else {
        website = firma.website;
      }
    }

    return (
      <div className="main-container" style={{ maxWidth: 450, margin: '0 auto', minHeight: '100vh', background: 'white', boxShadow: '0 0 15px rgba(0,0,0,0.1)', position: 'relative' }}>
        <div className="background" style={{ background: `url('/img/back.jpeg') no-repeat center center`, backgroundSize: 'cover', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-content" style={{ textAlign: 'center', width: '90%', maxWidth: 400, margin: '0 auto', padding: '32px 0' }}>
            <div className="container">
              <div className="row justify-content-center mb-2">
                <div className="col-12 text-center">
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 5, color: '#000' }}>{firma.firma_adi}</h1>
                  {firma.yetkili_adi && (
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: 18, color: '#000' }}>{firma.yetkili_adi}</h2>
                  )}
                </div>
              </div>
            </div>
            <div className="my-4 d-flex flex-column align-items-center">
              <img src={qrCodeDataUrl} alt="QR Kod" style={{ width: 220, height: 220, borderRadius: 8, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
            </div>
            {website && (
              <div className="mb-3">
                <a href={website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.08rem', color: '#007bff', textDecoration: 'underline', wordBreak: 'break-all' }}>{website.replace(/^https?:\/\//, '')}</a>
              </div>
            )}
            {firma.firma_logo && (
              <div className="d-flex justify-content-center mt-2">
                <img src={firma.firma_logo} alt="Firma Logo" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: '#fff', padding: 6 }} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
} 