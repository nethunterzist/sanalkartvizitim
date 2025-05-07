# Sanal Kartvizit - Next.js, Vercel ve Supabase

## Önemli Mimari Değişiklikler (Mayıs 2024)

### Sunucusuz (Serverless) Uyumlu Yeni Mimari
- **QR kod, HTML ve vCard (VCF) dosyaları artık dosya sistemine yazılmıyor.**
- Tüm bu içerikler API route'larında anlık olarak response ile üretiliyor.
- Vercel gibi sunucusuz ortamlarda dosya sistemine yazmak mümkün olmadığı için, eski `fs.writeFileSync`, `fs.mkdirSync` gibi işlemler tamamen kaldırıldı.
- QR kodlar `toDataURL` ile base64 olarak response ile dönüyor.
- vCard (VCF) dosyası endpointi, içeriği string olarak oluşturup response ile döndürüyor.
- HTML şablonları da response ile anlık üretiliyor.

### Geliştiriciler İçin Notlar
- **Dosya sistemine yazma gerektiren hiçbir kod bırakılmamalı.**
- Tüm dinamik içerikler (QR, vCard, HTML) sadece response ile üretilmeli.
- Local geliştirme için dosya yazma işlemleri sadece scriptlerde kullanılabilir, production'da asla kullanılmaz.
- Proje artık Vercel ve benzeri serverless ortamlarda uzun ömürlü ve sorunsuz çalışır.

### Değişiklik Özeti
- `lib/qrCodeGenerator.ts`: Sadece `toDataURL` ile QR kod response üretimi.
- `lib/vcardGenerator.ts`: vCard içeriği sadece string olarak oluşturuluyor, dosya sistemine yazılmıyor.
- `app/api/sayfalar/[slug]/vcard/route.ts`: vCard response ile anlık üretiliyor.
- `app/api/firmalar/route.ts` ve `[id]/route.ts`: vCard dosya yolu ve yazma işlemleri tamamen kaldırıldı.

---

## Kurulum ve Kullanım
(Standart kurulum ve kullanım adımlarını buraya ekleyin...)

## Özellikler

- Firma bilgilerini yönetme (ekleme, düzenleme, silme)
- Çoklu iletişim verileri desteği (telefon, e-posta, WhatsApp, Telegram)
- Sosyal medya hesaplarını ekleme
- vCard dosyaları ile rehbere kaydetme
- QR kod oluşturma
- Bank hesapları ve vergi bilgileri ekleme
- Dijital kartvizitleri görüntüleme ve paylaşma
- Responsive tasarım

## Teknolojiler

- Next.js 14
- TypeScript
- Prisma ORM
- SQLite
- Handlebars (şablon motoru)
- Bootstrap
- Font Awesome

## Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/username/sanal-kartvizit.git

# Proje dizinine gidin
cd sanal-kartvizit

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Son Geliştirmeler

### Telegram Veri İşleme Düzeltmeleri (20.04.2025)

Telegram kullanıcı adlarının işlenmesi ve görüntülenmesiyle ilgili sorunlar giderildi:

- Telegram kullanıcı adlarında null/undefined değerlere karşı kontroller eklendi
- `@` işareti ile başlayan kullanıcı adlarının doğru şekilde işlenmesi sağlandı
- Boş değerlerin ve gereksiz boşlukların filtrelenmesi eklendi
- HTML çıktısında Telegram bağlantıları artık doğru URL formatında (`https://t.me/username`) oluşturuluyor

Bu değişiklikler sayesinde, uygulama artık çoklu Telegram kullanıcı adlarını güvenli bir şekilde işleyebiliyor ve herhangi bir veri formatı hatası olmadan doğru bağlantıları oluşturabiliyor.

Detaylı bilgi için GELISTIRME_GUNLUGU.md dosyasını inceleyebilirsiniz.

## Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT Lisansı altında dağıtılmaktadır. Detaylı bilgi için `LICENSE` dosyasını inceleyiniz.

## Veritabanı

Proje Supabase PostgreSQL veritabanı kullanmaktadır. Veritabanı entegrasyonu tamamlanmıştır.
