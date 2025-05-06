import { notFound } from 'next/navigation'
import prisma from '@/app/lib/db'
import { Metadata } from 'next'

// Dinamik metadatayı oluşturan fonksiyon
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  
  try {
    // Firmayı veritabanından getir
    const firma = await prisma.firmalar.findFirst({
      where: {
        slug: slug
      }
    })

    if (!firma) {
      return {
        title: "Firma Bulunamadı"
      }
    }

    // Firma adını title olarak ayarla
    return {
      title: `${firma.firma_adi}`,
    }
  } catch (error) {
    console.error(`[${slug}] Metadata oluşturma hatası:`, error)
    return {
      title: "Sanal Kartvizit"
    }
  }
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    // Firmayı veritabanından getir
    const firma = await prisma.firmalar.findFirst({
      where: {
        slug: slug
      }
    })

    if (!firma) {
      console.error(`Firma bulunamadı: ${slug}`)
      notFound()
    }

    // HTML dosyasını kontrol et
    const fs = require('fs')
    const path = require('path')
    const htmlFilePath = path.join(process.cwd(), 'public', slug, 'index.html')
    console.log(`[${slug}] HTML dosya yolu: ${htmlFilePath}`)

    if (!fs.existsSync(htmlFilePath)) {
      console.error(`HTML dosyası bulunamadı: ${htmlFilePath}`)
      notFound()
    }

    // HTML içeriğini oku
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8')
    console.log(`[${slug}] HTML içeriği okundu, uzunluk: ${htmlContent.length}`)
    
    // HTML içindeki title etiketini kaldır (Next.js metadata ile title ekleneceği için)
    htmlContent = htmlContent.replace(/<title>[^<]*<\/title>/g, '')

    // HTML içeriğini düzenle
    try {
      // Önce HTML'deki tüm mevcut sosyal medya ve iletişim ikonlarını temizle
      const cleanHtml = () => {
        // İçiçe geçmiş container'ları temizle
        const nestedContainerRegex = /<div class="container"[^>]*id="icons-container"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g
        let cleanedHtml = htmlContent.replace(nestedContainerRegex, '')
        
        // Bireysel sosyal medya ve iletişim ikonlarını temizle 
        const iconRegex = /<div class="col-3 icon">\s*<a href="[^"]+" (?:target="_blank" )?class="d-flex flex-column align-items-center text-decoration-none">\s*<img src="\/img\/(instagram|facebook|twitter|linkedin|youtube|tiktok|web|adres|tel|mail|wp|telegram)\.png"[^>]*>[\s\S]*?<\/a>\s*<\/div>/g
        cleanedHtml = cleanedHtml.replace(iconRegex, '')
        
        return cleanedHtml
      }
      
      // HTML içeriğini temizle
      htmlContent = cleanHtml()
      
      // İkon oluşturmak için gerekli verileri hazırla
      interface Icon {
        type: string;
        url: string;
        label: string;
        icon: string;
      }
      
      let allIcons: Icon[] = []
      
      // 1. Sosyal medya verilerini işle
      if (firma.social_media_data) {
        try {
          const socialMediaData = JSON.parse(firma.social_media_data)
          
          // Benzersiz platform:url çiftlerini kontrol etmek için Set kullan
          const uniquePlatformUrls = new Set<string>()
          
          // Sosyal medya platformları ve ikonları
          const socialPlatforms = [
            { type: 'instagram', icon: '/img/instagram.png', data: socialMediaData.instagramlar || [] },
            { type: 'youtube', icon: '/img/youtube.png', data: socialMediaData.youtubelar || [] },
            { type: 'linkedin', icon: '/img/linkedin.png', data: socialMediaData.linkedinler || [] },
            { type: 'twitter', icon: '/img/twitter.png', data: socialMediaData.twitterlar || [] },
            { type: 'facebook', icon: '/img/facebook.png', data: socialMediaData.facebooklar || [] },
            { type: 'tiktok', icon: '/img/tiktok.png', data: socialMediaData.tiktoklar || [] },
            { type: 'website', icon: '/img/web.png', data: socialMediaData.websiteler || [] },
            { type: 'harita', icon: '/img/adres.png', data: socialMediaData.haritalar || [] }
          ]
          
          // Her platform için ikonları ekle
          socialPlatforms.forEach(platform => {
            if (platform.data && Array.isArray(platform.data) && platform.data.length > 0) {
              platform.data.forEach((item: any) => {
                // URL bilgisini al
                const url = typeof item === 'object' ? item.url : item
                if (!url || url.trim() === '') return
                
                // URL'yi normalize et
                const normalizedUrl = url.trim().toLowerCase()
                
                // Platform ve URL çifti olarak benzersizliği kontrol et
                const uniqueKey = `${platform.type}:${normalizedUrl}`
                if (!uniquePlatformUrls.has(uniqueKey)) {
                  uniquePlatformUrls.add(uniqueKey)
                  
                  // URL formatını düzenle
                  let fullUrl = url
                  if (platform.type === 'instagram' && !url.startsWith('http')) {
                    fullUrl = `https://instagram.com/${url}`
                  } else if (platform.type === 'youtube' && !url.startsWith('http')) {
                    fullUrl = `https://youtube.com/${url}`
                  } else if (platform.type === 'linkedin' && !url.startsWith('http')) {
                    fullUrl = `https://linkedin.com/in/${url}`
                  } else if (platform.type === 'twitter' && !url.startsWith('http')) {
                    fullUrl = `https://twitter.com/${url}`
                  } else if (platform.type === 'facebook' && !url.startsWith('http')) {
                    fullUrl = `https://facebook.com/${url}`
                  } else if (platform.type === 'tiktok' && !url.startsWith('http')) {
                    fullUrl = `https://tiktok.com/@${url}`
                  } else if (platform.type === 'website' && !url.startsWith('http')) {
                    fullUrl = `https://${url}`
                  } else if (platform.type === 'harita' && !url.startsWith('http')) {
                    fullUrl = `https://maps.google.com/maps?q=${encodeURIComponent(url)}`
                  }
                  
                  // İkon adını al
                  const platformName = platform.type.charAt(0).toUpperCase() + platform.type.slice(1)
                  const label = (item.label && typeof item === 'object') ? item.label : platformName
                  
                  // İkonu ekle
                  allIcons.push({
                    type: platform.type,
                    url: fullUrl,
                    label: label,
                    icon: platform.icon
                  })
                  
                  console.log(`[${slug}] ${platform.type} ikonu eklendi: ${url} -> ${fullUrl}`)
                } else {
                  console.log(`[${slug}] Tekrarlanan platform/URL atlandı: ${platform.type} -> ${url}`)
                }
              })
            }
          })
        } catch (e) {
          console.error(`[${slug}] Sosyal medya verileri işlenirken hata:`, e)
        }
      }
      
      // 2. İletişim verilerini işle
      if (firma.communication_data) {
        try {
          const communicationData = JSON.parse(firma.communication_data)
          console.log(`[${slug}] İletişim verileri:`, communicationData)
          
          // Benzersiz değerleri kontrol etmek için Set kullan
          const uniqueValues = new Set<string>()
          
          // İletişim türlerini ve ikonlarını tanımla
          const contactTypes = [
            { type: 'telefon', icon: '/img/tel.png', data: communicationData.telefonlar || [] },
            { type: 'eposta', icon: '/img/mail.png', data: communicationData.epostalar || [] },
            { type: 'whatsapp', icon: '/img/wp.png', data: communicationData.whatsapplar || [] },
            { type: 'telegram', icon: '/img/telegram.png', data: communicationData.telegramlar || [] },
            { type: 'website', icon: '/img/web.png', data: communicationData.websiteler || [] },
            { type: 'harita', icon: '/img/adres.png', data: communicationData.haritalar || [] }
          ]
          
          // Her iletişim türü için ikonları ekle
          contactTypes.forEach(contactType => {
            console.log(`[${slug}] İşleniyor: ${contactType.type}, veri:`, contactType.data)
            if (contactType.data && Array.isArray(contactType.data) && contactType.data.length > 0) {
              contactType.data.forEach((item: any) => {
                // Değer bilgisini al
                const value = typeof item === 'object' ? item.value : item
                if (!value || value.trim() === '') return
                
                // Değeri normalize et
                const normalizedValue = value.trim().toLowerCase()
                
                // Daha önce eklenmemişse ekle (WhatsApp hariç)
                const shouldCheckUniqueness = contactType.type !== 'whatsapp';
                if (!shouldCheckUniqueness || !uniqueValues.has(normalizedValue)) {
                  // WhatsApp değilse veya benzersizse ekle
                  if (shouldCheckUniqueness) {
                  uniqueValues.add(normalizedValue)
                  }
                  
                  // URL formatını düzenle
                  let href = value
                  if (contactType.type === 'telefon') {
                    href = `tel:${value}`
                  } else if (contactType.type === 'eposta') {
                    href = `mailto:${value}`
                  } else if (contactType.type === 'whatsapp') {
                    // WhatsApp için rakam olmayan karakterleri temizleyip doğru formatta bağlantı oluştur
                    const cleanNumber = value.replace(/[^0-9]/g, '')
                    href = `https://wa.me/${cleanNumber}`
                    console.log(`[${slug}] WhatsApp numarası düzenlendi: ${value} -> ${href} -> ikon: ${contactType.icon}`)
                  } else if (contactType.type === 'telegram') {
                    href = `https://t.me/${value}`
                  } else if (contactType.type === 'website' && !value.startsWith('http')) {
                    href = `https://${value}`
                  } else if (contactType.type === 'harita' && !value.startsWith('http')) {
                    href = `https://maps.google.com/maps?q=${encodeURIComponent(value)}`
                  }
                  
                  // İkon adını al
                  const typeName = contactType.type.charAt(0).toUpperCase() + contactType.type.slice(1)
                  const label = (item.label && typeof item === 'object') ? item.label : typeName
                  
                  // İkonu ekle
                  allIcons.push({
                    type: contactType.type,
                    url: href,
                    label: label,
                    icon: contactType.icon
                  })
                  
                  console.log(`[${slug}] ${contactType.type} ikonu eklendi: ${value} -> ${href}`)
                } else {
                  console.log(`[${slug}] Tekrarlanan iletişim bilgisi atlandı: ${value}`)
                }
              })
            }
          })
        } catch (e) {
          console.error(`[${slug}] İletişim verileri işlenirken hata:`, e)
        }
      }
      
      // İkonlar HTML'ini oluştur
      let iconsHtml = ''
      allIcons.forEach(icon => {
        iconsHtml += `
          <div class="col-3 icon">
            <a href="${icon.url}" target="_blank" class="d-flex flex-column align-items-center text-decoration-none">
              <img src="${icon.icon}" alt="${icon.label}">
              <span class="mt-1 text-center small icon-label">${icon.label}</span>
            </a>
          </div>
        `
      })
      
      // İkonları HTML'e ekle
      const markerComment = '<!-- SİSTEM TARAFINDAN EKLENEN İKONLAR BURAYA GELECEK -->'
      if (htmlContent.includes(markerComment)) {
        htmlContent = htmlContent.replace(markerComment, iconsHtml)
        console.log(`[${slug}] İkonlar işaretçi yorum yöntemiyle eklendi. Toplam ${allIcons.length} ikon.`)
      } else {
        // İşaretçi yorum bulunamazsa, icons-container'ı bul ve içine ekle
        const iconContainerRegex = /<div[^>]*id="icons-container"[^>]*>/i
        const match = htmlContent.match(iconContainerRegex)
        
        if (match && match.index !== undefined) {
          // Container'ın hemen ardına ikonları ekle
          const index = match.index + match[0].length
          const updatedHtml = htmlContent.substring(0, index) + iconsHtml + htmlContent.substring(index)
          htmlContent = updatedHtml
          console.log(`[${slug}] İkonlar alternatif yöntemle eklendi. Toplam ${allIcons.length} ikon.`)
        } else {
          console.log(`[${slug}] Hiçbir icons-container div'i bulunamadı. İkonlar eklenemedi.`)
        }
      }
      
      // Banka görsellerini düzelt
      const missingBankImagesRegex = /src="\/img\/banks\/([^"]+)"/g
      htmlContent = htmlContent.replace(missingBankImagesRegex, 'src="/img/banks/ziraat.png" onerror="this.src=\'/img/iban.png\'"')
      
      // Görüntülenme sayısını artır
      try {
        await prisma.firmalar.update({
          where: { id: firma.id },
          data: {
            goruntulenme: {
              increment: 1
            }
          }
        })
        console.log(`[${slug}] Görüntülenme sayısı artırıldı`)
      } catch (e) {
        console.error(`[${slug}] Görüntülenme sayısı güncelleme hatası:`, e)
      }
      
      // HTML içeriğini döndür
      return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )
    } catch (error) {
      console.error(`[${slug}] HTML düzenleme hatası:`, error)
      // Hata olsa bile orijinal HTML'i göster
      return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )
    }
  } catch (error) {
    console.error(`[${slug}] Genel hata:`, error)
    notFound()
  }
}