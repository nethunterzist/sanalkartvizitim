# Geliştirme Günlüğü

## 7 Mayıs 2024 – Kartvizit Sayfası API Entegrasyonu Düzeltmesi

- Kartvizit sayfasında "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" hatası çözüldü.
- **Hata Sebebi:** API'den gelen yanıtı `response.json()` ile parse etmeye çalışırken, API'nin HTML döndürmesi ve bu HTML'in JSON olarak parse edilememesi.
- **Çözüm:** API çağrılarında Accept header'ı `application/json` olarak ayarlandı. Böylece API'den her zaman JSON formatında veri alınıyor ve doğru şekilde parse edilebiliyor.
- Kartvizit template'i modern ve responsive bir tasarımla güncellendi.
- Sosyal medya ve iletişim bilgileri için özel bölümler eklendi.
- Font Awesome ikonları ve Bootstrap entegrasyonu yapıldı.

---

## 7 Mayıs 2024 – Serverless Uyumlu Radikal Mimari Dönüşüm

- Proje, Vercel ve benzeri sunucusuz ortamlarda uzun ömürlü ve sorunsuz çalışacak şekilde baştan sona yeniden yapılandırıldı.
- **Tüm dosya sistemi işlemleri (fs, path, mkdir, writeFile, vs.) projeden tamamen kaldırıldı.**
- QR kod, HTML ve vCard (VCF) dosyaları artık dosya sistemine yazılmıyor, API route'larında anlık olarak response ile üretiliyor.
- Handlebars tabanlı HTML şablonları, dosya okuma olmadan koda gömülü string olarak derleniyor.
- vCard ve QR kodlar, kullanıcıya doğrudan response ile sunuluyor.
- Tüm statik görseller ve ikonlar public/img altında merkezi olarak yönetiliyor.
- Tüm API route'lar response ile anlık veri ve dosya üretir hale getirildi.
- Local geliştirme için dosya yazma işlemleri sadece scriptlerde kullanılabilir, production'da asla kullanılmaz.
- Tüm kod, modern bulut mimarisiyle tam uyumlu ve sürdürülebilir hale getirildi.

---

## 20 Nisan 2025 – Telegram Veri İşleme Düzeltmeleri

- Telegram kullanıcı adlarının işlenmesi ve bağlantı formatı düzeltildi.
- Null/undefined ve boş değer kontrolleri eklendi.
- HTML çıktısında Telegram bağlantıları artık doğru URL formatında (`https://t.me/username`) oluşturuluyor.

---

## 2024-03-21: Sosyal Medya ve İletişim Verilerinin Mapping Sorunu Çözüldü

### Sorun
- Panelde özelleştirilmiş label/text girildiğinde sosyal medya ve iletişim ikonları kayboluyordu
- Hiçbir özelleştirilmiş alan girilmediğinde tüm ikonlar görünüyordu
- Bu durum, mapping sırasında label kontrolünün yanlış yapılmasından kaynaklanıyordu

### Çözüm
- Mapping kodunda label kontrolü optimize edildi
- Label alanı boş string, undefined veya null ise platform/tip adı veya meta.label kullanılıyor
- Bir objede label girilse bile diğerleri etkilenmiyor
- Tüm sosyal medya ve iletişim verileri eksiksiz ve doğru şekilde görüntüleniyor

### Teknik Detaylar
- `app/api/sayfalar/[slug]/route.ts` dosyasında mapping mantığı güncellendi
- Label kontrolü için `typeof item.label === 'string' && item.label.trim() !== ''` kontrolü eklendi
- Fallback olarak meta.label veya platform/tip adı kullanılıyor
- Her bir sosyal medya ve iletişim öğesi bağımsız olarak değerlendiriliyor

### Öğrenilen Dersler
- Veri mapping işlemlerinde her bir öğenin bağımsız değerlendirilmesi önemli
- Label/text özelleştirmelerinde fallback mekanizması mutlaka olmalı
- Boş string kontrolü yaparken trim() kullanılmalı
- Her bir öğe için ayrı meta bilgisi tutulmalı

---

## 21 Mart 2024 – QR Kod Sayfası Yeniden Eklendi

### Değişiklikler
- QR kod sayfası modern ve responsive tasarımla yeniden eklendi
- QR kod oluşturma işlemi serverless uyumlu hale getirildi
- Sayfa metadata desteği eklendi
- Firma logosu ve bilgileri QR sayfasında gösteriliyor
- Kartvizit sayfasındaki QR ikonu ile entegrasyon sağlandı

### Teknik Detaylar
- `app/[slug]/qr/page.tsx` dosyası oluşturuldu
- QR kod oluşturma işlemi `qrcode` paketi ile yapılıyor
- Sayfa, firma bilgilerini Prisma ile çekiyor
- QR kod, firma kartvizitinin URL'sini içeriyor
- Tasarım Bootstrap ve modern CSS ile yapıldı

### Öğrenilen Dersler
- Serverless ortamda QR kod oluşturma işlemi response ile yapılmalı
- Sayfa metadata'sı SEO için önemli
- Responsive tasarım tüm cihazlarda iyi görünmeli
- Kullanıcı deneyimi için açıklayıcı metinler eklenmeli

---

**Bu değişikliklerle birlikte proje, modern serverless mimarisiyle tam uyumlu, sürdürülebilir ve ölçeklenebilir bir yapıya kavuşmuştur.** 