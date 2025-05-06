# Sanal Kartvizit Uygulaması

Bu proje, firmalar için dijital kartvizit oluşturmaya olanak tanıyan bir web uygulamasıdır. Firma bilgilerini, iletişim verilerini ve sosyal medya hesaplarını içeren dijital kartvizitler oluşturulabilir ve paylaşılabilir.

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
