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

**Bu değişikliklerle birlikte proje, modern serverless mimarisiyle tam uyumlu, sürdürülebilir ve ölçeklenebilir bir yapıya kavuşmuştur.** 