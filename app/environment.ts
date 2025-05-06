// Uygulama ortam değişkenleri

export const environment = {
  // Geliştirme ortamında true, canlı ortamda false olmalı
  isDevelopment: process.env.NODE_ENV !== 'production',
  
  // Otomatik doldur özelliği sadece geliştirme ortamında gösterilecek
  showAutoFillButton: process.env.NODE_ENV !== 'production',
  
  // Diğer ortam bayrakları buraya eklenebilir
  // apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
}; 