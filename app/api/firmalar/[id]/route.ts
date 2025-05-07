import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import { generateHtmlForFirma } from '@/app/lib/htmlGenerator';
import { generateVCard, VCardData } from '@/app/lib/vcardGenerator';
import * as fs from 'fs';
import * as path from 'path';
import { parseForm, processImages } from '@/app/lib/multerHelper';
import { generateQRCodeDataUrl } from '@/lib/qrCodeGenerator';

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
  console.log("PUT [id] request received, Firma ID:", params.id);
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 });
  }

  let data: Record<string, any> = {};
  let isFormData = false;

  try {
    // Önce FormData olarak parse etmeyi dene
    try {
      const formData = await request.formData();
      isFormData = true;
      for (const [key, value] of formData.entries()) {
        if (!(value instanceof File)) {
          data[key] = value;
        }
      }
      console.log("FormData başarıyla ayrıştırıldı:", Object.keys(data));
    } catch (formError) {
      // FormData ayrıştırılamazsa JSON olarak dene
      try {
        data = await request.json();
        console.log("JSON body başarıyla ayrıştırıldı:", Object.keys(data));
      } catch (jsonError) {
        console.error("PUT [id] istek gövdesi ayrıştırılamadı:", formError, jsonError);
        return NextResponse.json({ 
          error: 'İstek gövdesi ayrıştırılamadı',
          details: {
            formError: formError instanceof Error ? formError.message : String(formError),
            jsonError: jsonError instanceof Error ? jsonError.message : String(jsonError)
          }
        }, { status: 400 });
      }
    }

    // Mevcut firmayı sorgula
    const existingFirma = await prisma.firmalar.findUnique({ where: { id } });
    if (!existingFirma) {
      return NextResponse.json({ error: 'Firma bulunamadı' }, { status: 404 });
    }

    // Slug değişikliği kontrolü
    const oldSlug = existingFirma.slug;
    const newSlug = data.slug || oldSlug;

    // Firmayı güncelle
    const updatedFirma = await prisma.firmalar.update({
      where: { id },
      data: {
        firma_adi: data.firma_adi || data.firmaAdi || existingFirma.firma_adi,
        slug: newSlug,
        yetkili_adi: data.yetkili_adi || data.yetkiliAdi || existingFirma.yetkili_adi,
        yetkili_pozisyon: data.yetkili_pozisyon || data.yetkiliPozisyon || existingFirma.yetkili_pozisyon,
        firma_hakkinda: data.firma_hakkinda || existingFirma.firma_hakkinda,
        firma_hakkinda_baslik: data.firma_hakkinda_baslik || existingFirma.firma_hakkinda_baslik,
        firma_unvan: data.firma_unvan || existingFirma.firma_unvan,
        firma_vergi_no: data.firma_vergi_no || existingFirma.firma_vergi_no,
        vergi_dairesi: data.vergi_dairesi || existingFirma.vergi_dairesi,
        updated_at: new Date(),
        communication_data: data.communication_data || existingFirma.communication_data,
        social_media_data: data.social_media_data || existingFirma.social_media_data,
        bank_accounts: data.bank_accounts || existingFirma.bank_accounts
      }
    });

    console.log("Firma veritabanı güncellendi:", updatedFirma.id);

    // HTML yeniden oluşturmayı dene (isteğe bağlı)
    try {
      if (typeof generateHtmlForFirma === 'function') {
        await generateHtmlForFirma(updatedFirma, oldSlug !== newSlug ? oldSlug : undefined);
        console.log(`HTML yeniden oluşturuldu: ${updatedFirma.slug}`);
      }
    } catch (htmlError) {
      console.error('HTML oluşturma hatası:', htmlError);
    }

    return NextResponse.json(updatedFirma);
  } catch (error) {
    console.error('PUT [id] genel hata:', error);
    return NextResponse.json({ error: 'Firma güncellenirken beklenmeyen bir hata oluştu', details: String(error) }, { status: 500 });
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
    // Serverless ortamda dosya sistemi işlemleri kaldırıldı
    // Sadece veritabanı kaydı siliniyor
    
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