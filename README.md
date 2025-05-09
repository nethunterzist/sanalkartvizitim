# Sanal Kartvizit – Next.js, Vercel & Supabase

## 🚀 Modern Serverless Mimari (Mayıs 2024)

### 🔥 Radikal Yenilikler & Mimari Dönüşüm
- **Tüm dosya sistemi işlemleri (fs, path, mkdir, writeFile, vs.) projeden tamamen kaldırıldı.**
- QR kod, vCard (VCF) ve HTML çıktıları artık dosya sistemine yazılmadan, API route'larında anlık olarak response ile üretiliyor.
- Handlebars tabanlı HTML şablonları, dosya okuma olmadan koda gömülü string olarak derleniyor.
- vCard ve QR kodlar, kullanıcıya doğrudan response ile sunuluyor.
- Proje artık Vercel ve benzeri serverless ortamlarda %100 uyumlu ve sürdürülebilir.

### ⚠️ Geliştiriciler İçin Kritik Notlar
- **Dosya sistemine yazma gerektiren hiçbir kod bırakılmamalı!**
- Tüm dinamik içerikler (QR, vCard, HTML) sadece response ile üretilmeli.
- Local geliştirme için dosya yazma işlemleri sadece scriptlerde kullanılabilir, production'da asla kullanılmaz.
- Tüm statik görseller ve template'ler, public/img ve koda gömülü template string olarak yönetilmeli.

### 📦 Temel Dosya ve Klasör Yapısı
- `app/lib/cardTemplate.ts`: Tüm HTML şablonu burada string olarak tutulur.
- `public/img/`: Tüm ikonlar, arka plan ve görseller burada.
- `app/[slug]/page.tsx`: Kartvizit sayfası, sadece API'dan veri çekip Handlebars ile HTML üretir.
- `app/api/sayfalar/[slug]/route.ts`: Tüm kartvizit verisini JSON olarak döner.
- `app/api/qr-codes/[slug]/route.ts`: QR kodu anlık olarak üretir ve HTML response döner.

---

## Kurulum ve Kullanım

```bash
git clone https://github.com/username/sanal-kartvizit.git
cd sanal-kartvizit
npm install
npm run dev
```

### Ortam Değişkenleri
- `DATABASE_URL`: Supabase/PostgreSQL bağlantı dizesi
- `VERCEL_URL`: Vercel deployment domain'i (örn. sanalkartvizitim-xxxx.vercel.app)

---

## Özellikler

- Firma yönetimi (ekle, düzenle, sil)
- Çoklu iletişim ve sosyal medya desteği
- vCard ile rehbere kaydetme
- QR kod oluşturma ve paylaşma
- Banka ve vergi bilgileri
- Modern, responsive ve görsel açıdan zengin kartvizit tasarımı
- Tüm işlemler serverless uyumlu

---

## Teknolojiler

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM & Supabase PostgreSQL
- Handlebars (şablon motoru)
- Bootstrap, Font Awesome

---

## Son Geliştirmeler

### 7 Mayıs 2024 – Serverless Uyumlu Radikal Mimari Dönüşüm
- Tüm dosya sistemi işlemleri kaldırıldı, kod tamamen serverless uyumlu hale getirildi.
- HTML template dosya okuma kaldırıldı, şablon koda gömüldü.
- Tüm API route'lar response ile anlık veri ve dosya üretir hale getirildi.
- Tüm görseller ve ikonlar public/img altında merkezi olarak yönetiliyor.

### 20 Nisan 2025 – Telegram Veri İşleme Düzeltmeleri
- Telegram kullanıcı adlarının işlenmesi ve bağlantı formatı düzeltildi.
- Null/undefined ve boş değer kontrolleri eklendi.

### 2025-05-09
- Cloudinary dosya yükleme entegrasyonu tamamlandı.
- Local dosya sistemi ve eski upload kodları temizlendi.
- Ortam değişkenleri Vercel paneline eklendi ve test edildi.
- Tüm dosya yüklemeleri sorunsuz şekilde Cloudinary üzerinden çalışıyor.
- API ve frontend entegrasyonu başarıyla test edildi.

---

## Önemli Notlar

### Sosyal Medya ve İletişim Verilerinin Özelleştirilmesi
- Panel üzerinden sosyal medya ve iletişim verileri için özelleştirilmiş label/text girebilirsiniz
- Özelleştirilmiş label/text girilmediğinde otomatik olarak platform/tip adı kullanılır
- Her bir sosyal medya ve iletişim öğesi bağımsız olarak değerlendirilir
- Bir öğede özelleştirilmiş label/text girilse bile diğer öğeler etkilenmez
- Tüm ikonlar ve veriler eksiksiz ve doğru şekilde görüntülenir

---

## Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Özellik eklendi'`)
4. Branch'inize push edin (`git push origin feature/ozellik`)
5. Pull Request açın

---

## Lisans

MIT Lisansı altında dağıtılmaktadır. Detaylı bilgi için `LICENSE` dosyasını inceleyiniz.

---

## Veritabanı

Proje Supabase PostgreSQL veritabanı kullanmaktadır. Tüm bağlantı ve migration işlemleri Prisma ile yönetilmektedir.

## Cloudinary Dosya Yükleme Entegrasyonu

Bu projede, profil fotoğrafı, firma logosu ve katalog dosyalarının yüklenmesi için Cloudinary bulut servisi kullanılmaktadır. Vercel gibi sunucularda dosya sistemine yazma kısıtlaması olduğu için, tüm dosya yüklemeleri doğrudan Cloudinary'ye yapılır ve dönen URL veritabanında saklanır.

### Kurulum ve Ortam Değişkenleri
Aşağıdaki ortam değişkenlerini hem localde `.env.local` dosyanıza hem de Vercel panelinde **Environment Variables** bölümüne ekleyin:

```
CLOUDINARY_CLOUD_NAME=dmjdeij1f
CLOUDINARY_API_KEY=746137369292131
CLOUDINARY_API_SECRET=CKFK5grKj6cdfISd_Te6ea5yFj8
```

### Kullanım
- Frontend'de dosya seçimi FormData ile API'ya gönderilir.
- Backend'de dosya Cloudinary'ye yüklenir ve dönen `secure_url` veritabanına kaydedilir.
- Artık public/uploads veya local dosya sistemi kullanılmaz.

### Önemli Notlar
- Ortam değişkenleri eksiksiz ve doğru tanımlanmazsa yükleme çalışmaz.
- Vercel'de değişiklik sonrası yeni deploy başlatılmalıdır.
