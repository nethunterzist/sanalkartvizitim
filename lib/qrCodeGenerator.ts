import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(slug: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sanalkartvizitim-4ekk.vercel.app';
  const url = `${baseUrl}/${slug}`;
  // QR kodunu base64 olarak üret
  return await QRCode.toDataURL(url, {
    color: {
      dark: '#000000',
      light: '#ffffff'
    },
    width: 256,
    margin: 1,
    errorCorrectionLevel: 'H'
  });
} 