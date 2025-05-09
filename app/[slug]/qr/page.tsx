import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import QRCode from 'qrcode';

// URL'deki encode edilmiş karakterleri decode eden yardımcı fonksiyon
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeSlug(params.slug);
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/sayfalar/${decodedSlug}`;
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
  const decodedSlug = decodeSlug(params.slug);
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/sayfalar/${decodedSlug}`;
    const response = await fetch(apiUrl, { 
      cache: 'no-store', 
      headers: { 'Accept': 'application/json' } 
    });
    if (!response.ok) {
      return notFound();
    }
    const firma = await response.json();

    // QR kodunu oluştur
    const qrData = `${baseUrl}/${decodedSlug}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 300 });

    // Web sitesi (varsa) dizi veya string olarak hazırla
    let website = '';
    if (firma.website) {
      if (Array.isArray(firma.website)) {
        if (firma.website.length > 0) {
          website = firma.website[0];
        }
      } else if (typeof firma.website === 'string' && firma.website.startsWith('[')) {
        try {
          const arr = JSON.parse(firma.website);
          if (Array.isArray(arr) && arr.length > 0) {
            website = arr[0];
          }
        } catch {
          website = firma.website;
        }
      } else if (typeof firma.website === 'string') {
        website = firma.website;
      }
    }
    // Eğer website hala boşsa, communication dizisinde label'ı Website olan ilk değeri al
    if (!website && Array.isArray(firma.communication)) {
      const commWeb = firma.communication.find((c: any) => c.label === 'Website' && c.value);
      if (commWeb) {
        website = commWeb.value;
      }
    }

    return (
      <div className="main-container" style={{ maxWidth: 450, margin: '0 auto', minHeight: '100vh', background: 'white', boxShadow: '0 0 15px rgba(0,0,0,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="background" style={{ background: `url('/img/back.jpeg') no-repeat center center`, backgroundSize: 'cover', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-content" style={{ textAlign: 'center', width: '90%', maxWidth: 400, margin: '0 auto', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
            <div className="my-4 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%' }}>
              <img src={qrCodeDataUrl} alt="QR Kod" style={{ width: 220, height: 220, borderRadius: 8, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', margin: '0 auto' }} />
            </div>
            {website && (
              <div className="mb-3" style={{ width: '100%' }}>
                <a href={website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.08rem', color: '#007bff', textDecoration: 'underline', wordBreak: 'break-all', display: 'block', textAlign: 'center' }}>{website.replace(/^https?:\/\//, '')}</a>
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