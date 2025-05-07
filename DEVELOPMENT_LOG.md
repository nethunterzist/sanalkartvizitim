# Geliştirme Günlüğü

## 7 Mayıs 2024 - Serverless Uyumlu Radikal Mimari Değişiklikler

- Proje, Vercel ve benzeri sunucusuz ortamlarda uzun ömürlü ve sorunsuz çalışacak şekilde yeniden yapılandırıldı.
- **QR kod, HTML ve vCard (VCF) dosyaları artık dosya sistemine yazılmıyor.**
- Tüm bu içerikler API route'larında anlık olarak response ile üretiliyor.
- `fs.writeFileSync`, `fs.mkdirSync`, `fs.existsSync` gibi dosya işlemleri tamamen kaldırıldı.
- QR kodlar sadece `toDataURL` ile base64 olarak response ile dönüyor.
- vCard endpointi, içeriği string olarak oluşturup response ile döndürüyor.
- HTML şablonları da response ile anlık üretiliyor.
- Firma ekleme/güncelleme işlemlerinde vCard dosya yolu ve yazma işlemleri kaldırıldı.
- `lib/qrCodeGenerator.ts`, `lib/vcardGenerator.ts`, `app/api/sayfalar/[slug]/vcard/route.ts`, `app/api/firmalar/route.ts` ve `[id]/route.ts` dosyalarında köklü değişiklikler yapıldı.
- Artık hiçbir yerde dosya sistemine yazma gerektiren kod yok.
- Local geliştirme için dosya yazma işlemleri sadece scriptlerde kullanılabilir, production'da asla kullanılmaz.

**Bu değişikliklerle birlikte proje, modern bulut mimarisiyle tam uyumlu ve sürdürülebilir hale gelmiştir.** 