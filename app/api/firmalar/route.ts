import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { generateHtmlForFirma } from '@/app/lib/htmlGenerator';
import * as fs from 'fs';
import * as path from 'path';
import { generateVCard } from '@/app/lib/vcardGenerator';
import { generateQRCodeDataUrl } from '@/lib/qrCodeGenerator';

// Sosyal medya veri yapısı
interface SocialMediaData {
  instagramlar: Array<{url: string, label?: string}>;
  youtubelar: Array<{url: string, label?: string}>;
  websiteler: Array<{url: string, label?: string}>;
  haritalar: Array<{url: string, label?: string}>;
  linkedinler: Array<{url: string, label?: string}>;
  twitterlar: Array<{url: string, label?: string}>;
  facebooklar: Array<{url: string, label?: string}>;
  tiktoklar: Array<{url: string, label?: string}>;
}

export async function GET(req: NextRequest) {
  try {
    const firmalar = await prisma.firmalar.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    return NextResponse.json({ firmalar });
  } catch (error) {
    console.error('Firmalar getirilirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'Firmalar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("POST request received");
  try {
    const formData = await req.formData();
    console.log("Raw form data:", formData);

    // Form verilerini al
    const firmaAdi = (formData.get('firmaAdi') || formData.get('firma_adi'))?.toString() || '';
    const slug = formData.get('slug')?.toString() || '';
    const firmaTuru = formData.get('firmaTuru')?.toString() || '';
    const adres = formData.get('adres')?.toString() || '';
    const website = formData.get('website')?.toString() || '';
    const telefonStr = formData.get('telefon')?.toString() || '';
    const harita = formData.get('harita')?.toString() || '';
    const hakkimizda = (formData.get('hakkimizda') || formData.get('firma_hakkinda'))?.toString() || '';
    const firma_hakkinda_baslik = formData.get('firma_hakkinda_baslik')?.toString() || '';
    const firma_unvan = formData.get('firma_unvan')?.toString() || '';
    const firma_vergi_no = formData.get('firma_vergi_no')?.toString() || '';
    const vergi_dairesi = formData.get('vergi_dairesi')?.toString() || '';
    
    // Yetkili bilgilerini farklı olası anahtar isimlerinden al
    const yetkili_adi = (
      formData.get('yetkili_adi') || 
      formData.get('yetkiliAdi')
    )?.toString() || null;
    
    const yetkili_pozisyon = (
      formData.get('yetkili_pozisyon') || 
      formData.get('yetkiliPozisyon')
    )?.toString() || null;
    
    // Yetkili bilgilerini logla
    console.log("=== YETKİLİ BİLGİLERİ ===");
    console.log("Form data anahtarları:", Array.from(formData.keys()));
    console.log("Yetkili adı (yetkili_adi):", formData.get('yetkili_adi'));
    console.log("Yetkili adı (yetkiliAdi):", formData.get('yetkiliAdi'));
    console.log("Yetkili pozisyon (yetkili_pozisyon):", formData.get('yetkili_pozisyon'));
    console.log("Yetkili pozisyon (yetkiliPozisyon):", formData.get('yetkiliPozisyon'));
    console.log("Kullanılacak yetkili_adi:", yetkili_adi);
    console.log("Kullanılacak yetkili_pozisyon:", yetkili_pozisyon);

    // İletişim hesaplarını al
    const communicationDataStr = formData.get('communication_data') as string;
    let communicationAccounts = [];
    
    if (communicationDataStr) {
      try {
        const parsedData = JSON.parse(communicationDataStr);
        // Eğer JSON array değilse, boş array olarak devam et
        communicationAccounts = Array.isArray(parsedData) ? parsedData : [];
        if (!Array.isArray(parsedData)) {
          console.error("Communication data parse edildi ama bir dizi değil:", typeof parsedData);
        }
        console.log("Communication accounts:", communicationAccounts);
      } catch (error) {
        console.error("Communication data parse error:", error);
        communicationAccounts = []; // Hata durumunda boş dizi
      }
    }

    // İletişim türleri için boş dizileri tanımla (tip belirterek)
    let telefonlar: Array<{value: string, label?: string}> = [];
    let epostalar: Array<{value: string, label?: string}> = [];
    let whatsapplar: Array<{value: string, label?: string}> = [];
    let telegramlar: Array<{value: string, label?: string}> = [];
    let haritalar: Array<{value: string, label?: string}> = [];
    let websiteler: Array<{value: string, label?: string}> = [];
    
    // FormData'nın tüm anahtarlarını al
    const formKeys = Array.from(formData.keys());
    
    // Anahtar ve değerleri logla
    console.log("Tüm form anahtarları:", formKeys.join(", "));
    
    // Her iletişim türü için SADECE İNDEKSLİ DEĞERLERİ işle
    ['telefon', 'eposta', 'whatsapp', 'telegram', 'harita', 'website'].forEach(type => {
      // İndeksli değerleri al
      formKeys.filter(key => key.startsWith(`${type}[`)).forEach(key => {
        const value = formData.get(key)?.toString();
        // İndeks değerini çıkar (örn: telefon[0] -> 0)
        const indexMatch = key.match(/\[(\d+)\]/);
        const index = indexMatch ? indexMatch[1] : null;
        
        // Doğru label anahtarını oluştur
        const labelKey = index ? `${type}_label[${index}]` : null;
        const label = labelKey ? formData.get(labelKey)?.toString() : null;
        
        console.log(`İndeksli iletişim değeri: ${key}, value: ${value || 'yok'}, labelKey: ${labelKey || 'yok'}, label: ${label || 'yok'}`);
        
        if (value) {
          const item: {value: string, label?: string} = { value };
          if (label && label.trim() !== '') {
            item.label = label.trim();
            console.log(`İndeksli iletişim etiketi (${type}[${index}]): "${label.trim()}"`);
          }
          
          // item nesnesini doğru tipe sahip diziye ekle (as any kaldırıldı)
          if (type === 'telefon') telefonlar.push(item);
          else if (type === 'eposta') epostalar.push(item);
          else if (type === 'whatsapp') whatsapplar.push(item);
          else if (type === 'telegram') telegramlar.push(item);
          else if (type === 'harita') haritalar.push(item);
          else if (type === 'website') websiteler.push(item);
        }
      });
    });

    // Tekrarlanan değerleri çıkar (VALUE bazında kontrol et, SON EKLENENİ veya LABEL'ı olanı koru)
    const uniqueItems = <T extends { value: string, label?: string }>(array: T[]): Array<T> => {
      if (!array || !Array.isArray(array)) return [];
      const seenValues = new Map<string, T>();
      // Diziyi normal sırada işleyelim, böylece aynı değere sahip 
      // birden fazla giriş varsa Map'e en son eklenen kalır.
      array.forEach(item => {
        if (item && item.value) { // Ekstra kontrol: item ve item.value geçerli mi?
          const normalizedValue = item.value.toLowerCase().trim();
          // Her zaman Map'e ekle/güncelle. Aynı anahtar varsa üzerine yazılacak.
          seenValues.set(normalizedValue, item);
        }
      });
      return Array.from(seenValues.values());
    };

    telefonlar = uniqueItems(telefonlar);
    epostalar = uniqueItems(epostalar);
    whatsapplar = uniqueItems(whatsapplar);
    telegramlar = uniqueItems(telegramlar);
    haritalar = uniqueItems(haritalar);
    websiteler = uniqueItems(websiteler);
    
    // Telegram kullanıcı adlarından @ işaretini kaldır
    telegramlar = telegramlar.map(item => ({
      ...item,
      value: item.value.replace(/^@/, '')
    }));

    // İletişim verilerini JSON formatına dönüştür
    const communicationData = {
      telefonlar: telefonlar,
      epostalar: epostalar,
      whatsapplar: whatsapplar,
      telegramlar: telegramlar,
      haritalar: haritalar,
      websiteler: websiteler
    };
    
    const communicationDataJSON = JSON.stringify(communicationData);
    console.log("Güncellenen Communication Data:", communicationDataJSON);

    // Sosyal medya hesaplarını işleyen yardımcı fonksiyon
    const sosyalMedyaHesaplariStr = formData.get('sosyalMedyaHesaplari') as string;
    let sosyalMedyaHesaplari = [];

    console.log("Sosyal medya hesapları işleniyor (POST)");
    console.log("Raw sosyalMedyaHesaplariStr:", sosyalMedyaHesaplariStr);

    if (sosyalMedyaHesaplariStr) {
      try {
        // String olarak gelen veri, direkt JSON olabilir veya escaped JSON olabilir
        // Önce normal JSON parse deneyelim
        try {
          sosyalMedyaHesaplari = JSON.parse(sosyalMedyaHesaplariStr);
        } catch (firstError) {
          // Eğer başarısız olursa, stringi düzeltip yeniden deneyelim
          try {
            // Çift tırnak içindeki tek tırnakları düzelt
            const cleanedStr = sosyalMedyaHesaplariStr
              .replace(/\\"/g, '"')                  // Escaped çift tırnakları düzelt
              .replace(/^"(.*)"$/, '$1')            // Başta ve sonda çift tırnak varsa kaldır
              .replace(/\\\\"/g, '\\"');            // Escaped ters eğik çizgileri düzelt
            
            sosyalMedyaHesaplari = JSON.parse(cleanedStr);
          } catch (secondError) {
            // Hala başarısız oluyorsa orijinal hatayı göster
            console.error('sosyalMedyaHesaplari parse hatası (ilk deneme):', firstError);
            console.error('sosyalMedyaHesaplari parse hatası (ikinci deneme):', secondError);
            console.error('Parse edilemeyen içerik:', sosyalMedyaHesaplariStr);
          }
        }
        
        console.log("Parse edilen sosyalMedyaHesaplari:", sosyalMedyaHesaplari);
      } catch (error) {
        console.error('sosyalMedyaHesaplari parse hatası (genel):', error);
        console.error('Parse edilemeyen içerik:', sosyalMedyaHesaplariStr);
        sosyalMedyaHesaplari = [];
      }
    }

    // sosyalMedyaHesaplari bir array değilse düzelt
    if (!Array.isArray(sosyalMedyaHesaplari)) {
      console.error('sosyalMedyaHesaplari bir array değil:', typeof sosyalMedyaHesaplari);
      sosyalMedyaHesaplari = [];
    } else {
      // Her bir sosyal medya hesabını kontrol et
      sosyalMedyaHesaplari.forEach((hesap, index) => {
        console.log(`Sosyal medya hesabı ${index}:`, hesap);
        if (hesap && typeof hesap === 'object') {
          console.log(`Platform: ${hesap.platform}, Değer: ${hesap.value}`);
        } else {
          console.warn(`Geçersiz sosyal medya hesabı formatı (index: ${index}):`, hesap);
        }
      });
    }

    const socialMediaData = await processSocialMediaAccounts(formData, sosyalMedyaHesaplari);

    // Banka hesaplarını al
    const bankaHesaplariStr = formData.get('bankaHesaplari') as string;
    const bankaHesaplari = bankaHesaplariStr ? JSON.parse(bankaHesaplariStr) : [];
    console.log("Bank accounts:", bankaHesaplari);

    // Zorunlu alanları kontrol et
    if (!firmaAdi || !slug) {
      return NextResponse.json({ error: 'Firma adı ve slug zorunludur' }, { status: 400 });
    }

    // Slug kontrolü
    const existingFirm = await prisma.firmalar.findUnique({
      where: { slug },
    });

    if (existingFirm) {
      return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 });
    }

    // Dosya yüklemeleri
    let profilePhotoUrl = null;
    let catalogUrl = null;
    let avatarFileName = null;
    let katalogFileName = null;
    let firmLogoFileName = null;

    // Profil fotoğrafı yükleme
    const profilePhoto = formData.get('profilePhoto') as File;
    if (profilePhoto && profilePhoto.size > 0) {
      avatarFileName = await handleFileUpload(profilePhoto, slug);
      console.log("Profile photo uploaded:", avatarFileName);
    }

    // Firma logosu yükleme
    const logoFile = formData.get('logoFile') as File;
    if (logoFile && logoFile.size > 0) {
      firmLogoFileName = await handleFileUpload(logoFile, slug);
      console.log("Firma logosu uploaded:", firmLogoFileName);
    }

    // Katalog yükleme
    const catalog = formData.get('catalog') as File;
    if (catalog && catalog.size > 0) {
      katalogFileName = await handleFileUpload(catalog, slug);
      console.log("Catalog uploaded:", katalogFileName);
    }

    // Form'da social media alanları
    console.log("Social Media alanları işleniyor");

    const bankAccountsJSON = formData.get("bankaHesaplari")?.toString() || "[]";
    
    // Sosyal medya verilerini formData'dan al
    const socialMediaDataJSON = formData.get("social_media_data")?.toString() || "{}";
    console.log("Social Media Data JSON (formData'dan):", socialMediaDataJSON);
    
    // socialMediaData'dan JSON oluştur - doğru format için bu yapıya çevir
    const formattedSocialMediaData = {
      instagramlar: socialMediaData.instagramlar.map(item => ({ url: item.url, label: item.label })),
      youtubelar: socialMediaData.youtubelar.map(item => ({ url: item.url, label: item.label })),
      websiteler: socialMediaData.websiteler.map(item => ({ url: item.url, label: item.label })),
      haritalar: socialMediaData.haritalar.map(item => ({ url: item.url, label: item.label })),
      linkedinler: socialMediaData.linkedinler.map(item => ({ url: item.url, label: item.label })),
      twitterlar: socialMediaData.twitterlar.map(item => ({ url: item.url, label: item.label })),
      facebooklar: socialMediaData.facebooklar.map(item => ({ url: item.url, label: item.label })),
      tiktoklar: socialMediaData.tiktoklar.map(item => ({ url: item.url, label: item.label }))
    };
    
    // Eğer socialMediaDataJSON boş ise formattedSocialMediaData'yı kullan
    const finalSocialMediaJSON = socialMediaDataJSON && socialMediaDataJSON !== "{}" 
      ? socialMediaDataJSON 
      : JSON.stringify(formattedSocialMediaData);
    
    console.log("Final Social Media JSON:", finalSocialMediaJSON);
    console.log("Bank Accounts JSON:", bankAccountsJSON);

    // İşlenen sosyal medya verilerini güvenli şekilde al
    // BU FONKSİYON KULLANILMIYOR GİBİ, ŞİMDİLİK YORUMA ALINABİLİR VEYA KALDIRILABİLİR
    /*
    const getSocialMediaValue = (source: any, field: string) => {
      // ... (fonksiyon içeriği)
    };
    */

    // Veritabanına kaydet (Doğru olan blok bu)
    const newFirm = await prisma.firmalar.create({
      data: {
        firma_adi: firmaAdi || "",
        slug: slug,
        profil_foto: avatarFileName ? `/uploads/${avatarFileName}` : null,
        firma_logo: firmLogoFileName ? `/uploads/${firmLogoFileName}` : null,
        katalog: katalogFileName || null,
        yetkili_adi: yetkili_adi,
        yetkili_pozisyon: yetkili_pozisyon,
        firma_hakkinda: hakkimizda || null,
        firma_unvan: firma_unvan || null,
        firma_vergi_no: firma_vergi_no || null,
        vergi_dairesi: vergi_dairesi || null,
        firma_hakkinda_baslik: firma_hakkinda_baslik || null,
        communication_data: communicationDataJSON, // İşlenmiş iletişim verileri
        bank_accounts: bankAccountsJSON,           // Banka hesapları
        social_media_data: finalSocialMediaJSON,  // İşlenmiş sosyal medya verileri
      },
    });

    console.log("Yeni firma oluşturuldu:", newFirm);

    // En güncel firma verilerini tekrar çek
    const refreshedFirma = await prisma.firmalar.findUnique({
      where: { id: newFirm.id }
    }) as any;
    
    if (!refreshedFirma) {
      throw new Error("Güncel firma verisi bulunamadı");
    }
    
    // HTML ve vCard dosyalarını oluştur
    try {
      await generateHtmlForFirma(refreshedFirma);
      console.log(`HTML oluşturuldu: ${refreshedFirma.slug}`);
      
      // QR kod oluştur
      const qrCodeDataUrl = await generateQRCodeDataUrl(refreshedFirma.slug);
      console.log('QR kod base64 üretildi:', qrCodeDataUrl ? 'OK' : 'HATA');
    } catch (error) {
      console.error('HTML/vCard oluşturulurken hata:', error);
      // HTML oluşturma hatası, firma oluşturma işlemini engellemeyecek
    }
    
    return NextResponse.json({
      message: 'Firma başarıyla oluşturuldu',
      firma: refreshedFirma
    }, { status: 201 });
    
  } catch (error) {
    console.error('Firma oluşturulurken hata oluştu:', error);
    // Hata detaylarını göster
    let errorMessage = 'Firma oluşturulurken bir hata oluştu';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
    }
    
    return NextResponse.json(
      { 
        message: errorMessage, 
        error: error instanceof Error ? error.toString() : 'Bilinmeyen hata',
        details: errorDetails 
      },
      { status: 500 }
    );
  }
}

// Sosyal medya hesaplarını işleyen yardımcı fonksiyon
async function processSocialMediaAccounts(formData: FormData, sosyalMedyaHesaplari: any[] = []): Promise<{ 
  instagramlar: Array<{url: string, label?: string}>, 
  youtubelar: Array<{url: string, label?: string}>, 
  websiteler: Array<{url: string, label?: string}>, 
  haritalar: Array<{url: string, label?: string}>, 
  linkedinler: Array<{url: string, label?: string}>, 
  twitterlar: Array<{url: string, label?: string}>, 
  facebooklar: Array<{url: string, label?: string}>, 
  tiktoklar: Array<{url: string, label?: string}>
}> {
  console.log("=== SOSYAL MEDYA HESAPLARI İŞLENİYOR ===");
  console.log("Form data anahtarları:", Array.from(formData.keys()));
  
  // İşlenmiş sosyalMedyaHesaplari parametresini kontrol et
  if (!sosyalMedyaHesaplari || !Array.isArray(sosyalMedyaHesaplari)) {
    console.error("sosyalMedyaHesaplari tanımlı değil veya bir array değil, boş array kullanılacak");
    sosyalMedyaHesaplari = [];
  }
  
  const formKeys = Array.from(formData.keys());
  
  // Sosyal medya platformları için diziler (artık her biri obje dizisi)
  let instagramlar: Array<{url: string, label?: string}> = [];
  let youtubelar: Array<{url: string, label?: string}> = [];
  let websiteler: Array<{url: string, label?: string}> = [];
  let haritalar: Array<{url: string, label?: string}> = [];
  let linkedinler: Array<{url: string, label?: string}> = [];
  let twitterlar: Array<{url: string, label?: string}> = [];
  let facebooklar: Array<{url: string, label?: string}> = [];
  let tiktoklar: Array<{url: string, label?: string}> = [];
  
  // İletişim formundan gelen websiteler ve haritaları ekle
  if (sosyalMedyaHesaplari && sosyalMedyaHesaplari.length > 0) {
    try {
      console.log('İletişim formundan gelen platform değerleri:', sosyalMedyaHesaplari.map(account => account && account.platform ? account.platform : 'undefined'));
      sosyalMedyaHesaplari.forEach(account => {
        if (account && typeof account === 'object' && account.platform && typeof account.platform === 'string' && account.url && typeof account.url === 'string' && account.url.trim() !== '') {
          const hesapObj = { url: account.url.trim(), label: account.label };
          switch (account.platform.toLowerCase()) {
            case 'instagram': instagramlar.push(hesapObj); break;
            case 'youtube': youtubelar.push(hesapObj); break;
            case 'website': websiteler.push(hesapObj); break;
            case 'harita': haritalar.push(hesapObj); break;
            case 'linkedin': linkedinler.push(hesapObj); break;
            case 'twitter': twitterlar.push(hesapObj); break;
            case 'facebook': facebooklar.push(hesapObj); break;
            case 'tiktok': tiktoklar.push(hesapObj); break;
            default:
              console.warn(`Bilinmeyen platform türü: ${account.platform}`);
          }
        } else {
          console.warn("Geçersiz sosyal medya hesabı formatı: ", account);
        }
      });
    } catch (error) {
      console.error("sosyalMedyaHesaplari işlenirken hata oluştu:", error);
    }
  }
  
  // FormData'dan tüm değerleri doğru şekilde alma
  // 'website' ve 'harita' çıkarıldı, bunlar iletişim bölümünde işleniyor.
  const platformlar = ['instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'tiktok'];
  
  console.log("İşlenecek platformlar (processSocialMediaAccounts):", platformlar);
  
  // Her platform için sosyal medya hesaplarını işleyelim
  platformlar.forEach(platform => {
    try {
      // URL değerlerini toplama (platform[index])
      const urlKeys = formKeys.filter(key => key.startsWith(`${platform}[`) && key.endsWith(']') && !key.includes('label'));
      
      // Her URL için label değerini de bulma girişimi
      urlKeys.forEach(urlKey => {
        const value = formData.get(urlKey)?.toString();
        if (value && value.trim() !== '') {
          // URL'den indeksi çıkar, örn: "instagram[0]" -> "0"
          const indexMatch = urlKey.match(/\[(\d+)\]/);
          if (indexMatch && indexMatch[1]) {
            const index = indexMatch[1];
            
            // Bu indeks için label var mı kontrol et
            const labelKey = `${platform}_label[${index}]`;
            let label = formData.get(labelKey)?.toString() || '';
            
            // Eğer label yoksa veya boşsa undefined olarak bırak
            if (!label || label.trim() === '') {
              label = undefined as any; // tip hatası olmasın diye any olarak dönüştürüyoruz
            }
            
            // Platform tipine göre doğru diziye ekle
            const hesapObj = { url: value.trim(), label };
            switch (platform) {
              case 'instagram': instagramlar.push(hesapObj); break;
              case 'youtube': youtubelar.push(hesapObj); break;
              case 'linkedin': linkedinler.push(hesapObj); break;
              case 'twitter': twitterlar.push(hesapObj); break;
              case 'facebook': facebooklar.push(hesapObj); break;
              case 'tiktok': tiktoklar.push(hesapObj); break;
            }
          }
        }
      });
    } catch (error) {
      console.error(`Platform ${platform} işlenirken hata oluştu:`, error);
    }
  });
  
  // Sosyal Medya hesaplarından gelen değerleri de ekleyelim (sosyalMedyaHesaplari parametresinden)
  console.log("sosyalMedyaHesaplari içeriğini işliyorum:", sosyalMedyaHesaplari);
  
  try {
    // Hatalı yapıdaki sosyal medya hesaplarını filtreleme
    const validAccounts = sosyalMedyaHesaplari.filter(account => 
      account && 
      typeof account === 'object' && 
      account.platform && 
      typeof account.platform === 'string' &&
      account.url && 
      typeof account.url === 'string' &&
      account.url.trim() !== ''
    );
    
    if (validAccounts.length !== sosyalMedyaHesaplari.length) {
      console.warn(`${sosyalMedyaHesaplari.length - validAccounts.length} adet geçersiz sosyal medya hesabı filtrelendi`);
    }
    
    // Geçerli sosyal medya hesaplarını işle
    validAccounts.forEach((account) => {
      try {
        const platform = account.platform.toLowerCase();
        const url = account.url.trim();
        const label = account.label && account.label.trim() !== '' ? account.label.trim() : undefined;
        
        console.log(`JSON'dan işleniyor: Platform: ${platform}, URL: ${url}, Label: ${label || 'yok'}`);
        
        const hesapObj = { url, label };
        // 'website' ve 'harita' case'leri kaldırıldı.
        switch (platform) {
          case 'instagram': instagramlar.push(hesapObj); break;
          case 'youtube': youtubelar.push(hesapObj); break;
          case 'linkedin': linkedinler.push(hesapObj); break;
          case 'twitter': twitterlar.push(hesapObj); break;
          case 'facebook': facebooklar.push(hesapObj); break;
          case 'tiktok': tiktoklar.push(hesapObj); break;
          default:
            // Website ve Harita dışındaki bilinmeyenler için uyar
            if (platform !== 'website' && platform !== 'harita') {
               console.warn(`Bilinmeyen platform türü (processSocialMediaAccounts): ${platform}`);
            }
        }
      } catch (error) {
        console.error("Sosyal medya hesabı işlenirken hata oluştu:", error);
      }
    });
    
    // Instagram ve YouTube kullanıcı adı/URL düzenlemeleri
    instagramlar = instagramlar.map(item => {
      try {
        const url = item.url.replace(/^@/, ''); // @ işaretini kaldır
        // instagram.com/ veya instagram.com/p/ gibi URL parçalarını temizle
        const match = url.match(/(?:instagram\.com\/)?(?:p\/)?([^/?]+)/i);
        return { 
          url: match ? match[1] : url, 
          label: item.label 
        };
      } catch (error) {
        console.error("Instagram URL'i işlenirken hata oluştu:", error);
        return item;
      }
    });
    
    youtubelar = youtubelar.map(item => {
      try {
        let url = item.url;
        // URL'yi temizleme işlemi
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          const match = url.match(/(?:youtube\.com\/(?:user\/|channel\/|c\/)?|youtu\.be\/)([^/?&]+)/i);
          if (match) {
            url = match[1];
          }
        }
        return { 
          url, 
          label: item.label 
        };
      } catch (error) {
        console.error("YouTube URL'i işlenirken hata oluştu:", error);
        return item;
      }
    });
    
    // Tekrarlanan URL'leri kaldır (aynı URL'ye sahip hesaplardan sadece bir tane sakla, label'ı olan tercih edilir)
    // Her platform için ayrı ayrı yapmalıyız
    const uniqueByUrl = <T extends { url: string, label?: string }>(array: T[]): T[] => {
      try {
        if (!array || !Array.isArray(array)) {
          console.error("uniqueByUrl: Array tanımlı değil veya array formatında değil");
          return [];
        }
        
        const seen = new Map<string, T>();
        
        // Önce label'lı olanları işle, sonra diğerlerini
        const sorted = [...array].sort((a, b) => ((b.label ? 1 : 0) - (a.label ? 1 : 0)));
        
        for (const item of sorted) {
          if (!seen.has(item.url)) {
            seen.set(item.url, item);
          }
        }
        
        return Array.from(seen.values());
      } catch (error) {
        console.error("uniqueByUrl işlemi sırasında hata oluştu:", error);
        return array || [];
      }
    };
    
    instagramlar = uniqueByUrl(instagramlar);
    youtubelar = uniqueByUrl(youtubelar);
    websiteler = uniqueByUrl(websiteler);
    haritalar = uniqueByUrl(haritalar);
    linkedinler = uniqueByUrl(linkedinler);
    twitterlar = uniqueByUrl(twitterlar);
    facebooklar = uniqueByUrl(facebooklar);
    tiktoklar = uniqueByUrl(tiktoklar);
  } catch (error) {
    console.error("Sosyal medya hesapları işlenirken kritik hata oluştu:", error);
  }
  
  console.log("=== SOSYAL MEDYA HESAPLARI İŞLEME TAMAMLANDI ===");
  console.log("İşlenen sosyal medya hesapları:", {
    instagramlar,
    youtubelar,
    websiteler,
    haritalar,
    linkedinler,
    twitterlar,
    facebooklar,
    tiktoklar
  });
  
  return {
    instagramlar,
    youtubelar,
    websiteler,
    haritalar,
    linkedinler,
    twitterlar,
    facebooklar,
    tiktoklar
  };
}

async function handleFileUpload(file: File, slug: string): Promise<string | null> {
  try {
    // Upload dizini oluştur
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Benzersiz dosya adı oluştur
    const extension = path.extname(file.name);
    const fileName = `${slug}-${Date.now()}${extension}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Dosyayı kaydet
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    
    // Dosya URL'si (web'den erişim için)
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return null;
  }
}

export async function PUT(req: NextRequest) {
  console.log("PUT request received");
  try {
    const formData = await req.formData();
    console.log("Raw form data:", formData);

    // Form verilerini al
    const firmaId = formData.get('firmaId')?.toString() || '';
    const firmaAdi = (formData.get('firmaAdi') || formData.get('firma_adi'))?.toString() || '';
    const slug = formData.get('slug')?.toString() || '';
    const adres = formData.get('adres')?.toString() || '';
    const website = formData.get('website')?.toString() || '';
    const harita = formData.get('harita')?.toString() || '';
    const firma_hakkinda = (formData.get('firma_hakkinda') || formData.get('hakkimizda'))?.toString() || '';
    const firma_hakkinda_baslik = formData.get('firma_hakkinda_baslik')?.toString() || '';
    const firma_unvan = formData.get('firma_unvan')?.toString() || '';
    const firma_vergi_no = formData.get('firma_vergi_no')?.toString() || '';
    const vergi_dairesi = formData.get('vergi_dairesi')?.toString() || '';
    const yetkiliAdi = formData.get('yetkiliAdi')?.toString() || '';
    const yetkiliPozisyon = formData.get('yetkiliPozisyon')?.toString() || '';

    // İletişim hesaplarını al
    const communicationDataStr = formData.get('communication_data') as string;
    let communicationAccounts = [];
    
    if (communicationDataStr) {
      try {
        const parsedData = JSON.parse(communicationDataStr);
        // Eğer JSON array değilse, boş array olarak devam et
        communicationAccounts = Array.isArray(parsedData) ? parsedData : [];
        if (!Array.isArray(parsedData)) {
          console.error("Communication data parse edildi ama bir dizi değil:", typeof parsedData);
        }
        console.log("Communication accounts:", communicationAccounts);
      } catch (error) {
        console.error("Communication data parse error:", error);
        communicationAccounts = []; // Hata durumunda boş dizi
      }
    }

    // İletişim verilerini türlerine göre gruplandır
    const telefonlar = communicationAccounts.filter(acc => acc.type === 'telefon').map(acc => ({ value: acc.value, label: acc.label }));
    const epostalar = communicationAccounts.filter(acc => acc.type === 'eposta').map(acc => ({ value: acc.value, label: acc.label }));
    const whatsapplar = communicationAccounts.filter(acc => acc.type === 'whatsapp').map(acc => ({ value: acc.value, label: acc.label }));
    const telegramlar = communicationAccounts.filter(acc => acc.type === 'telegram').map(acc => ({ value: acc.value, label: acc.label }));
    const haritalar = communicationAccounts.filter(acc => acc.type === 'harita').map(acc => ({ value: acc.value, label: acc.label }));
    const websiteler = communicationAccounts.filter(acc => acc.type === 'website').map(acc => ({ value: acc.value, label: acc.label }));
    
    // İletişim hesaplarından gelen değerleri de ekleyelim
    if (Array.isArray(communicationAccounts)) {
      communicationAccounts.forEach((account: any) => {
        if (account && typeof account === 'object') {
          // account.value veya account.url kontrolü yap (iki format da desteklensin)
          const value = typeof account.value === 'string' ? account.value : 
                        typeof account.url === 'string' ? account.url : null;
                        
          if (value) {
            // Label her zaman bir değer alacak - boş string de olsa
            const label = typeof account.label === 'string' && account.label.trim() !== '' ? 
                         account.label.trim() : '';
            
            // item objesi label zorunlu olarak tanımlandı
            const item = { value, label };
            
            console.log(`İletişim hesabı ekleniyor: ${account.type}, değer: ${value}, etiket: ${label || 'yok'}`);
            
            // Dizileri item ile güncelle - tip tanımlarını dönüştürerek
            if (account.type === 'telefon') telefonlar.push(item);
            else if (account.type === 'eposta') epostalar.push(item);
            else if (account.type === 'whatsapp') whatsapplar.push(item);
            else if (account.type === 'telegram') telegramlar.push(item);
            else if (account.type === 'harita') haritalar.push(item);
            else if (account.type === 'website') websiteler.push(item);
          }
        }
      });
    } else {
      console.error("communicationAccounts bir dizi değil:", typeof communicationAccounts);
    }

    // İletişim verilerini JSON formatına dönüştür
    const communicationData = {
      telefonlar: telefonlar,
      epostalar: epostalar,
      whatsapplar: whatsapplar,
      telegramlar: telegramlar,
      haritalar: haritalar,
      websiteler: websiteler
    };
    
    const communicationDataJSON = JSON.stringify(communicationData);
    console.log("Güncellenen Communication Data:", communicationDataJSON);

    // Sosyal medya hesaplarını işleyen yardımcı fonksiyon
    const sosyalMedyaHesaplariStr = formData.get('sosyalMedyaHesaplari') as string;
    let sosyalMedyaHesaplari = [];
    
    console.log("Sosyal medya hesapları işleniyor (PUT)");
    console.log("Raw sosyalMedyaHesaplariStr:", sosyalMedyaHesaplariStr);
    
    if (sosyalMedyaHesaplariStr) {
      try {
        // String olarak gelen veri, direkt JSON olabilir veya escaped JSON olabilir
        // Önce normal JSON parse deneyelim
        try {
          sosyalMedyaHesaplari = JSON.parse(sosyalMedyaHesaplariStr);
        } catch (firstError) {
          // Eğer başarısız olursa, stringi düzeltip yeniden deneyelim
          try {
            // Çift tırnak içindeki tek tırnakları düzelt
            const cleanedStr = sosyalMedyaHesaplariStr
              .replace(/\\"/g, '"')                  // Escaped çift tırnakları düzelt
              .replace(/^"(.*)"$/, '$1')            // Başta ve sonda çift tırnak varsa kaldır
              .replace(/\\\\"/g, '\\"');            // Escaped ters eğik çizgileri düzelt
            
            sosyalMedyaHesaplari = JSON.parse(cleanedStr);
          } catch (secondError) {
            // Hala başarısız oluyorsa orijinal hatayı göster
            console.error('sosyalMedyaHesaplari parse hatası (ilk deneme):', firstError);
            console.error('sosyalMedyaHesaplari parse hatası (ikinci deneme):', secondError);
            console.error('Parse edilemeyen içerik:', sosyalMedyaHesaplariStr);
          }
        }
        
        console.log("Parse edilen sosyalMedyaHesaplari:", sosyalMedyaHesaplari);
      } catch (error) {
        console.error('sosyalMedyaHesaplari parse hatası (genel):', error);
        console.error('Parse edilemeyen içerik:', sosyalMedyaHesaplariStr);
        sosyalMedyaHesaplari = [];
      }
    }
    
    // sosyalMedyaHesaplari bir array değilse düzelt
    if (!Array.isArray(sosyalMedyaHesaplari)) {
      console.error('sosyalMedyaHesaplari bir array değil:', typeof sosyalMedyaHesaplari);
      sosyalMedyaHesaplari = [];
    } else {
      // Her bir sosyal medya hesabını kontrol et
      sosyalMedyaHesaplari.forEach((hesap, index) => {
        console.log(`Sosyal medya hesabı ${index}:`, hesap);
        if (hesap && typeof hesap === 'object') {
          console.log(`Platform: ${hesap.platform}, Değer: ${hesap.value}`);
        } else {
          console.warn(`Geçersiz sosyal medya hesabı formatı (index: ${index}):`, hesap);
        }
      });
    }
    
    const socialMediaData = await processSocialMediaAccounts(formData, sosyalMedyaHesaplari);

    // Zorunlu alanları kontrol et
    if (!firmaId || !firmaAdi || !slug) {
      return NextResponse.json({ error: 'Firma ID, adı ve slug zorunludur' }, { status: 400 });
    }

    // Mevcut firmayı kontrol et
    const existingFirm = await prisma.firmalar.findUnique({
      where: { id: parseInt(firmaId) },
    });

    if (!existingFirm) {
      return NextResponse.json({ error: 'Firma bulunamadı' }, { status: 404 });
    }

    // Slug değiştiyse, yeni slug'ın benzersiz olduğunu kontrol et
    if (slug !== existingFirm.slug) {
      const slugExists = await prisma.firmalar.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 });
      }
    }

    // Dosya yüklemeleri
    let avatarFileName = existingFirm.profil_foto;
    let katalogFileName = existingFirm.katalog;
    let firmLogoFileName = existingFirm.firma_logo;

    // Profil fotoğrafı yükleme
    const profilePhoto = formData.get('profilePhoto') as File;
    if (profilePhoto && profilePhoto.size > 0) {
      avatarFileName = await handleFileUpload(profilePhoto, slug);
      console.log("Profile photo uploaded:", avatarFileName);
    }

    // Firma logosu yükleme
    const logoFile = formData.get('logoFile') as File;
    if (logoFile && logoFile.size > 0) {
      firmLogoFileName = await handleFileUpload(logoFile, slug);
      console.log("Firma logosu uploaded:", firmLogoFileName);
    }

    // Katalog yükleme
    const catalog = formData.get('catalog') as File;
    if (catalog && catalog.size > 0) {
      katalogFileName = await handleFileUpload(catalog, slug);
      console.log("Catalog uploaded:", katalogFileName);
    }

    // Form'da social media alanları
    console.log("Social Media alanları işleniyor");

    const bankAccountsJSON = formData.get("bankaHesaplari")?.toString() || "[]";
    
    // Sosyal medya verilerini formData'dan al
    const socialMediaDataJSON = formData.get("social_media_data")?.toString() || "{}";
    console.log("Social Media Data JSON (formData'dan):", socialMediaDataJSON);
    
    // socialMediaData'dan JSON oluştur - doğru format için bu yapıya çevir
    const formattedSocialMediaData = {
      instagramlar: socialMediaData.instagramlar.map(item => ({ url: item.url, label: item.label })),
      youtubelar: socialMediaData.youtubelar.map(item => ({ url: item.url, label: item.label })),
      websiteler: socialMediaData.websiteler.map(item => ({ url: item.url, label: item.label })),
      haritalar: socialMediaData.haritalar.map(item => ({ url: item.url, label: item.label })),
      linkedinler: socialMediaData.linkedinler.map(item => ({ url: item.url, label: item.label })),
      twitterlar: socialMediaData.twitterlar.map(item => ({ url: item.url, label: item.label })),
      facebooklar: socialMediaData.facebooklar.map(item => ({ url: item.url, label: item.label })),
      tiktoklar: socialMediaData.tiktoklar.map(item => ({ url: item.url, label: item.label }))
    };
    
    // Eğer socialMediaDataJSON boş ise formattedSocialMediaData'yı kullan
    const finalSocialMediaJSON = socialMediaDataJSON && socialMediaDataJSON !== "{}" 
      ? socialMediaDataJSON 
      : JSON.stringify(formattedSocialMediaData);
    
    console.log("Final Social Media JSON:", finalSocialMediaJSON);
    console.log("Bank Accounts JSON:", bankAccountsJSON);

    // Parsedlanan sosyal medya verilerini hazırla
    let parsedSocialMediaJSON: SocialMediaData = {
      instagramlar: [],
      youtubelar: [],
      websiteler: [],
      haritalar: [],
      linkedinler: [],
      twitterlar: [],
      facebooklar: [],
      tiktoklar: []
    };
    
    try {
      const parsed = JSON.parse(finalSocialMediaJSON);
      console.log("Parsed social media JSON:", parsed);
      
      if (parsed) {
        // Var olan tüm alanları kontrol ederek kopyala
        if (parsed.instagramlar && Array.isArray(parsed.instagramlar)) parsedSocialMediaJSON.instagramlar = parsed.instagramlar;
        if (parsed.youtubelar && Array.isArray(parsed.youtubelar)) parsedSocialMediaJSON.youtubelar = parsed.youtubelar;
        if (parsed.websiteler && Array.isArray(parsed.websiteler)) parsedSocialMediaJSON.websiteler = parsed.websiteler;
        if (parsed.haritalar && Array.isArray(parsed.haritalar)) parsedSocialMediaJSON.haritalar = parsed.haritalar;
        if (parsed.linkedinler && Array.isArray(parsed.linkedinler)) parsedSocialMediaJSON.linkedinler = parsed.linkedinler;
        if (parsed.twitterlar && Array.isArray(parsed.twitterlar)) parsedSocialMediaJSON.twitterlar = parsed.twitterlar;
        if (parsed.facebooklar && Array.isArray(parsed.facebooklar)) parsedSocialMediaJSON.facebooklar = parsed.facebooklar;
        if (parsed.tiktoklar && Array.isArray(parsed.tiktoklar)) parsedSocialMediaJSON.tiktoklar = parsed.tiktoklar;
      }
    } catch (error) {
      console.error("JSON parse hatası (finalSocialMediaJSON):", error);
    }

    // Firmayı güncelle
    const updatedFirm = await prisma.firmalar.update({
      where: { id: parseInt(firmaId) },
      data: {
        firma_adi: firmaAdi,
        slug: slug,
        telefon: telefonlar.length > 0 ? telefonlar[0].value : null,
        eposta: epostalar.length > 0 ? epostalar[0].value : null,
        whatsapp: whatsapplar.length > 0 ? whatsapplar[0].value : null,
        telegram: telegramlar.length > 0 ? telegramlar[0].value : null,
        profil_foto: avatarFileName ? `/uploads/${avatarFileName}` : null,
        firma_logo: firmLogoFileName ? `/uploads/${firmLogoFileName}` : null,
        katalog: katalogFileName,
        yetkili_adi: yetkiliAdi || null,
        yetkili_pozisyon: yetkiliPozisyon || null,
        firma_hakkinda: firma_hakkinda || null,
        firma_unvan: firma_unvan || null,
        firma_vergi_no: firma_vergi_no || null,
        vergi_dairesi: vergi_dairesi || null,
        updated_at: new Date(),
        firma_hakkinda_baslik: firma_hakkinda_baslik || null,
        communication_data: communicationDataJSON,
        bank_accounts: bankAccountsJSON,
        social_media_data: finalSocialMediaJSON,
        
        // Sosyal medya alanlarını güncelle - güçlendirilmiş kontroller
        instagram: parsedSocialMediaJSON && parsedSocialMediaJSON.instagramlar && Array.isArray(parsedSocialMediaJSON.instagramlar) && parsedSocialMediaJSON.instagramlar.length > 0 ? parsedSocialMediaJSON.instagramlar[0].url : null,
        youtube: parsedSocialMediaJSON && parsedSocialMediaJSON.youtubelar && Array.isArray(parsedSocialMediaJSON.youtubelar) && parsedSocialMediaJSON.youtubelar.length > 0 ? parsedSocialMediaJSON.youtubelar[0].url : null,
        website: parsedSocialMediaJSON && parsedSocialMediaJSON.websiteler && Array.isArray(parsedSocialMediaJSON.websiteler) && parsedSocialMediaJSON.websiteler.length > 0 ? parsedSocialMediaJSON.websiteler[0].url : null,
        harita: parsedSocialMediaJSON && parsedSocialMediaJSON.haritalar && Array.isArray(parsedSocialMediaJSON.haritalar) && parsedSocialMediaJSON.haritalar.length > 0 ? parsedSocialMediaJSON.haritalar[0].url : null,
        linkedin: parsedSocialMediaJSON && parsedSocialMediaJSON.linkedinler && Array.isArray(parsedSocialMediaJSON.linkedinler) && parsedSocialMediaJSON.linkedinler.length > 0 ? parsedSocialMediaJSON.linkedinler[0].url : null,
        twitter: parsedSocialMediaJSON && parsedSocialMediaJSON.twitterlar && Array.isArray(parsedSocialMediaJSON.twitterlar) && parsedSocialMediaJSON.twitterlar.length > 0 ? parsedSocialMediaJSON.twitterlar[0].url : null,
        facebook: parsedSocialMediaJSON && parsedSocialMediaJSON.facebooklar && Array.isArray(parsedSocialMediaJSON.facebooklar) && parsedSocialMediaJSON.facebooklar.length > 0 ? parsedSocialMediaJSON.facebooklar[0].url : null,
        tiktok: parsedSocialMediaJSON && parsedSocialMediaJSON.tiktoklar && Array.isArray(parsedSocialMediaJSON.tiktoklar) && parsedSocialMediaJSON.tiktoklar.length > 0 ? parsedSocialMediaJSON.tiktoklar[0].url : null,
      },
    });

    console.log("Firma güncellendi:", updatedFirm);
    
    // En güncel firma verilerini tekrar çek
    const refreshedFirma = await prisma.firmalar.findUnique({
      where: { id: updatedFirm.id }
    }) as any;
    
    if (!refreshedFirma) {
      throw new Error("Güncel firma verisi bulunamadı");
    }
    
    // HTML ve vCard dosyalarını güncelle
    try {
      await generateHtmlForFirma(refreshedFirma);
      console.log(`HTML oluşturuldu: ${refreshedFirma.slug}`);
      
      // QR kod güncelle (eğer slug değiştiyse)
      if (slug !== existingFirm.slug) {
        const qrCodeDataUrl = await generateQRCodeDataUrl(refreshedFirma.slug);
        console.log('QR kod base64 güncellendi:', qrCodeDataUrl ? 'OK' : 'HATA');
      }
    } catch (error) {
      console.error('HTML/vCard güncellenirken hata:', error);
      // HTML oluşturma hatası, firma güncelleme işlemini engellemeyecek
    }
    
    return NextResponse.json({
      message: 'Firma başarıyla güncellendi',
      firma: refreshedFirma
    });
    
  } catch (error) {
    console.error('Firma güncellenirken hata oluştu:', error);
    // Hata detaylarını göster
    let errorMessage = 'Firma güncellenirken bir hata oluştu';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
    }
    
    return NextResponse.json(
      { 
        message: errorMessage, 
        error: error instanceof Error ? error.toString() : 'Bilinmeyen hata',
        details: errorDetails 
      },
      { status: 500 }
    );
  }
}