import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Dinamik metadatayı oluşturan fonksiyon
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  // Metadata için de API'den fetch ile firma adını çek
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/sayfalar/${slug}`;
    const response = await fetch(apiUrl, { cache: 'no-store', headers: { 'Accept': 'text/html' } });
    if (!response.ok) {
      return { title: 'Firma Bulunamadı' };
    }
    const html = await response.text();
    // Basit bir başlık çıkarımı (daha iyi bir yöntem için API'den JSON dönebilir)
    const match = html.match(/<title>(.*?)<\/title>/);
    return { title: match ? match[1] : 'Sanal Kartvizit' };
  } catch {
    return { title: 'Sanal Kartvizit' };
  }
}

export default async function FirmaSayfasi({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/sayfalar/${slug}`;
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: { 'Accept': 'text/html' }
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTML içeriği alınamadı: ${response.status} - ${errorText}`);
    }
    const htmlContent = await response.text();
    if (!htmlContent || htmlContent.length < 100) {
      throw new Error('HTML içeriği geçersiz');
    }
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  } catch (error) {
    return (
      <div className="container py-5 text-center">
        <h1>Bir sorun oluştu</h1>
        <p>Kartvizit yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
        <p className="text-muted small">Hata detayı: {error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}