import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs';
import prisma from '../../../lib/db';

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
    
    // QR kod API endpoint üzerinden sunuluyor
    const apiUrl = `/api/qr-codes/${slug}`;
    
    // Sayfa yüklendiğinde otomatik olarak QR kod API'sine yönlendir
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content={`0;url=${apiUrl}`} />
          <title>{firma.firma_adi} - QR Kod</title>
        </head>
        <body>
          <p>QR kod sayfasına yönlendiriliyorsunuz...</p>
        </body>
      </html>
    );
  } catch (error) {
    console.error('QR sayfası oluşturma hatası:', error);
    notFound();
  }
} 