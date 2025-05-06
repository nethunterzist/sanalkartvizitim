import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { generateHtmlForFirma } from '@/app/lib/htmlGenerator';
import { generateVCard, VCardData } from '@/app/lib/vcardGenerator';
import * as fs from 'fs';
import * as path from 'path';
import { parseForm, processImages } from '@/app/lib/multerHelper';
import { generateQRCode } from '@/lib/qrCodeGenerator';

// SocialMediaData interface tanımı eklendi
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

// DB sorgu sonucu için tip tanımlaması
interface DBFirma {
  id: number;
  firma_adi: string;
  slug: string;
  telefon?: string | null;
  eposta?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  website?: string | null;
  harita?: string | null;
  profil_foto?: string | null;
  firma_logo?: string | null;
  yetkili_adi?: string | null;
  yetkili_pozisyon?: string | null;
  vcard_dosya?: string | null;
  katalog?: string | null;
  created_at?: string;
  updated_at?: string;
  goruntulenme?: number;
  firma_hakkinda?: string | null;
  firma_hakkinda_baslik?: string | null;
  [key: string]: any;
}

/**
 * Belirli bir firmanın verilerini getir
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Geçersiz firma ID' },
        { status: 400 }
      );
    }
    
    // Görüntüleme sayacını artır (isteğe bağlı)
    const headers = new Headers(req.headers);
    const incrementView = headers.get('X-Increment-View') === 'true';
    
    if (incrementView) {
      console.log(`Görüntülenme sayacı artırılıyor - Firma ID: ${id}`);
      
      try {
        await prisma.firmalar.update({
          where: { id },
          data: { goruntulenme: { increment: 1 } }
        });
        
        console.log('Görüntülenme sayacı artırıldı');
      } catch (error) {
        console.error('Görüntülenme sayacı artırılırken hata:', error);
      }
    }
    
    // Firmayı getir
    const firma = await prisma.firmalar.findUnique({
      where: { id }
    });
    
    if (!firma) {
      return NextResponse.json(
        { message: 'Firma bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ firma });
  } catch (error) {
    console.error('Firma getirilirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'Firma getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

/**
 * Belirli bir firmayı güncelle
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`[API] PUT /api/firmalar/${params.id} isteği alındı`);
  
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Geçersiz Firma ID' }, { status: 400 });
    }

    const formData = await request.formData();
    console.log("Form verileri alındı, işleniyor...");
    const formKeys = Array.from(formData.keys());
    console.log("Form alanları:", formKeys.join(", "));
    
    // Firma kontrolü
    const existingFirma = await prisma.firmalar.findUnique({
      where: { id: id }
    });
    
    if (!existingFirma) {
      console.error(`ID ${id} olan firma bulunamadı`);
      return NextResponse.json({ message: 'Firma bulunamadı' }, { status: 404 });
    }
    
    // --- İletişim Verilerini İşleme (POST'a benzer şekilde) ---
    let telefonlar: Array<{value: string, label?: string}> = [];
    let epostalar: Array<{value: string, label?: string}> = [];
    let whatsapplar: Array<{value: string, label?: string}> = [];
    let telegramlar: Array<{value: string, label?: string}> = [];
    let haritalar: Array<{value: string, label?: string}> = [];
    let websiteler: Array<{value: string, label?: string}> = [];

    ['telefon', 'eposta', 'whatsapp', 'telegram', 'harita', 'website'].forEach(type => {
      formKeys.filter(key => key.startsWith(`${type}[`)).forEach(key => {
        const value = formData.get(key)?.toString();
        const indexMatch = key.match(/\[(\d+)\]/);
        const index = indexMatch ? indexMatch[1] : null;
        const labelKey = index ? `${type}_label[${index}]` : null;
        const label = labelKey ? formData.get(labelKey)?.toString() : null;

        if (value) {
          const item: {value: string, label?: string} = { value };
          if (label && label.trim() !== '') {
            item.label = label.trim();
          }
          if (type === 'telefon') telefonlar.push(item);
          else if (type === 'eposta') epostalar.push(item);
          else if (type === 'whatsapp') whatsapplar.push(item);
          else if (type === 'telegram') telegramlar.push(item);
          else if (type === 'harita') haritalar.push(item);
          else if (type === 'website') websiteler.push(item);
        }
      });
    });

    const uniqueItems = <T extends { value: string, label?: string }>(array: T[]): Array<T> => {
        if (!array || !Array.isArray(array)) return [];
        const seenValues = new Map<string, T>();
        array.forEach(item => {
            if (item && item.value) {
                const normalizedValue = item.value.toLowerCase().trim();
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
    telegramlar = telegramlar.map(item => ({ ...item, value: item.value.replace(/^@/, '') }));

    const communicationData = { telefonlar, epostalar, whatsapplar, telegramlar, haritalar, websiteler };
    const communicationDataJSON = JSON.stringify(communicationData);
    console.log("İşlenmiş İletişim Verileri (PUT):", communicationDataJSON);

    // --- Sosyal Medya Verilerini İşleme (POST'a benzer şekilde) ---
    const socialMediaData = processSocialMediaAccounts(formData);
    const socialMediaDataJSON = JSON.stringify(socialMediaData);
    console.log("İşlenmiş Sosyal Medya Verileri (PUT):", socialMediaDataJSON);

    // --- Banka Hesapları İşleme --- 
    let bankAccountsJSON = existingFirma.bank_accounts; // Varsayılan olarak mevcut değeri koru
    if (formData.has('bank_accounts')) {
        const bankAccountsData = formData.get('bank_accounts');
        if (bankAccountsData) {
            try {
                // Gelen verinin geçerli bir JSON olduğundan emin olalım
                JSON.parse(bankAccountsData.toString()); 
                bankAccountsJSON = bankAccountsData.toString();
            } catch (error) {
                console.error("Banka hesapları JSON parse hatası (PUT):", error);
                // Hata durumunda mevcut veriyi koru veya null ata, duruma göre karar ver
                // bankAccountsJSON = null; // Veya mevcut değeri koru
            }
        } else {
            // Formdan boş gönderildiyse null yap
            bankAccountsJSON = null;
        }
    } 
    console.log("İşlenmiş Banka Hesapları (PUT):", bankAccountsJSON);

    // --- Dosya İşleme --- (Mevcut dosya silme/güncelleme mantığı korunmalı)
    let profilFotoPath = existingFirma.profil_foto; 
    let katalogPath = existingFirma.katalog;
    let firmaLogoPath = existingFirma.firma_logo;
    const deleteProfilFoto = formData.get('delete_profil_foto') === '1';
    const deleteKatalog = formData.get('delete_katalog') === '1';
    const deleteFirmaLogo = formData.get('delete_firma_logo') === '1';
    const profilFotoFile = formData.get('profilFoto') as File;
    const katalogFile = formData.get('katalog') as File;
    const firmaLogoFile = formData.get('logoFile') as File;

    if (deleteProfilFoto) {
        // Eski dosyayı sil (diskten)
        if (profilFotoPath) { /* ... dosya silme kodu ... */ }
        profilFotoPath = null;
    } else if (profilFotoFile && profilFotoFile.size > 0) {
        // Yeni dosya yüklendiyse eskiyi sil (varsa) ve yeniyi kaydet
        if (profilFotoPath) { /* ... dosya silme kodu ... */ }
        profilFotoPath = await handleFileUpload(profilFotoFile, existingFirma.slug);
    }

    if (deleteKatalog) {
        if (katalogPath) { /* ... dosya silme kodu ... */ }
        katalogPath = null;
    } else if (katalogFile && katalogFile.size > 0) {
        if (katalogPath) { /* ... dosya silme kodu ... */ }
        katalogPath = await handleFileUpload(katalogFile, existingFirma.slug);
    }

    if (deleteFirmaLogo) {
        // Eski dosyayı sil (diskten)
        if (firmaLogoPath) {
            const logoFilePath = path.join(process.cwd(), 'public', firmaLogoPath);
            if (fs.existsSync(logoFilePath)) {
                fs.unlinkSync(logoFilePath);
                console.log(`Firma logosu silindi: ${logoFilePath}`);
            }
        }
        firmaLogoPath = null;
    } else if (firmaLogoFile && firmaLogoFile.size > 0) {
        // Yeni dosya yüklendiyse eskiyi sil (varsa) ve yeniyi kaydet
        if (firmaLogoPath) {
            const logoFilePath = path.join(process.cwd(), 'public', firmaLogoPath);
            if (fs.existsSync(logoFilePath)) {
                fs.unlinkSync(logoFilePath);
                console.log(`Firma logosu silindi: ${logoFilePath}`);
            }
        }
        firmaLogoPath = await handleFileUpload(firmaLogoFile, existingFirma.slug);
    }

    // --- Diğer Alanları Alma --- 
    const firma_adi = formData.get("firma_adi")?.toString() || existingFirma.firma_adi;
    const slug = formData.get("slug")?.toString() || existingFirma.slug;
    const yetkili_adi = formData.get("yetkili_adi")?.toString() || existingFirma.yetkili_adi;
    const yetkili_pozisyon = formData.get("yetkili_pozisyon")?.toString() || existingFirma.yetkili_pozisyon;
    const firma_unvan = formData.get("firma_unvan")?.toString() || existingFirma.firma_unvan;
    const firma_vergi_no = formData.get("firma_vergi_no")?.toString() || existingFirma.firma_vergi_no;
    const vergi_dairesi = formData.get("vergi_dairesi")?.toString() || existingFirma.vergi_dairesi;
    const firma_hakkinda = formData.get("firma_hakkinda")?.toString() || existingFirma.firma_hakkinda;
    const firma_hakkinda_baslik = formData.get("firma_hakkinda_baslik")?.toString() || existingFirma.firma_hakkinda_baslik;

    // Slug kontrolü (aynı slug başka bir firmada var mı)
    if (slug !== existingFirma.slug) {
        const existingSlug = await prisma.firmalar.findFirst({ where: { slug: slug, id: { not: id } } });
        if (existingSlug) {
            return NextResponse.json({ message: 'Bu URL linki zaten kullanılıyor.' }, { status: 400 });
        }
        // Slug değiştiyse, eski dosya/klasörleri yeniden adlandırma/taşıma gerekebilir.
        // Bu kısım implemente edilmeli.
        console.warn("[PUT] Slug değişti, dosya/klasör taşıma implemente edilmedi.");
    }

    // --- Veritabanını Güncelle --- 
    const updateData: Record<string, any> = {
        firma_adi,
        slug,
        yetkili_adi,
        yetkili_pozisyon,
        firma_unvan,
        firma_vergi_no,
        vergi_dairesi,
        firma_hakkinda,
        firma_hakkinda_baslik,
        profil_foto: profilFotoPath,
        firma_logo: firmaLogoPath,
        katalog: katalogPath,
        communication_data: communicationDataJSON,
        social_media_data: socialMediaDataJSON,
        bank_accounts: bankAccountsJSON,
        updated_at: new Date(),
    };

    console.log("Veritabanı Güncelleme Verisi:", updateData);

    const updatedFirm = await prisma.firmalar.update({
        where: { id: id },
        data: updateData,
    });

    console.log("Firma başarıyla güncellendi:", updatedFirm);

    // --- HTML, vCard, QR Güncelleme --- (POST'a benzer)
    // En güncel firma verilerini tekrar çek
    const refreshedFirma = await prisma.firmalar.findUnique({
      where: { id: updatedFirm.id }
    }) as any;
    
    if (!refreshedFirma) {
      throw new Error("Güncel firma verisi bulunamadı (PUT sonrası)");
    }
    
    try {
        const htmlPath = await generateHtmlForFirma(refreshedFirma);
        console.log('HTML dosyası güncellendi:', htmlPath);
        
        // QR kod güncelle (eğer slug değiştiyse)
        if (slug !== existingFirma.slug) {
            const qrCodePath = await generateQRCode(refreshedFirma.slug);
            console.log('QR kod güncellendi:', qrCodePath);
            // Eski QR kod silinebilir.
        }
        
        // vCard güncelle - vcardData dolduruldu
        const vcardData: VCardData = {
            firma_adi: refreshedFirma.firma_adi,
            slug: refreshedFirma.slug,
            // Diğer alanları da refreshedFirma'dan ekle (telefon, eposta vb. null olabilir)
            telefon: refreshedFirma.telefon || undefined,
            eposta: refreshedFirma.eposta || undefined,
            website: refreshedFirma.website || undefined,
            communication_data: refreshedFirma.communication_data || null, // JSON verilerini de gönder
            social_media_data: refreshedFirma.social_media_data || null 
        };
        const vcardPath = await generateVCard(vcardData);
        console.log('vCard dosyası güncellendi:', vcardPath);
    } catch (error) {
        console.error('HTML/vCard/QR güncellenirken hata (PUT):', error);
    }
    
    return NextResponse.json({ message: 'Firma başarıyla güncellendi', firma: refreshedFirma });

  } catch (error) {
    console.error('Firma güncellenirken hata oluştu (PUT):', error);
    let errorMessage = 'Firma güncellenirken bir hata oluştu';
    if (error instanceof Error) { errorMessage = error.message; }
    return NextResponse.json({ message: errorMessage, error: String(error) }, { status: 500 });
  }
}

/**
 * Belirli bir firmayı sil
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'Geçersiz firma ID' },
        { status: 400 }
      );
    }
    
    console.log(`ID ${id} olan firmayı silme isteği alındı`);
    
    // Firma var mı kontrol et
    const firma = await prisma.firmalar.findUnique({
      where: { id }
    });
    
    if (!firma) {
      return NextResponse.json(
        { message: 'Silinecek firma bulunamadı' },
        { status: 404 }
      );
    }
    
    const firmaSlug = firma.slug;
    
    // Veritabanından sil
    await prisma.firmalar.delete({
      where: { id }
    });
    
    // HTML ve diğer dosyaları sil
    try {
      // HTML klasörünü sil
      const htmlDir = path.join(process.cwd(), 'public', firmaSlug);
      if (fs.existsSync(htmlDir)) {
        fs.rmSync(htmlDir, { recursive: true, force: true });
        console.log(`HTML klasörü silindi: ${htmlDir}`);
      }
      
      // QR kod dosyasını sil
      const qrCodePath = path.join(process.cwd(), 'public', 'qrcodes', `${firmaSlug}.png`);
      if (fs.existsSync(qrCodePath)) {
        fs.unlinkSync(qrCodePath);
        console.log(`QR kod dosyası silindi: ${qrCodePath}`);
      }
      
      // Profil fotoğrafını sil
      if (firma.profil_foto) {
        const profilFotoPath = path.join(process.cwd(), 'public', firma.profil_foto);
        if (fs.existsSync(profilFotoPath)) {
          fs.unlinkSync(profilFotoPath);
          console.log(`Profil fotoğrafı silindi: ${profilFotoPath}`);
        }
      }
      
      // Katalog dosyasını sil
      if (firma.katalog) {
        const katalogPath = path.join(process.cwd(), 'public', firma.katalog);
        if (fs.existsSync(katalogPath)) {
          fs.unlinkSync(katalogPath);
          console.log(`Katalog dosyası silindi: ${katalogPath}`);
        }
      }

      // Firma logosunu sil
      if (firma.firma_logo) {
        const firmaLogoPath = path.join(process.cwd(), 'public', firma.firma_logo);
        if (fs.existsSync(firmaLogoPath)) {
          fs.unlinkSync(firmaLogoPath);
          console.log(`Firma logosu silindi: ${firmaLogoPath}`);
        }
      }
    } catch (error) {
      console.error('Dosya silme hatası:', error);
      // Dosya silme hataları silme işlemini engellemez
    }
    
    return NextResponse.json({ 
      message: 'Firma başarıyla silindi', 
      id: id 
    });
    
  } catch (error) {
    console.error('Firma silme hatası:', error);
    return NextResponse.json(
      { message: 'Firma silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

/**
 * Dosya yükleme işlemleri için yardımcı fonksiyon
 */
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

// Çoklu alanları işlemek için yardımcı fonksiyon
function processMultipleFormData(formData: FormData, fieldName: string): string | null {
  // [fieldName][0], [fieldName][1] formatındaki verileri topla
  const values: string[] = [];
  let index = 0;
  let key = `${fieldName}[${index}]`;
  
  // FormData'dan tüm ilgili alanları topla
  while (formData.has(key)) {
    const value = formData.get(key) as string;
    if (value && value.trim()) {
      values.push(value.trim());
    }
    index++;
    key = `${fieldName}[${index}]`;
  }
  
  // Değerler varsa virgülle birleştir, yoksa null döndür
  return values.length > 0 ? values.join(',') : null;
}

// processSocialMediaAccounts fonksiyonu (tip düzeltmesi yapıldı)
const processSocialMediaAccounts = (formData: FormData): SocialMediaData => {
    console.log("=== processSocialMediaAccounts (PUT için güncellenmiş) ===");
    const formKeys = Array.from(formData.keys());
    // SocialMediaData tipinde başlatıldı
    let socialMediaData: SocialMediaData = {
        instagramlar: [], youtubelar: [], websiteler: [], haritalar: [],
        linkedinler: [], twitterlar: [], facebooklar: [], tiktoklar: []
    };

    const platformlar = ['instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'tiktok'];

    platformlar.forEach(platform => {
        formKeys.filter(key => key.startsWith(`${platform}[`)).forEach(key => {
            const value = formData.get(key)?.toString();
            const indexMatch = key.match(/\[(\d+)\]/);
            const index = indexMatch ? indexMatch[1] : null;
            const labelKey = index ? `${platform}_label[${index}]` : null;
            const label = labelKey ? formData.get(labelKey)?.toString() : undefined;

            if (value) {
                const hesapObj = { url: value.trim(), label: label ? label.trim() : undefined };
                // Tip kontrolü güçlendirildi
                const platformKey = (platform + 'lar') as keyof SocialMediaData;
                if (socialMediaData[platformKey]) {
                    (socialMediaData[platformKey] as Array<{url: string, label?: string}>).push(hesapObj);
                }
            }
        });
        // Tekrarları kaldır (her platform için)
        const uniqueUrls = new Map<string, {url: string, label?: string}>();
        const platformKey = (platform + 'lar') as keyof SocialMediaData;
        if (socialMediaData[platformKey]) {
           (socialMediaData[platformKey] as Array<{url: string, label?: string}>).forEach(item => {
              uniqueUrls.set(item.url.toLowerCase().trim(), item);
           });
           socialMediaData[platformKey] = Array.from(uniqueUrls.values());
        }
    });

    // Instagram ve YouTube URL normalleştirmesi (isteğe bağlı)
    // ... (POST'taki gibi eklenebilir)

    return socialMediaData;
}; 