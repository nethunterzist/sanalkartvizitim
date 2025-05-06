## 🔧 {YYYY-MM-DD} - Yeni Firma Eklerken İletişim Verileri Kaydedilmiyordu

**Sorun:** Yeni bir firma eklenirken, iletişim sekmesinde girilen bilgiler (telefon, e-posta, WhatsApp, Telegram, Harita, Website vb.) veritabanına kaydedilmiyor ve kartvizit sayfasında görünmüyordu. Ancak sosyal medya bilgileri sorunsuz kaydediliyordu.

**Neden:** Sorunun temel nedeni, frontend (firma ekleme sayfası) ile backend (firma ekleme API'si) arasında iletişim verilerinin gönderilme ve alınma biçimleri arasındaki tutarsızlıktı. Önceki düzeltmeler ve yeniden yapılandırmalar sırasında:
1.  **Frontend:** İletişim bilgilerini (`communicationAccounts` state'inden) alıp, tek bir JSON string'i haline getirerek `FormData` içinde `communication_data` anahtarıyla gönderiyordu.
2.  **Backend:** API tarafındaki kod ise, iletişim verilerini `FormData` içinden tek tek, indeksli anahtarlarla (`telefon[0]`, `eposta[1]`, `whatsapp_label[0]` vb.) okumayı bekliyordu. `communication_data` anahtarını artık birincil veri kaynağı olarak kullanmıyordu.

Bu uyumsuzluk nedeniyle, backend API'si beklediği indeksli anahtarları `FormData` içinde bulamıyor, iletişim verilerini işleyemiyor ve sonuç olarak veritabanına iletişim bilgileri için boş bir JSON (`{"telefonlar":[],"epostalar":[],...}`) kaydediyordu.

**Çözüm:**
1.  Frontend'deki `app/admin/firmalar/yeni/page.tsx` dosyasında bulunan `handleSubmit` fonksiyonu güncellendi.
2.  Fonksiyon artık `communicationAccounts` dizisindeki her bir iletişim bilgisini döngüyle geziyor.
3.  Her bir iletişim bilgisi (değer ve etiket), backend'in beklediği formatta (`${account.type}[${index}]` ve `${account.type}_label[${index}]`) `FormData` nesnesine ayrı ayrı ekleniyor.
4.  İletişim verilerini tek bir JSON string'i olarak `communication_data` anahtarıyla gönderme işlemi kaldırıldı.

**Dosyalar:**
- `app/admin/firmalar/yeni/page.tsx` - `handleSubmit` fonksiyonu, iletişim verilerini backend'in beklediği indeksli formatta gönderecek şekilde düzeltildi.

**Not:** Bu olay, özellikle veri işleme mantığı yeniden düzenlendiğinde, frontend'in veri gönderme formatı ile backend'in veri alma beklentisi arasındaki tutarlılığın ne kadar kritik olduğunu göstermektedir. API ve istemci arasındaki veri sözleşmesinin net ve güncel tutulması bu tür regresyon hatalarını önleyebilir.

---

## 🔧 {YYYY-MM-DD} - WhatsApp İkonu Tekrarlanan Numara Nedeniyle Gösterilmiyordu

**Sorun:** Firma kartvizit sayfasında, hem telefon numarası hem de WhatsApp numarası olarak aynı numara girildiğinde, WhatsApp ikonu "tekrarlanan iletişim bilgisi" olarak algılanıp gösterilmiyordu.

**Neden:** Sistem, tüm iletişim türleri (telefon, e-posta, WhatsApp vb.) için girilen değerlerin benzersiz olup olmadığını kontrol ediyordu. Bir numara telefon olarak eklendikten sonra, aynı numara WhatsApp için eklenmeye çalışıldığında, sistem bunu tekrar eden bir giriş olarak algılıyor ve WhatsApp ikonunu eklemiyordu.

**Çözüm:** `app/[slug]/page.tsx` dosyasındaki ikon oluşturma mantığı güncellendi. Artık benzersizlik kontrolü yapılırken, iletişim türünün WhatsApp olup olmadığına bakılıyor. Eğer tür WhatsApp ise, numara daha önce başka bir türde (örneğin telefon) eklenmiş olsa bile benzersizlik kontrolü atlanıyor ve WhatsApp ikonu oluşturuluyor. Diğer iletişim türleri için benzersizlik kontrolü eskisi gibi devam ediyor.

**Dosyalar:**
- `app/[slug]/page.tsx` - İletişim verileri işlenirken WhatsApp için benzersizlik kontrolü kaldırıldı.

**Not:** Bu değişiklikle birlikte, aynı telefon numarası hem arama hem de WhatsApp için ayrı ikonlar olarak gösterilebilir hale geldi.

---

## Kartvizit İletişim Entegrasyonu Güncellemesi

Tarih: Tue Apr 29 17:33:49 +03 2025

### Yapılan Değişiklikler

1. İletişim verilerinin kartvizit şablonuna entegrasyonu sağlandı.
2. Verileri HTML şablonundaki ikon yapısına uygun şekilde yerleştiren algoritma eklendi.
3. İletişim türleri (telefon, e-posta, whatsapp, telegram) için doğru ikonlar ve linkler oluşturuldu.

### Çalışma Prensibi

- İletişim verileri veritabanındaki communication_data JSON alanından okunuyor
- Her bir iletişim türü için HTML şablonundaki ikon yapısına uygun elemanlar dinamik oluşturuluyor
- Oluşturulan ikonlar icons-container içerisine yerleştiriliyor
- Her iletişim türü için uygun bağlantı türleri (tel:, mailto:, wa.me, t.me) otomatik oluşturuluyor
- Güncel ikon görselleri kullanılıyor (tel.png, mail.png, wp.png, telegram.png)

### Dikkat Edilmesi Gerekenler

- HTML şablonunun yapısı korunmalı, özellikle icons-container yapısı değiştirilmemeli
- İkon görselleri /public/img/ klasöründe bulunmalı
- İletişim verilerindeki değişiklikler direkt olarak kartvizite yansıyacak

---

## 🔧 2023-04-20 - Firma Kayıt Formunda Banka Hesapları Sekmesi Sorunu Çözüldü

**Sorun:** Firma kayıt sayfasında banka hesapları sekmesinde kaydet butonu bulunmuyordu ve son sekmede sadece "İleri" butonu vardı. Bu nedenle firma kaydı tamamlanamıyordu. Ayrıca formu kaydettiğimizde "API isteği başarısız: Invalid `prisma.$executeRaw()` invocation: Raw query failed. Code: `1`. Message: `no such column: communication_accounts`" hatası alınıyordu.

**Neden:** İki temel sorun vardı:
1. Frontend'de sekmeler ve butonların gösterilme koşulları hatalıydı. Sadece belirli sekmelerde "Kaydet" butonu gösteriliyordu ve banka hesapları sekmesinde (son sekme) "Kaydet" butonu yerine "İleri" butonu gösteriliyordu.
2. API'de veritabanında bulunmayan "communication_accounts" alanı kullanılmaya çalışılıyordu.

**Çözüm:**
1. **Sekmeler ve Butonlar:**
   - İletişim sekmesinde (index 3) "Kaydet" butonu yerine "İleri" butonu gösterilecek şekilde düzeltildi
   - Banka Hesapları sekmesinde (index 4) "İleri" butonu yerine "Kaydet" butonu gösterilecek şekilde düzeltildi
   - Butonların görünürlük koşulu `selectedTab === 3 || selectedTab === 4` yerine, yalnızca son sekme için `selectedTab === 4` olarak değiştirildi

2. **API ve Veritabanı Uyumsuzluğu:**
   - API sorgusunda veritabanında bulunmayan "communication_accounts" alanı kaldırıldı
   - Form gönderiminde iletişim bilgileri alanları doğrudan ilgili alanlara (telefon, eposta, whatsapp) atanacak şekilde yeniden düzenlendi
   - API'de form verilerini alırken tip dönüşümleri (toString) ve varsayılan değerler ('') eklenerek daha güvenli hale getirildi

3. **Dosya Alan Adları:**
   - Profil fotoğrafı ve katalog dosyası için alanlar API'nin beklediği adlarla uyumlu hale getirildi (profilFoto → profilePhoto, katalog → catalog)
   - Banka hesapları alanı "bank_accounts" yerine "bankaHesaplari" olarak değiştirildi

**Dosyalar:**
- `app/admin/firmalar/yeni/page.tsx` - Sekmeler ve butonlar düzeltildi, form gönderim alanları API ile uyumlu hale getirildi
- `app/api/firmalar/route.ts` - Veritabanında olmayan alanlar kaldırıldı, form veri işleme güvenli hale getirildi

**Not:** Bu değişikliklerle birlikte firma kayıt formunun son sekmesinden başarılı şekilde kayıt yapılabilmektedir. Frontend ve backend arasındaki alan adı uyumsuzluklarının önüne geçmek için daha sistematik bir yaklaşım geliştirilebilir, örneğin TypeScript interface'leri paylaşılarak veya OpenAPI şeması kullanılarak API dokümantasyonu oluşturulabilir.

---

# 💻 Geliştirme Günlüğü

Bu dosya, projede yapılan teknik geliştirmeleri ve çözülen hataları kaydetmek için oluşturulmuştur. Her bir giriş, yapılan değişikliğin detaylarını, nedenini ve çözümünü belgelemektedir.

---

## 🔧 2023-08-17 - Firma Düzenleme Alanları Güncellenmiyordu

**Sorun:** Firma düzenleme sayfasında "Yetkili Adı", "Yetkili Pozisyon", "Firma Ünvanı" ve "Firma Vergi No" alanları düzenlendikten sonra kaydedilmiyor, başarı mesajı gelmesine rağmen veritabanına yansımıyordu.

**Neden:** Frontend ile backend arasında alan adı uyuşmazlığı vardı. Frontend'de alanlar camelCase (yetkiliAdi, unvan) olarak gönderilirken, backend API'de snake_case (yetkili_adi, firma_unvan) formatında bekleniyordu.

**Çözüm:**
1. Frontend'de formData oluşturulurken alan adları API'nin beklediği formata uygun olarak değiştirildi (örn: yetkiliAdi -> yetkili_adi, unvan -> firma_unvan)
2. Backend API'de Prisma TypeScript hatası nedeniyle bazı alanlar direkt Prisma update() sorgusunda kullanılamıyordu, bu nedenle bu alanlar için raw SQL sorgusu eklendi

**Dosyalar:**
- `app/admin/firmalar/[id]/page.tsx` - FormData oluşturma kısmında alan adları değiştirildi
- `app/api/firmalar/[id]/route.ts` - Prisma update işlemi sonrası raw SQL sorgusu eklendi

**Not:** Bu tür Frontend-Backend uyumsuzluklarını önlemek için API dokümantasyonu oluşturulmalı ve tüm geliştirme ekibi tarafından takip edilmeli. Ayrıca TypeScript interface'leri paylaşılarak tip uyumluluğu sağlanabilir.

---

## 🔧 2023-08-20 - Firma Bilgileri Frontend'de Görünüp Kayboluyordu

**Sorun:** Firma adı, yetkili adı, pozisyon gibi bilgiler sayfanın ilk yüklenme anında çok kısa süreliğine görünüp sonra hemen kayboluyordu.

**Neden:** Sayfa yüklendiğinde çalışan JavaScript kodu, sayfa içeriğini yeniden düzenlerken (DOMContentLoaded olayı içinde) ikonları düzenleme amacıyla tüm elemanları kaldırıp yeniden ekleme işlemi yapıyordu. Bu süreçte, firma bilgilerini içeren elementler de etkileniyordu.

**Çözüm:**
JavaScript içindeki ikonları düzenleme kodu, sadece ikonları hedefleyecek şekilde güncellenmelidir. Bunun için:
1. Sadece ikon sınıfına sahip elementleri hedefleyen daha spesifik seçiciler kullanılmalı
2. Firma ve yetkili bilgilerini içeren div elementleri yeniden düzenleme işlemine dahil edilmemeli

**Dosyalar:**
- `templates/index-template.html` - JavaScript bölümünde ikonları düzenleme kodu güncellendi

**Not:** DOM manipülasyonu yaparken, sadece gerekli elementleri hedefleyen spesifik seçiciler kullanmak çok önemli. Ayrıca, dinamik olarak DOM'u değiştiren kodlar, sayfanın diğer kısımlarını etkilemediğinden emin olmak için test edilmelidir.

---

## 🔧 2023-08-22 - Katalog PDF Dosyasını Kaldırma Özelliği Eklendi

**Sorun:** Firma düzenleme sayfasında katalog PDF dosyasını kaldırmak için bir seçenek yoktu. Hatalı dosya yüklendiğinde veya katalog artık kullanılmadığında kaldırılamıyordu.

**Neden:** Mevcut sistemde katalog dosyasını değiştirme özelliği vardı, ancak tamamen kaldırma özelliği eksikti.

**Çözüm:**
1. Frontend'e "Katalog Kaldır" butonu eklendi ve bu buton tıklandığında katalog bilgisini temizleyip, bir "silme" flag'i ayarlayacak şekilde güncellendi
2. Backend API'ye katalog silme işlemi eklendi. Eğer formData'da 'katalog_sil' parametresi 'true' olarak gelirse:
   - Fiziksel PDF dosyası diskten silinir
   - Veritabanındaki katalog alanı null olarak güncellenir

**Dosyalar:**
- `app/admin/firmalar/[id]/page.tsx` - Katalog kaldırma butonu ve ilgili state'ler eklendi
- `app/api/firmalar/[id]/route.ts` - Katalog silme işlevi eklendi

**Not:** Dosya yönetiminde silme işlemleri hem veritabanı hem de disk üzerindeki dosyaları senkronize olarak yönetmeli. Ayrıca Type güvenliği için değişken türleri doğru şekilde belirtilmeli (string | null gibi).

---

## 🔧 2023-08-24 - Profil Fotoğrafı Kaldırma Özelliği ve UI İyileştirmeleri

**Sorun:** Firma düzenleme sayfasında profil fotoğrafını tamamen kaldırma seçeneği yoktu ve dosya kaldırma butonları modern bir görünüme sahip değildi.

**Neden:** Katalog silme özelliği gibi, profil fotoğrafı için de bir silme özelliği gerekiyordu. Ayrıca butonlar kullanıcı arayüzü açısından yeterince modern ve sezgisel değildi.

**Çözüm:**
1. Profil fotoğrafı için kaldırma özelliği eklendi:
   - Frontend'de önizleme görüntüsünün üzerinde X işaretli bir kaldırma butonu eklendi
   - Backend'de profil fotoğrafını diskten ve veritabanından silme işlevi eklendi
   
2. UI İyileştirmeleri:
   - Katalog kaldırma butonu yazılı metinden X işaretli bir simgeye dönüştürüldü
   - Profil fotoğrafı kaldırma butonu da aynı tasarıma sahip, modern bir X işareti olarak eklendi
   - Butonlar için hover efektleri ve geçiş animasyonları eklendi

**Dosyalar:**
- `app/admin/firmalar/[id]/page.tsx` - Profil fotoğrafı kaldırma butonu eklendi ve kaldırma butonları modernize edildi
- `app/api/firmalar/[id]/route.ts` - Profil fotoğrafı silme işlevi eklendi

**Not:** Modern UI elementleri kullanmak kullanıcı deneyimini iyileştirir. Ayrıca tüm silme işlemlerinde benzer tasarım kullanmak tutarlılık sağlar ve kullanıcıların arayüzü daha kolay öğrenmesine yardımcı olur.

---

## 🔧 2023-08-25 - İletişim Bilgileri İçin Çoklu Giriş Alanları Eklendi

**Sorun:** Firma ekleme ve düzenleme sayfalarında telefon, e-posta ve WhatsApp için sadece tek bir alan vardı, ancak birden fazla iletişim bilgisi eklemek gerekebiliyordu.

**Neden:** Sosyal medya hesaplarında olduğu gibi, iletişim bilgileri için de çoklu giriş alanları gerekmekteydi. Bazı firmalar birden fazla telefon numarası, e-posta adresi veya WhatsApp numarası kullanıyor.

**Çözüm:**
1. Tüm iletişim bilgileri için çoklu giriş alanları eklendi:
   - Her alan için dinamik bir dizi state oluşturuldu (`telefonlar`, `epostalar`, `whatsapplar`)
   - Her alana yeni bir giriş ekleyebilmek veya mevcut girişi silebilmek için + ve - butonları eklendi
   - Form verisi gönderilirken, çoklu alanların değerleri `alan[0]`, `alan[1]` formatında gönderildi

2. Backend API güncellendi:
   - API'nin çoklu alan değerlerini işleyebilmesi için güncellemeler yapıldı
   - Çoklu alanlar veritabanında JSON dizileri olarak saklanıyor

**Dosyalar:**
- `app/admin/firmalar/[id]/page.tsx` - Düzenleme sayfasında çoklu iletişim alanları eklendi
- `app/admin/firmalar/yeni/page.tsx` - Ekleme sayfasında çoklu iletişim alanları eklendi
- `app/api/firmalar/[id]/route.ts` - Düzenleme API'si çoklu alan desteği eklendi
- `app/api/firmalar/route.ts` - Ekleme API'si çoklu alan desteği eklendi

**Not:** İki sayfa arasında tutarlılık sağlamak ve kod tekrarını önlemek için ortak bileşenler oluşturulabilir. Bütün formlarda çoklu alan desteği olması kullanıcılara daha esnek bir deneyim sunar.

---

## 🔧 2023-08-27 - Çoklu İletişim Bilgileri Veritabanına Kaydedilmiyordu

**Sorun:** Admin panelinde çoklu iletişim bilgileri (telefon, e-posta, WhatsApp) verileri görünüşte kaydediliyor ancak veritabanına yazılmıyordu. Sistem başarı mesajı göstermesine rağmen, bilgiler veritabanında boş görünüyordu.

**Neden:** Backend API'de, çoklu iletişim bilgileri için frontend'den gönderilen verilerin işlenmesinde sorun vardı. Frontend'den veriler düzgün gönderilmesine rağmen, backend'de bu verileri işleyen kod doğru çalışmıyordu.

**Çözüm:**
1. Backend API'de çoklu alan işleme fonksiyonları güncellendi
2. Gelen form verilerinin `alan[0]`, `alan[1]` formatındaki değerlerini doğru şekilde algılayıp diziye çeviren fonksiyon eklendi
3. Diziye çevrilen değerlerin veritabanına JSON olarak kaydedilmesi sağlandı
4. İlgili Prisma şema tanımları çoklu alanları destekleyecek şekilde güncellendi

**Dosyalar:**
- `app/api/firmalar/[id]/route.ts` - Çoklu alan işleme kodları güncellendi
- `app/api/firmalar/route.ts` - Yeni firma eklerken çoklu alan desteği güncellendi
- `schema.prisma` - İlgili alanların tipleri JSON olarak güncellendi

**Not:** Frontend ve backend arasındaki veri alışverişinde, çoklu alanların nasıl işleneceği konusunda net bir standart belirlenmeli ve her iki tarafta da tutarlı uygulanmalıdır. Form verisi gönderilmeden önce konsola yazdırılarak kontrol edilmesi, bu tür sorunların tespitini kolaylaştırır.

---

## 🔧 2023-08-28 - Çoklu İletişim Bilgilerinin HTML İkonları Gösterilmiyordu

**Sorun:** Admin panelinde çoklu iletişim bilgileri (telefon, e-posta, WhatsApp) veritabanına doğru şekilde kaydedilmesine rağmen, oluşturulan dijital kartvizit sayfasında sadece bir adet iletişim ikonu görünüyordu. Sosyal medya hesapları düzgün şekilde çoklu olarak görünürken, iletişim bilgileri için aynı durum söz konusu değildi.

**Neden:** HTML şablonunda (`index-template.html`) çoklu iletişim bilgilerini işlemek için doğru şekilde Handlebars döngüleri oluşturulmamıştı. Şablonda iletişim bilgileri tek bir değermiş gibi işleniyordu, ancak backend tarafında artık bu veriler dizi olarak saklanıyordu.

**Çözüm:**
1. HTML şablonu içindeki telefon, e-posta ve WhatsApp ikonlarını gösterme bölümleri güncellendi
2. Her bir alan için dizi tipinde veri geldiğinde döngü ile tüm değerleri gösterecek Handlebars şablonu düzenlendi
3. `htmlGenerator.ts` dosyasındaki `FirmaHTMLProps` arayüzü güncellendi, telefon, eposta ve whatsapp alanları string veya string[] olarak tanımlandı
4. Verileri işleyen `parseJsonToArray` fonksiyonu geliştirildi
5. vCard dosyasını oluşturan `vcardGenerator.ts` dosyası da çoklu telefon ve e-posta destekleyecek şekilde güncellendi

**Dosyalar:**
- `templates/index-template.html` - Çoklu iletişim bilgilerini gösteren Handlebars döngüleri eklendi
- `app/lib/htmlGenerator.ts` - `FirmaHTMLProps` arayüzü ve parseJsonToArray fonksiyonu güncellendi
- `app/lib/vcardGenerator.ts` - Çoklu telefon ve e-posta destekleyecek şekilde güncellendi

**Not:** Bu değişikliklerle, uygulamanın hem tek hem de çoklu iletişim bilgilerini desteklemesi sağlandı. Mevcut verilerin geriye dönük uyumluluğu korundu, yani eski format (tek bir string) veya yeni format (string dizisi) olarak gelen verilerin her ikisi de doğru şekilde gösterilecek.

---

## 🔧 2023-08-29 - TikTok Sosyal Medya Desteği Eklendi

**Özellik:** Admin panelinde firma ekleme ve düzenleme sayfalarına TikTok sosyal medya hesaplarını ekleyebilme, çoğaltabilme ve düzenleyebilme özelliği eklendi.

**Neden:** Müşteri talepleri doğrultusunda, diğer popüler sosyal medya platformları gibi TikTok hesaplarının da eklenebilmesi ve dijital kartvizitte gösterilmesi gerekiyordu.

**Yapılan Değişiklikler:**
1. Admin panelinde firma düzenleme ve ekleme sayfalarına, diğer sosyal medya alanlarına benzer şekilde çoğaltılabilir TikTok alanı eklendi
2. Backend API'leri TikTok verilerini işleyecek ve veritabanına kaydedecek şekilde güncellendi
3. HTML şablonu, TikTok ikonlarını ve bağlantılarını gösterecek şekilde düzenlendi
4. HTML oluşturucu kütüphanesi (htmlGenerator.ts) TikTok alanını tanıyacak şekilde güncellendi

**Dosyalar:**
- `app/admin/firmalar/[id]/page.tsx` - Firma düzenleme sayfasına TikTok alanı eklendi
- `app/admin/firmalar/yeni/page.tsx` - Firma ekleme sayfasına TikTok alanı eklendi
- `app/api/firmalar/[id]/route.ts` - Düzenleme API'sine TikTok alanı desteği eklendi
- `app/api/firmalar/route.ts` - Ekleme API'sine TikTok alanı desteği eklendi
- `templates/index-template.html` - HTML şablonuna TikTok ikonu ve bağlantı desteği eklendi
- `app/lib/htmlGenerator.ts` - HTML oluşturucuya TikTok alanı eklendi
- `public/img/tiktok.png` - TikTok ikonu eklendi

**Not:** TikTok desteği sayesinde, artık firmalar dijital kartvizitlerinde TikTok hesaplarını da paylaşabilecekler. Bu güncelleme, özellikle genç kitleye hitap eden işletmeler için değerli bir özellik olacaktır. Tiktok ikonu için, diğer sosyal medya ikonlarıyla uyumlu bir tasarım kullanıldı.

---

## 🔧 2023-08-30 - Çoklu İletişim Bilgilerinin Gerçekleştirim Detayları

**Özellik:** Çoklu iletişim bilgilerinin (telefon, e-posta, WhatsApp) teknik altyapısı ve gerçekleştirim detayları.

**Genel Mimari:**
Çoklu iletişim bilgileri için uçtan uca bir çözüm geliştirdik:

1. **Frontend (React/Next.js)**: 
   - Dinamik form alanları kullanarak her iletişim türü için birden fazla giriş eklenebiliyor
   - Her alan için `useState` hook'ları ile dizi şeklinde state yönetimi kullanıldı:
     ```typescript
     const [telefonlar, setTelefonlar] = useState<string[]>(['']);
     const [epostalar, setEpostalar] = useState<string[]>(['']);
     const [whatsapplar, setWhatsapplar] = useState<string[]>(['']);
     ```
   - Her alana ekle/kaldır butonları ile dinamik form kontrolü sağlandı

2. **Veri Gönderimi**:
   - FormData nesnesi içinde dizi elemanları indeks bazlı gönderildi:
     ```typescript
     telefonlar.filter(Boolean).forEach((tel, index) => {
       formData.append(`telefon[${index}]`, tel);
     });
     ```

3. **Backend (Node.js/Next.js API Routes)**:
   - FormData'dan gelen indeksli alanları algılayarak dizilere dönüştürme:
     ```typescript
     const telefonArray: string[] = [];
     // Form verilerinden telefon numaralarını topla
     Array.from(formData.keys()).forEach(key => {
       if (key.startsWith('telefon[') && key.endsWith(']')) {
         const value = formData.get(key) as string;
         if (value && value.trim()) {
           telefonArray.push(value);
         }
       }
     });
     ```
   - Bu dizileri JSON formatına dönüştürerek veritabanında saklanacak hale getirme:
     ```typescript
     const telefon = telefonArray.length > 0 ? JSON.stringify(telefonArray) : null;
     ```

4. **Veritabanı (SQLite/Prisma)**:
   - Prisma şemasında ilgili alanlar `String?` olarak tanımlandı, ancak içerik olarak JSON formatında dizi saklıyoruz
   - Örnek Prisma model tanımı:
     ```prisma
     model firma {
       // ... diğer alanlar
       telefon           String?
       eposta            String?
       whatsapp          String?
       // ... diğer alanlar
     }
     ```

5. **HTML Gösterimi**:
   - Template'de Handlebars döngüleri ile çoklu alanların gösterimi:
     ```handlebars
     {{#each telefonlar}}
       <a href="tel:{{this}}" class="ico-item">
         <img src="img/phone.png" alt="Telefon">
       </a>
     {{/each}}
     ```
   - Veri işleme sırasında JSON string içindeki dizileri parse ederek HTML'e hazırlama:
     ```typescript
     const parseJsonToArray = (jsonString: string | null): string[] => {
       if (!jsonString) return [];
       try {
         return JSON.parse(jsonString);
       } catch {
         return [jsonString];
       }
     };
     ```

**İlgili Dosyalar:**
- `app/admin/firmalar/[id]/page.tsx` - Frontend form yönetimi
- `app/api/firmalar/[id]/route.ts` - Backend veri işleme
- `prisma/schema.prisma` - Veritabanı şeması
- `templates/index-template.html` - HTML şablonu
- `app/lib/htmlGenerator.ts` - HTML oluşturma mantığı

**Not:** Bu mimari, diğer çoklu alanlar (sosyal medya hesapları, web siteleri, haritalar) için de aynı şekilde uygulandı. Tekrar kullanılabilir bileşenler ve fonksiyonlar sayesinde kod tekrarı minimuma indirildi ve bakımı kolay bir yapı oluşturuldu.

---

## 🔧 2023-08-31 - Veritabanı Şema Sorunları ve Çözümleri

**Sorun:** Veritabanı şemasında bir hata nedeniyle tablolar oluşturulmuyor, firma ekleme ve düzenleme işlemleri çalışmıyordu. API isteklerinde `Invalid invocation: The table 'main.firmalar' does not exist in the current database.` ve `The column 'main.firmalar.eposta' does not exist in the current database.` gibi hatalar alınıyordu.

**Neden:** Prisma şema dosyasında (`schema.prisma`) şu sorunlar tespit edildi:
1. Şema dosyasının sonunda bir yüzde (%) işareti gibi geçersiz karakterlerin varlığı
2. Prisma şemasının veritabanına doğru şekilde uygulanmaması
3. Model isimlerinin doğru şekilde eşleştirilmemesi (model adları ile tablo adları arasında tutarsızlık)

**Çözüm:**
1. Prisma şema dosyasındaki geçersiz karakterler temizlendi
2. Veritabanı dosyaları temizlendi: `rm -f data/sanal-kartvizit.db*`
3. Prisma şeması yeniden uygulandı: `npx prisma migrate reset --force` ve `npx prisma db push`
4. Veritabanı yeniden başlatıldı: `node scripts/init-db.js`
5. Şema dosyasında model-tablo eşleştirmeleri `@@map` direktifi ile doğru şekilde yapılandırıldı

**Dosyalar:**
- `prisma/schema.prisma` - Şema dosyası temizlendi ve düzeltildi
- `app/lib/db.ts` - Veritabanı bağlantı ve sorgulama işlemleri geliştirildi

**Not:** Prisma şema değişikliklerinden sonra mutlaka `npx prisma generate` komutu çalıştırılmalı ve şemanın veritabanına uygulandığından emin olunmalıdır. Ayrıca model adları ve tablo adları arasındaki eşleştirmelerin doğru yapıldığından emin olmak için `@@map` direktifi kullanılmalıdır.

---

## 🔧 2023-09-01 - TikTok İkonunun Eksik Olması Sorunu

**Sorun:** TikTok desteği başarıyla eklenmişti, ancak firma kartlarında TikTok ikonu görünmüyordu. Veritabanına TikTok hesapları başarıyla kaydedildiği halde, dijital kartvizit sayfasında ikonlar görünmüyordu.

**Neden:** İnceleme sonucunda iki sorun tespit edildi:
1. `/public/img/` klasöründe bulunan `tiktok.png` dosyası 0 byte büyüklüğündeydi, yani içeriği yoktu
2. HTML şablonu içinde TikTok ikon bağlantısı doğru şekilde yapılandırılmıştı, ancak dosya olmadığından ikon gösterilemiyordu

**Çözüm:**
1. Uygun bir TikTok logosunu PNG formatında, şeffaf arka planla ve diğer sosyal medya ikonlarıyla uyumlu boyutta indirdik
2. Bu logoyu `/public/img/tiktok.png` olarak kaydettik
3. HTML şablonunda TikTok ikonlarının doğru görüntülendiğini doğruladık
4. Üretim ortamındaki tüm firma kartlarının TikTok ikonlarını gösterebilmesi için HTML dosyalarını yeniden oluşturduk

**Dosyalar:**
- `/public/img/tiktok.png` - TikTok logosu eklendi
- `templates/index-template.html` - TikTok ikonu gösterimi doğrulandı

**Not:** Yeni sosyal medya platformları eklerken, sadece kod değişiklikleri değil, gerekli görsel ve medya dosyalarının da eklenmesi önemlidir. Görsel varlıkların (assets) doğru boyut ve formatta olmasını sağlamak, kullanıcı deneyimini iyileştirir ve uygulama görünümünde tutarlılık sağlar.

---

## 🔄 Form Gönderimi ve Değişiklikleri İzleme İpuçları

API'ye form verileri gönderilirken hata ayıklama için:

```javascript
// Form verilerini konsola yazdırma
console.log('Form verileri:', Object.fromEntries(formData.entries()));

// Belirli alanların değerlerini loglama
console.log('Form değerleri:', {
  yetkili_adi: formData.get('yetkili_adi'),
  firma_unvan: formData.get('firma_unvan')
});
```

API yanıtlarını izleme:

```javascript
const response = await fetch('/api/endpoint', { 
  method: 'PUT', 
  body: formData 
});
const data = await response.json();
console.log('API yanıtı:', data);
```

## 🔧 2024-06-30 - HTML Şablonu Yenilendi ve Modernize Edildi

**Özellik:** Dijital kartvizit HTML şablonu tamamen modernize edildi ve daha gösterişli bir tasarıma kavuşturuldu.

**Neden:** Kullanıcı deneyimini iyileştirmek ve dijital kartvizitleri daha çekici hale getirmek için arayüz tasarımı yenilenmesi gerekiyordu.

**Yapılan Değişiklikler:**
1. Profil resmi için altın/kahverengi renk tonlarında gradient efektli yuvarlak çerçeve eklendi
2. Tüm ikonlar modernize edildi ve daha düzenli bir şekilde sıralandı (her satırda tam 4 ikon)
3. İkonlar için yeni bir düzenleme algoritması eklendi - boş satırlar kaldırıldı ve düzenli bir grid yapısı oluşturuldu
4. Banka hesapları, vergi bilgileri ve hakkımızda bölümleri için geliştirilen yeni tasarım 
5. Paylaş menüsü ve bağlantı kopyalama özelliği modernize edildi
6. Sayfanın genel renk şeması ve tipografisi iyileştirildi
7. Mobil cihazlarda daha iyi görünüm için duyarlı tasarım güncellemeleri yapıldı

**Dosyalar:**
- `templates/index-template.html` - Ana şablon dosyası tamamen güncellendi
- `public/img/` - Yeni ikon dosyaları eklendi

**Not:** Yenilenen dijital kartvizit tasarımı, hem kullanıcı deneyimini iyileştirdi hem de firmaların daha profesyonel bir görünüme kavuşmasını sağladı. Altın/kahverengi renk tonu ile lüks ve profesyonel bir hava katıldı. Tüm firmalar için HTML sayfaları yeniden oluşturularak yeni tasarıma geçiş sağlandı. 

## 🔧 2024-07-01 - QR Kod Sayfaları ve Statik QR Kod Oluşturma Özelliği Eklendi

**Özellik:** Firmalar için QR kod sayfaları ve statik QR kod oluşturma özelliği eklendi.

**Neden:** Kullanıcıların firma kartvizitlerini fiziksel ortamlarda QR kod ile paylaşabilmesi ve kolayca erişilebilir hale getirilmesi gerekiyordu.

**Yapılan Değişiklikler:**
1. Her firma için `/[slug]/qr` formatında özel QR kod sayfası oluşturuldu
2. QR kod görüntülerini statik olarak sunmak için `/public/qrcodes/` klasörü oluşturuldu
3. Firma eklendiğinde veya güncellendiğinde otomatik QR kod oluşturma özelliği eklendi
4. QR kod görüntüleme sayfası için özel bir HTML şablonu oluşturuldu
5. Ana kartvizit sayfalarına QR kod ikonu ve bağlantısı eklendi
6. QR kodlarını indirme özelliği eklendi

**Dosyalar:**
- `lib/qrCodeGenerator.ts` - QR kod oluşturma servisi eklendi
- `app/[slug]/qr/route.ts` - QR kod sayfasını sunan API eklendi
- `templates/qr-template.html` - QR kod sayfası şablonu oluşturuldu
- `templates/index-template.html` - Ana şablona QR kod butonu eklendi
- `app/api/firmalar/route.ts` - Firma eklerken QR kod oluşturma kodu eklendi
- `app/api/firmalar/[id]/route.ts` - Firma düzenleme ve silme API'lerine QR kod işlemleri eklendi
- `scripts/generate-all-qrcodes.ts` - Tüm firmalar için QR kod oluşturma scripti hazırlandı

**Not:** Bu özellik sayesinde, firmalar dijital kartvizitlerini fiziksel ortamlarda da kolayca paylaşabilir hale geldi. Her firma için statik QR kod görselleri oluşturularak performans artırıldı. QR kod sayfaları uzun süreli önbellekleme ile verimli şekilde sunuluyor. 

---

## 🔧 2025-04-20 - Hakkımızda Başlığı Özelleştirme Özelliği

**Özellik:** Firma dijital kartvizitlerindeki "Hakkımızda" bölümü başlığının özelleştirilebilmesi sağlandı.

**Neden:** Müşteri talepleri doğrultusunda, dijital kartvizit sayfalarındaki standart "Hakkımızda" başlığı yerine firmaya özgü başlıklar kullanabilme ihtiyacı vardı.

**Yapılan Değişiklikler:**

1. **Frontend (React/Next.js)**: 
   - Firma düzenleme ve ekleme sayfalarına "Hakkımızda Alanı Başlığı" isimli yeni bir giriş alanı eklendi
   - Bu alan için açıklayıcı metinler ve placeholder değerler eklenerek kullanıcıya rehberlik sağlandı
   - Varsayılan olarak "Hakkımızda" değeri tanımlandı, boş bırakıldığında bu değer kullanılacak şekilde tasarlandı

2. **Veritabanı ve Backend**:
   - Veritabanı şemasına `firma_hakkinda_baslik` alanı eklendi
   - API'ler (GET, POST, PUT) bu alanı işleyecek şekilde güncellendi
   - Form verileri işlenirken bu alan için doğru format dönüşümleri sağlandı

3. **HTML Şablonu ve Görüntüleme**:
   - HTML şablonu, özelleştirilmiş başlığı gösterecek şekilde güncellendi
   - Handlebars şablonu, başlık değeri varsa onu, yoksa varsayılan değeri gösterecek şekilde güncellendi
   - İkon altındaki etiket ve bölüm başlığı, aynı özelleştirilmiş değeri kullanacak şekilde düzenlendi

4. **Veri Senkronizasyonu**:
   - Firma oluşturma ve güncelleme sırasında veri tutarsızlığına yol açan bir sorun tespit edildi
   - Firma verisi SQL ile güncellendikten sonra HTML oluşturma için en güncel verinin çekilmesi sağlandı
   - HTML oluşturma öncesinde veritabanından güncel firma verisi tekrar çekilerek tutarlılık garantilendi

**Dosyalar:**
- `app/admin/firmalar/[id]/page.tsx` - Düzenleme sayfasına "Hakkımızda Alanı Başlığı" eklendi
- `app/admin/firmalar/yeni/page.tsx` - Ekleme sayfasına "Hakkımızda Alanı Başlığı" eklendi
- `app/api/firmalar/[id]/route.ts` - Güncelleme API'si, başlık alanını işleyecek şekilde güncellendi
- `app/api/firmalar/route.ts` - Ekleme API'si, başlık alanını işleyecek şekilde güncellendi
- `templates/index-template.html` - HTML şablonu özelleştirilmiş başlığı destekleyecek şekilde güncellendi
- `app/lib/htmlGenerator.ts` - HTML oluşturucu, başlık alanını işleyecek şekilde güncellendi
- `schema.prisma` - Veritabanı şemasına firma_hakkinda_baslik alanı eklendi

**Not:** Bu özellik sayesinde, firmalar dijital kartvizitlerindeki "Hakkımızda" başlığını kendi kurumsal kimliklerine veya içerik türlerine göre özelleştirebilecekler. Örneğin, bir okul "Tarihçemiz", bir restoran "Hikayemiz" veya bir STK "Misyonumuz" gibi başlıklar kullanabilecek. HTML oluşturma sürecinde veri tutarlılığını sağlamak için yapılan iyileştirmeler, tüm alanların güncel verilerle gösterilmesini garanti altına aldı.

---

## 🔧 2025-04-20 - Sosyal Medya Modüler Kart Sistemi

**Özellik:** Firma ekleme ve düzenleme sayfalarında sosyal medya hesaplarının girilmesi için yeni bir modüler kart yapısı geliştirildi.

**Neden:** Önceki tasarımda, sosyal medya giriş alanları tek bir sayfada listeleniyor ve karmaşık bir görünüm oluşturuyordu. Banka hesapları ekleme bölümünde kullanılan modüler kart yapısının kullanıcı dostu ve düzenli görünümü, sosyal medya alanlarına da uygulanmak istendi.

**Yapılan Değişiklikler:**

1. **Veri Modeli ve State Yönetimi**:
   ```typescript
   interface SocialMediaAccount {
     platform: string;
     url: string;
   }
   
   const [socialMediaAccounts, setSocialMediaAccounts] = useState<SocialMediaAccount[]>([{
     platform: '',
     url: ''
   }]);
   ```

2. **Kullanıcı Arayüzü**:
   - Her sosyal medya hesabı için ayrı bir kart oluşturuldu
   - Her kartta platform seçimi ve URL/kullanıcı adı giriş alanı bulunuyor
   - Kartlar "Hesap #1", "Hesap #2" şeklinde numaralandırıldı
   - "Yeni Sosyal Medya Hesabı Ekle" butonu ile dinamik olarak yeni kart eklenebiliyor
   - Her kartın sağ üst köşesinde silme butonu bulunuyor (en az bir kart korunuyor)

3. **Kullanıcı Deneyimi İyileştirmeleri**:
   - Platform seçimine göre farklı placeholder metinleri gösteriliyor (örn. Instagram için "@kullaniciadi veya instagram.com/kullaniciadi")
   - CSS stillerinde z-index ve konumlandırma sorunları düzeltilerek çakışmalar önlendi
   - Düzgün hizalanmış ve responsive tasarım ile farklı ekran boyutlarına uyum sağlandı

4. **Form Veri İşleme**:
   - Form gönderilirken platform türüne göre doğru parametreler oluşturuluyor:
   ```typescript
   socialMediaAccounts.forEach((account, index) => {
     if (account.platform && account.url) {
       switch (account.platform) {
         case 'instagram':
           formData.append(`instagram[${index}]`, account.url);
           break;
         case 'facebook':
           formData.append(`facebook[${index}]`, account.url);
           break;
         // ...diğer platformlar
       }
     }
   });
   ```

**Dosyalar:**
- `app/admin/firmalar/[id]/page.tsx` - Düzenleme sayfasında sosyal medya kartları eklendi
- `app/admin/firmalar/yeni/page.tsx` - Ekleme sayfasında sosyal medya kartları eklendi
- `app/api/firmalar/[id]/route.ts` - API'nin kart verilerini işlemesi sağlandı
- `app/api/firmalar/route.ts` - API'nin kart verilerini işlemesi sağlandı

**Test Sonuçları:**
- Yeni tasarımla sosyal medya hesabı ekleme işleminin daha kullanıcı dostu hale geldiği gözlemlendi
- "deniyoruz" adlı test firması oluşturuldu ve sosyal medya hesapları başarıyla eklendi
- Firma görüntülendiğinde, eklenen sosyal medya hesapları dijital kartvizitte düzgün şekilde gösterildi

**Not:** Bu yeni modüler kart tasarımı, kullanıcının daha düzenli bir form doldurmasını sağlarken, arayüzün de daha temiz ve profesyonel görünmesini sağladı. Platformun tüm bilgilerini tek bir kartta toplamak, kullanıcının zihinsel yükünü azaltarak daha iyi bir kullanıcı deneyimi sunuyor. İlerleyen aşamalarda, telefon, e-posta ve WhatsApp alanları da benzer bir tasarıma geçirilebilir. 

## 🔧 2025-04-22 - İletişim Formunda Web Sitesi ve Google Harita Alanlarının İyileştirilmesi

**Özellik:** Web Sitesi ve Google Harita bilgilerinin sosyal medya bölümünden iletişim bölümüne taşınması ve verilerin doğru şekilde işlenmesi sağlandı.

**Neden:** Kullanıcı deneyimi açısından, web sitesi ve harita bilgileri sosyal medya kategorisinden çok iletişim kategorisine daha uygun görülmekteydi. Bu değişiklik sayesinde kullanıcılar ilgili bilgileri daha mantıklı bir bölümde bulabilecek.

**Yapılan Değişiklikler:**

1. **İletişim Formu Reorganizasyonu**:
   - "Web Sitesi" ve "Google Harita" seçenekleri sosyal medya bölümünden iletişim bölümüne taşındı
   - İletişim sekmesindeki açılır menüye bu seçenekler eklendi ve placeholder metinleri güncellendi
   - Form üzerindeki etiketler bu değişikliğe uygun şekilde düzenlendi

2. **API Geliştirmeleri**:
   - `processSocialMediaAccounts` fonksiyonu genişletilerek iletişim bölümünden gelen web sitesi ve harita verilerini işleyecek şekilde iyileştirildi
   - İletişim formundan gelen `iletisimWebsiteleri` ve `iletisimHaritalari` verilerinin sosyal medya verilerine entegrasyonu sağlandı
   - Hem sosyal medya hem de iletişim kaynaklarından gelen verilerin doğru şekilde birleştirilmesi için filtreleme mekanizmaları geliştirildi
   - Boş ve geçersiz değerlerin filtrelenmesi ve tekrarlanan değerlerin önlenmesi için ek kontroller eklendi

3. **Veri Yapısı İyileştirmeleri**:
   - İletişim verilerinin JSON yapısı güncellenerek `websiteler` ve `haritalar` alanları eklendi:
     ```typescript
     const communicationData = {
       telefonlar,
       epostalar,
       whatsapplar,
       telegramlar,
       websiteler: iletisimWebsiteleri,
       haritalar: iletisimHaritalari
     };
     ```
   - Hem `POST` hem de `PUT` işlemlerinde bu yeni veri yapısının tutarlı şekilde oluşturulması sağlandı

**Etkilenen Dosyalar:**
- `app/admin/firmalar/yeni/page.tsx` - İletişim formunda web sitesi ve harita seçenekleri eklendi
- `app/api/firmalar/route.ts` - Sosyal medya ve iletişim verilerinin işlenmesi geliştirildi

**Sonuç:**
İletişim bilgilerinin kategorizasyonu iyileştirildi ve kullanıcıların web sitesi ile harita bilgilerini daha uygun bir bölümden ekleyebilmeleri sağlandı. API tarafında da bu değişiklikleri destekleyecek iyileştirmeler yapılarak, verilerin doğru şekilde saklanması ve gösterilmesi sağlandı.

---

# Geliştirme Günlüğü: Yetkili Bilgileri Kaydetme Sorunu Çözümü

## Sorun Tanımı
Firma bilgileri ekleme formunda yetkili adı ve ünvanı girildikten sonra veritabanına kaydedilmiyordu. Ancak düzenleme sırasında aynı bilgiler başarıyla kaydedilebiliyordu.

## Sorunun Kaynağı
1. **Anahtar İsmi Tutarsızlığı**: Frontend ve backend arasında kullanılan anahtar isimlerinde tutarsızlık vardı.
   - Frontend `yetkiliAdi` ve `yetkiliPozisyon` formatında veri gönderirken,
   - Backend API'si ise `yetkili_adi` ve `yetkili_pozisyon` formatında veri bekliyordu.

2. **Form Verilerinin İşlenme Şekli**: 
   - Firma düzenleme API'si (`PUT` metodu) her iki formatta da veri alabiliyor ve doğru şekilde işleyebiliyordu.
   - Ancak firma ekleme API'si (`POST` metodu) sadece `yetkiliAdi` ve `yetkiliPozisyon` formatındaki verileri arıyordu.

## Çözüm Adımları

1. **Backend API'sinde İyileştirme**:
   - `app/api/firmalar/route.ts` dosyasındaki `POST` metodunda yetkili bilgilerinin her iki formatta da alınabilmesini sağladım:
   ```javascript
   const yetkili_adi = (
     formData.get('yetkili_adi') || 
     formData.get('yetkiliAdi')
   )?.toString() || null;
   
   const yetkili_pozisyon = (
     formData.get('yetkili_pozisyon') || 
     formData.get('yetkiliPozisyon')
   )?.toString() || null;
   ```

2. **Hata Ayıklama Loglarının Eklenmesi**:
   - Backend'de yetkili bilgilerinin hangi formatta alındığını ve işlendiğini görmek için detaylı log kayıtları ekledim:
   ```javascript
   console.log("=== YETKİLİ BİLGİLERİ ===");
   console.log("Form data anahtarları:", Array.from(formData.keys()));
   console.log("Yetkili adı (yetkili_adi):", formData.get('yetkili_adi'));
   console.log("Yetkili adı (yetkiliAdi):", formData.get('yetkiliAdi'));
   console.log("Yetkili pozisyon (yetkili_pozisyon):", formData.get('yetkili_pozisyon'));
   console.log("Yetkili pozisyon (yetkiliPozisyon):", formData.get('yetkiliPozisyon'));
   console.log("Kullanılacak yetkili_adi:", yetkili_adi);
   console.log("Kullanılacak yetkili_pozisyon:", yetkili_pozisyon);
   ```

3. **Frontend Form Gönderiminde İyileştirme**:
   - `app/admin/firmalar/yeni/page.tsx` dosyasında form gönderim işlemini düzenleyerek hem `yetkili_adi`/`yetkili_pozisyon` hem de `yetkiliAdi`/`yetkiliPozisyon` formatlarında veri gönderilmesini sağladım:
   ```javascript
   if (yetkiliAdi) {
     formData.append('yetkili_adi', yetkiliAdi);
     formData.append('yetkiliAdi', yetkiliAdi);
     console.log('Yetkili adı ekleniyor:', yetkiliAdi);
   }
   
   if (yetkiliPozisyon) {
     formData.append('yetkili_pozisyon', yetkiliPozisyon);
     formData.append('yetkiliPozisyon', yetkiliPozisyon);
     console.log('Yetkili pozisyonu ekleniyor:', yetkiliPozisyon);
   }
   ```

4. **Veritabanına Kayıt İşleminin Düzenlenmesi**:
   - Backend API'de veritabanına kaydetme işlemini düzenledim, yetkili bilgilerini doğru alanlarla kaydetmek için:
   ```javascript
   const newFirm = await prisma.firmalar.create({
     data: {
       // ... diğer alanlar ...
       yetkili_adi: yetkili_adi,
       yetkili_pozisyon: yetkili_pozisyon,
       // ... diğer alanlar ...
     },
   });
   ```

## Test ve Doğrulama
1. Yeni firma ekleme sayfasında yetkili bilgilerini girdim.
2. API log kayıtlarında hem `yetkili_adi`/`yetkili_pozisyon` hem de `yetkiliAdi`/`yetkiliPozisyon` formatlarında verilerin gönderildiğini doğruladım.
3. Veritabanında kaydedilen firmayı kontrol ederek yetkili bilgilerinin başarıyla kaydedildiğini gördüm.
4. Düzenleme işleminde de yetkili bilgilerinin başarıyla güncellendiğini test ettim.

## Öğrenilen Dersler
1. Frontend ve backend arasında veri alışverişinde anahtar isimlerinin tutarlı olması çok önemlidir.
2. Farklı API endpoint'lerinde (PUT ve POST) benzer işlemlerin tutarlı şekilde yapılması gerekir.
3. Alternatif veri formatlarını destekleme ve yedekli veri gönderimi, veri bütünlüğünü korumak için etkili bir yöntemdir.
4. Detaylı hata ayıklama log kayıtları, karmaşık sorunları çözmekte büyük fayda sağlar.

## Test Sonuçları
Gerçek ortamda yapılan testlerde şu sonuçları gözlemledim:

1. Yeni firma oluşturma sırasında yetkili bilgilerinin başarıyla kaydedildiği doğrulandı.
2. Düzenleme işlemi sırasında yetkili bilgilerinin başarıyla güncellendiği doğrulandı.
3. Log kayıtlarından görüldüğü üzere, backend API'si artık her iki formatta da gelen verileri doğru şekilde işleyebiliyor:

```
DEBUG - Yetkili bilgilerinin değerleri: {
  rawJsonData_yetkili_adi: 'zxczcz2',
  formData_yetkili_adi: 'zxczcz2',
  finalValue_yetkili_adi: 'zxczcz2',
  rawJsonData_yetkili_pozisyon: 'zxczcz2',
  formData_yetkili_pozisyon: 'zxczcz2',
  finalValue_yetkili_pozisyon: 'zxczcz2'
}
```

Değişiklikler sayesinde hem yeni firma ekleme hem de düzenleme işlemlerinde yetkili bilgileri tutarlı bir şekilde kaydedilebiliyor.

## 🔧 2024-07-02 - Firma Düzenleme API'si Yenilendi: Sosyal Medya ve İletişim Verileri Sorunu Çözüldü

**Sorun:** Firma düzenleme sayfasında sosyal medya, iletişim ve banka hesap bilgilerinin düzenlenmesi çalışmıyordu. Kullanıcılar bu alanları değiştirdiklerinde değişiklikler veritabanına kaydedilmiyor, diğer bilgiler başarıyla güncellense bile bu alanlar güncellenmiyordu.

**Neden:** API'deki veri işleme algoritması karmaşık hale gelmişti ve çeşitli formatlarda gelen verileri doğru işleyemiyordu. Ayrıca, verilerin işlenmesi sırasında aşırı dönüşüm ve filtreleme nedeniyle bazı değerler kayboluyordu.

**Çözüm:**
1. API endpoint'i (`/api/firmalar/[id]/route.ts`) tamamen yeniden yazıldı ve sadeleştirildi
2. FormData'dan gelen verileri doğrudan işleyen daha basit bir yaklaşım uygulandı
3. `formData.has()` kontrolleri eklenerek alanın formda olup olmadığı tespit edildi ve:
   - Alan formda varsa ve değer varsa: Gelen değer kullanıldı
   - Alan formda varsa ancak değeri boşsa: Null olarak kaydedildi (silme işlemi)
   - Alan formda yoksa: Mevcut değer korundu
4. Hata durumları için SQL yedekleme mekanizması eklendi
5. Mevcut verileri referans alan bir güncelleme mantığı kuruldu

**Dosyalar:**
- `app/api/firmalar/[id]/route.ts` - API yeniden yazıldı, veri işleme mantığı iyileştirildi

**Not:** Bu değişiklikle birlikte firma düzenleme sırasında tüm alanlar (sosyal medya, iletişim ve banka bilgileri dahil) başarıyla güncellenebiliyor. Karmaşık veri işleme yerine doğrudan FormData'dan veri alınarak sistem daha basit ve güvenilir hale getirildi. Bu yaklaşım, hataları azaltmak için "Keep It Simple" prensibine dayanmaktadır.

## 🔧 2024-07-03 - Canlıya Çıkmadan Önce: Otomatik Doldur Özelliği Kaldırılacak

**Özellik:** Firma ekleme ve düzenleme sayfalarında bulunan "Otomatik Doldur" özelliği, geliştirme ve test aşamasında formları hızlıca rastgele verilerle doldurmayı sağlıyor. Bu özellik, firma bilgilerini, sosyal medya hesaplarını, iletişim bilgilerini ve banka hesaplarını rastgele oluşturulan verilerle tek tıklamayla dolduruyor.

**Neden Kaldırılacak:** Bu özellik sadece geliştirme ve test aşamasında kullanılmak üzere tasarlanmıştır. Canlı ortamda bulunması uygun değildir çünkü:
1. Üretim ortamında gerçekçi olmayan test verileri oluşturabilir
2. Yanlışlıkla kullanıldığında veritabanına istenmeyen veriler eklenebilir
3. Son kullanıcılar için kafa karıştırıcı olabilir
4. Ek kod ve butonlar sayfa yüklenme süresini ve karmaşıklığını artırabilir

**Kaldırma Metodu:**

Firma Ekleme Sayfası (`app/admin/firmalar/yeni/page.tsx`):
1. Import edilen `SparklesIcon` kaldırılacak (satır başındaki import ifadesinden)
2. Header bölümündeki "Otomatik Doldur" butonu kaldırılacak
3. `generateRandomName`, `generateRandomPhone` vb. random veri oluşturan fonksiyonlar kaldırılacak
4. `autoFillForm` fonksiyonu kaldırılacak

Firma Düzenleme Sayfası (`app/admin/firmalar/[id]/page.tsx`):
1. Import edilen `SparklesIcon` kaldırılacak (satır başındaki import ifadesinden)
2. Header bölümündeki "Otomatik Doldur" butonu kaldırılacak
3. `generateRandomName`, `generateRandomPhone` vb. random veri oluşturan fonksiyonlar kaldırılacak
4. `autoFillForm` fonksiyonu kaldırılacak

**Yeniden Ekleme:**

Gelecekte yeniden ihtiyaç duyulursa (örneğin yeni bir geliştirme sürümünde), kaldırılan kodları GitHub'daki geliştirme sürümünden veya bu günlükteki bilgilere dayanarak yeniden ekleyebiliriz. İhtiyaç halinde bu özelliklerin eklenmesi için bir geliştirme talebi oluşturulabilir.

**Not:** Canlı ortama geçmeden önce bu özelliğin kaldırıldığını kontrol etmek önemlidir. Deploy işlemi öncesinde bir kontrol listesi oluşturularak "Otomatik Doldur özelliğinin kaldırılması" bu listeye eklenmelidir.

## 🔧 2024-07-07 - Sosyal Medya Özel Başlıkları Sorunu Çözüldü

**Sorun:** Sosyal medya hesapları için belirlenen özel başlıklar (label) boş geliyordu. Veriler veritabanına kaydediliyor ancak düzenleme sayfasında görüntülenmiyordu.

**Neden:** Sosyal medya özel başlıkları için gereken veritabanı alanları (`instagram_label`, `facebook_label`, vs.) Prisma şemasında ve veritabanında tanımlı değildi. Backend kodu etiketleri işleyip kaydetmeye çalışıyordu, ancak ilgili sütunlar veritabanında olmadığı için hata oluşuyordu.

**Çözüm:**
1. Prisma şemasına sosyal medya platformları için etiket alanları eklendi:
   ```prisma
   model firmalar {
     // ... diğer alanlar ...
     instagram_label   String?
     facebook_label    String?
     twitter_label     String?
     linkedin_label    String?
     youtube_label     String?
     tiktok_label      String?
     website_label     String?
     harita_label      String?
   }
   ```
2. Veritabanı şeması güncellendi: `npx prisma migrate reset --force` ve `npx prisma db push` komutları çalıştırıldı.
3. Uygulama yeniden başlatıldı.

**Dosyalar:**
- `prisma/schema.prisma` - Veritabanı şemasına etiket alanları eklendi
- `app/api/firmalar/[id]/route.ts` - Zaten etiketleri işlemek için düzenlenmişti

**Not:** Bu değişiklikle birlikte, sosyal medya hesapları için özel başlıklar hem firma ekleme hem de düzenleme sayfalarında sorunsuz şekilde çalışacak. Özel başlıklar sayesinde kullanıcılar, sosyal medya ikonları altında görünecek metinleri kendi tercihlerine göre belirleyebilecekler (ör: "Kurumsal Instagram", "Kişisel Twitter" vb.).

## 🔧 {YYYY-MM-DD} - Web Sitesi ve Harita İkonları Çift Görünüyordu

**Sorun:** Yeni firma eklendiğinde, iletişim sekmesinden girilen web sitesi ve harita bilgileri kartvizit sayfasında ikişer adet (çift) ikon olarak görünüyordu. Örneğin, 2 web sitesi eklenmişse 4 ikon çıkıyordu.

**Neden:** Sorunun kaynağı, backend API'sinde (`app/api/firmalar/route.ts`) 'website' ve 'harita' verilerinin iki farklı yerde işlenmesiydi:
1.  **İletişim Veri İşleme:** POST fonksiyonunun ana bölümünde, `FormData`'dan gelen indeksli iletişim bilgileri (`website[0]`, `harita[0]` vb.) okunup ilgili dizilere (`websiteler`, `haritalar`) ekleniyordu. Bu veriler daha sonra `communicationDataJSON` içine dahil ediliyordu.
2.  **Sosyal Medya Veri İşleme:** `processSocialMediaAccounts` yardımcı fonksiyonu da çağrılıyordu ve bu fonksiyon da kendi içinde `FormData`'dan 'website' ve 'harita' anahtarlarını arayıp bulduklarını kendi `websiteler` ve `haritalar` dizilerine ekliyordu. Bu veriler de `socialMediaDataJSON` içine dahil ediliyordu.

Sonuç olarak, aynı web sitesi ve harita bilgileri hem `communication_data` hem de `social_media_data` alanlarına kaydediliyor, kartvizit sayfası oluşturulurken her iki kaynaktan da okunduğu için ikonlar çiftleniyordu.

**Çözüm:**
1.  `processSocialMediaAccounts` fonksiyonu (`app/api/firmalar/route.ts` içinde) güncellendi.
2.  Fonksiyonun `FormData`'dan 'website' ve 'harita' anahtarlarını aramasını ve işlemesini sağlayan kod bölümleri kaldırıldı.
3.  Böylece 'website' ve 'harita' bilgileri artık yalnızca iletişim verilerini işleyen ana bölümde işlenip `communicationDataJSON` içine kaydediliyor. `socialMediaDataJSON` içinde bu türler yer almıyor.

**Dosyalar:**
- `app/api/firmalar/route.ts` - `processSocialMediaAccounts` fonksiyonu artık 'website' ve 'harita' türlerini işlemiyor.

**Not:** Bu düzeltme, farklı veri türlerinin (iletişim vs sosyal medya) işlenme sorumluluklarını net bir şekilde ayırmanın ve veri işleme adımlarını tekilleştirmenin önemini vurgulamaktadır. Veri akışını sadeleştirmek, bu tür çift kayıt hatalarını önler.

## 🔧 2024-05-04 - Kartvizit Sayfaları 404 Hatası ve VCF Dosyası Sorunu Çözüldü

**Sorun:** Kartvizit sayfaları açılmaya çalışıldığında 404 (Not Found) hatası alınıyordu. Ayrıca vCard (VCF) dosyaları oluşturulurken "username.replace is not a function" hatası oluşuyordu.

**Neden:** İki temel sorun tespit edildi:
1. **HTML Oluşturma Sorunu:** `htmlGenerator.ts` dosyasında `generateHtmlForFirma` fonksiyonunda `htmlContent` değişkeni tanımlanmadan kullanılmaya çalışılıyordu. Bu nedenle firma HTML dosyaları düzgün oluşturulmuyor, sadece VCF dosyaları oluşturuluyordu.

2. **VCF Dosyası Hatası:** Sosyal medya hesaplarını işlerken, bazı hesapların string olmayan veri tiplerinde (undefined, null veya obje) olması durumunda `.replace()` metodu çağrılınca hata oluşuyordu.

**Çözüm:**

1. **HTML Oluşturma Düzeltmesi:**
   - `htmlGenerator.ts` dosyasında `generateHtmlForFirma` fonksiyonu güncellendi
   - Eski implementasyonda `htmlContent` değişkeni tanımlı değildi ama kullanılmaya çalışılıyordu
   - Bunun yerine düzgün oluşturulan `generateHtml` fonksiyonunu çağırarak HTML dosyalarının doğru şekilde oluşturulması sağlandı
   - Eksik olan `getIconPriorities` fonksiyonu eklendi

2. **VCF Dosyası Oluşturma Güvenliği:**
   - `vcardGenerator.ts` dosyasında sosyal medya hesaplarını işleyen fonksiyonlar güncellendi
   - Tüm sosyal medya hesapları (Telegram, Instagram, YouTube, vb.) için tip kontrolleri eklendi
   - Her işlem için try-catch blokları eklenerek, bir hesapta hata oluşsa bile diğer hesapların işlenmesi sağlandı
   - String, object ve null durumlarını ele alan koşullu işleme mantığı eklendi

3. **Tüm HTML Dosyalarını Yeniden Oluşturma:**
   - Düzeltmelerden sonra, mevcut tüm firmalar için HTML dosyalarını yeniden oluşturmak için REST API kullanıldı
   - `/api/regenerate-html` endpoint'i çağrılarak tüm HTML dosyaları yeniden oluşturuldu
   - API'nin döndürdüğü sonuçta tüm firmaların başarıyla işlendiği görüldü

**Etkilenen Dosyalar:**
- `app/lib/htmlGenerator.ts` - HTML oluşturma mantığı düzeltildi ve eksik fonksiyon eklendi
- `app/lib/vcardGenerator.ts` - Sosyal medya hesaplarının güvenli şekilde işlenmesi sağlandı

**Not:** Bu sorun, geliştirme sürecinde son yapılan düzeltmeler sırasında ortaya çıkmıştı. Özellikle tip kontrolleri ve hata yakalama mekanizmalarının önemi bir kez daha anlaşıldı. Ayrıca, veri tiplerinin karışık (string, object, array veya null) olabileceği alanlar işlenirken daha dikkatli olmak gerektiği görüldü. Projedeki diğer benzer fonksiyonlar için de aynı tip kontrolleri ve hata yakalama mekanizmaları eklenebilir.

# Geliştirme Günlüğü - 06.03.2025

## Sorun Çözümü: firma_logo Alanı Hatası

### Tanım:
API isteklerinde "Unknown argument 'firma_logo'" hatası alınıyordu. Prisma şeması ile veritabanı tablosu arasında uyumsuzluk vardı.

### Analiz:
- Prisma şemasında `firma_logo` alanı tanımlı olmasına rağmen SQLite veritabanında bu alan mevcut değildi
- `npx prisma migrate` ve `npx prisma db push` komutları sorunu çözmemişti
- Veritabanı doğrudan incelendiğinde `firma_logo` alanının olmadığı görüldü

### Çözüm Adımları:
1. Tüm önbellekleri temizleme:
   ```bash
   rm -rf node_modules/.prisma node_modules/@prisma .next
   ```

2. Prisma paketlerini kaldırıp yeniden yükleme:
   ```bash
   npm uninstall @prisma/client prisma
   npm install prisma @prisma/client
   ```

3. SQLite veritabanına doğrudan SQL komutuyla alanı ekleme:
   ```sql
   ALTER TABLE firmalar ADD COLUMN firma_logo TEXT;
   ```

4. Veritabanından güncel şemayı çekme:
   ```bash
   npx prisma db pull
   ```

5. Prisma istemcisini yeniden oluşturma:
   ```bash
   npx prisma generate
   ```

### Sonuç:
- firma_logo alanı artık doğru şekilde çalışıyor
- API istekleri başarıyla gerçekleşiyor
- QR kodda firma logoları görüntülenebiliyor

### Teknik Not:
Sorun, ORM (Prisma) ve gerçek veritabanı (SQLite) arasındaki uyumsuzluktan kaynaklanıyordu. Şema değişiklikleri standart migration komutlarıyla aktarılamamıştı.

## 🔧 2024-07-04 - Firma Logosu Alanı Sorunu Çözüldü

**Sorun:** Firma düzenleme sayfasında firma bilgileri dışındaki tüm sekmelerdeki içerikler boş görünüyordu. API isteklerinde "Unknown argument `firma_logo`" hatası alınıyordu.

**Neden:** Prisma şeması ile SQLite veritabanı arasında bir uyumsuzluk vardı. Prisma şemasında `firma_logo` alanı tanımlı olmasına rağmen, veritabanı migrasyonu sırasında veritabanına bu alan eklenmemişti. Bu durumda firma oluşturma ve düzenleme işlemleri sırasında hata oluşuyordu.

**Çözüm Adımları:**

1. **Sorunun Tespiti ve Geçici Çözüm:**
   - Hata mesajları incelenerek veritabanı ile Prisma şeması arasındaki uyumsuzluk tespit edildi.
   - Geçici çözüm olarak `app/api/firmalar/route.ts` dosyasında `firma_logo` alanı kullanımı yorum satırına alındı.

2. **Prisma Önbelleklerinin Temizlenmesi:**
   ```bash
   rm -rf node_modules/.prisma node_modules/@prisma .next
   ```

3. **Prisma Paketlerinin Yeniden Yüklenmesi:**
   ```bash
   npm uninstall @prisma/client prisma
   npm install @prisma/client prisma
   ```

4. **Veritabanı Kontrol Edilmesi:**
   - SQLite veritabanı kontrol edildiğinde, `firma_logo` alanının zaten mevcut olduğu, ancak Prisma'nın bu alanı algılamadığı görüldü.
   - Veritabanı şema bilgisi: `PRAGMA table_info(firmalar)` sorgusu ile doğrulandı.

5. **Prisma Şemasının Güncellemesi:**
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

6. **Kontrol için Veritabanı Onarım Betiği Oluşturulması:**
   - `scripts/fix-database.js` adında bir onarım betiği oluşturuldu.
   - Bu betik veritabanındaki alanları kontrol ederek eksik olanları ekliyor.
   - Kontrol sonucu tüm alanların veritabanında mevcut olduğu teyit edildi.

7. **Kodun Yeniden Düzenlenmesi:**
   - Geçici olarak devre dışı bırakılan `firma_logo` alanları tekrar etkinleştirildi.
   - Uygulama yeniden derlendi ve başlatıldı.

**Sonuç:** Yapılan düzeltmeler sayesinde firma düzenleme sayfasında tüm sekmeler artık beklenen şekilde çalışıyor. Firmalar düzgün şekilde oluşturulabiliyor ve düzenlenebiliyor.

**Teknik Not:** Bu sorun, ORM (Prisma) ve gerçek veritabanı (SQLite) arasındaki senkronizasyon probleminden kaynaklanıyordu. Özellikle veritabanı şeması manuel olarak değiştirildiğinde, Prisma'nın bu değişiklikleri algılaması için `prisma db pull` ve `prisma generate` komutlarının çalıştırılması gerekiyor.

**Gelecek için Önlem:** Veritabanı şeması değişikliklerinden sonra Prisma önbelleğinin temizlenmesi ve yeniden oluşturulması iyi bir pratiktir. Ayrıca, değişiklikleri belgelemek ve takip etmek için her zaman geliştirme günlüğüne kaydetmek faydalıdır.

## 🔧 2024-07-11 - Firma Logo Alanı Sorunu Çözüldü

**Sorun:** Firma düzenleme sayfasında firma bilgileri hariç diğer tüm sekmelerin içi boş geliyordu.
- API isteklerinde "Unknown argument `firma_logo`" hatası alınıyordu.

**Neden:** Prisma ORM ile SQLite veritabanı arasında firma_logo alanı senkronizasyon sorunu vardı.
- Veritabanında firma_logo alanı mevcut olmasına rağmen, Prisma modeli bu alanı tanımıyordu.

**Çözüm:**
1. Önbelleklerin temizlenmesi:
   ```
   rm -rf node_modules/.prisma node_modules/@prisma .next
   ```

2. Prisma paketlerinin yeniden kurulması:
   ```
   npm uninstall prisma @prisma/client
   npm install prisma @prisma/client
   ```

3. Tüm node_modules dizininin temizlenip paketlerin tamamen yeniden kurulması:
   ```
   rm -rf node_modules
   npm install
   ```

4. Veritabanı şemasının Prisma'ya çekilmesi:
   ```
   npx prisma db pull
   npx prisma generate
   ```

5. Next.js önbelleğinin temizlenmesi:
   ```
   rm -rf .next
   ```

Bu işlemler sonucunda Prisma modeli veritabanıyla uyumlu hale geldi ve firma düzenleme sayfası tüm sekmeleriyle düzgün çalışmaya başladı.

## 🔧 2024-07-12 - Firma Düzenleme Sayfasında Sekmeler Sorunu Çözüldü

### Sorun:
- Firma düzenleme sayfasında sadece "Firma Bilgileri" sekmesi görünüyor, diğer sekmeler (Kurumsal Bilgiler, Sosyal Medya, İletişim, Banka Hesapları) boş geliyordu.
- Hiçbir hata mesajı verilmemesi sorunun tespitini zorlaştırıyordu.

### Nedeni:
- API'den gelen JSON formatındaki verilerin düzgün parse edilmemesi
- Özellikle `communication_data`, `social_media_data` ve `bank_accounts` alanlarındaki verilerin işlenmesinde sorunlar vardı
- Boş veya geçersiz JSON verileri için yeterli hata kontrolü yapılmamıştı

### Çözüm:
1. JSON parsing işlemi iyileştirildi:
   - String ve obje tiplerinin doğru kontrolü
   - Boş string ve null kontrolü eklendi
   - Kapsamlı hata yakalama mekanizması

2. Eksik veri durumları için varsayılan değerler:
   - Sosyal medya sekmesinde default boş hesap
   - Banka hesapları sekmesinde varsayılan şablon
   - İletişim bilgileri için güvenli işleme

3. Veri doğrulama ve işleme:
   - Array ve objelerin geçerliliği kontrol ediliyor
   - Geçersiz veri durumunda uygun varsayılan değerler kullanılıyor
   - Hata durumları konsola kaydediliyor

Bu değişikliklerle, firma düzenleme sayfasında tüm sekmelerin doğru şekilde içerikle doldurulması sağlandı, böylece kullanıcılar firma bilgilerini eksiksiz düzenleyebilecek.