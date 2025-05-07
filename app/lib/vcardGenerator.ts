export interface VCardData {
  firma_adi: string;
  telefon?: string | string[];
  eposta?: string | string[];
  website?: string | string[];
  instagram?: string | string[];
  youtube?: string | string[];
  linkedin?: string | string[];
  twitter?: string | string[];
  facebook?: string | string[];
  tiktok?: string | string[];
  slug: string;
  communication_data?: string | null; // İletişim bilgilerini içeren JSON
  social_media_data?: string | null; // Sosyal medya bilgilerini içeren JSON
  yetkili_adi?: string;
}

/**
 * vCard dosyası oluşturur
 */
export async function generateVCard(data: VCardData): Promise<string> {
  try {
    // Firma adını temizleme (dosya adı için)
    const safeFileName = data.firma_adi
      .replace(/[^\w\sığüşöçİĞÜŞÖÇ]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    // İletişim verilerini hazırla
    let telefonlar: string[] = [];
    let epostalar: string[] = [];
    let telegramlar: string[] = [];
    let instagramlar: string[] = [];
    let youtubelar: string[] = [];
    let linkedinler: string[] = [];
    let twitterlar: string[] = [];
    let facebooklar: string[] = [];
    let tiktoklar: string[] = [];
    let websiteler: string[] = Array.isArray(data.website) ? data.website : (data.website ? [data.website] : []);
    
    // Doğrudan gelen telefon ve eposta verilerini ekle
    if (data.telefon) {
      telefonlar = Array.isArray(data.telefon) ? data.telefon : [data.telefon];
    }
    
    if (data.eposta) {
      epostalar = Array.isArray(data.eposta) ? data.eposta : [data.eposta];
    }
    
    // Doğrudan gelen sosyal medya verilerini ekle
    if (data.instagram) {
      instagramlar = Array.isArray(data.instagram) ? data.instagram : [data.instagram];
    }
    
    if (data.youtube) {
      youtubelar = Array.isArray(data.youtube) ? data.youtube : [data.youtube];
    }
    
    if (data.linkedin) {
      linkedinler = Array.isArray(data.linkedin) ? data.linkedin : [data.linkedin];
    }
    
    if (data.twitter) {
      twitterlar = Array.isArray(data.twitter) ? data.twitter : [data.twitter];
    }
    
    if (data.facebook) {
      facebooklar = Array.isArray(data.facebook) ? data.facebook : [data.facebook];
    }
    
    if (data.tiktok) {
      tiktoklar = Array.isArray(data.tiktok) ? data.tiktok : [data.tiktok];
    }
    
    // communication_data'dan gelen verileri ekle (varsa)
    if (data.communication_data) {
      try {
        const commData = JSON.parse(data.communication_data);
        // Telefonları ekle
        if (commData.telefonlar && Array.isArray(commData.telefonlar)) {
          telefonlar = [...telefonlar, ...commData.telefonlar];
        }
        
        // E-postaları ekle
        if (commData.epostalar && Array.isArray(commData.epostalar)) {
          epostalar = [...epostalar, ...commData.epostalar];
        }
        
        // Telegramları ekle
        if (commData.telegramlar && Array.isArray(commData.telegramlar)) {
          telegramlar = [...telegramlar, ...commData.telegramlar];
        }
        
        // Benzersiz değerleri al
        telefonlar = [...new Set(telefonlar)];
        epostalar = [...new Set(epostalar)];
        telegramlar = [...new Set(telegramlar)];
      } catch (e) {
        console.error('İletişim verileri parse edilirken hata:', e);
      }
    }
    
    // social_media_data'dan gelen verileri ekle (varsa)
    if (data.social_media_data) {
      try {
        const socialData = JSON.parse(data.social_media_data);
        
        // Instagram hesaplarını ekle
        if (socialData.instagramlar && Array.isArray(socialData.instagramlar)) {
          instagramlar = [...instagramlar, ...socialData.instagramlar];
        }
        
        // YouTube hesaplarını ekle
        if (socialData.youtubelar && Array.isArray(socialData.youtubelar)) {
          youtubelar = [...youtubelar, ...socialData.youtubelar];
        }
        
        // LinkedIn hesaplarını ekle
        if (socialData.linkedinler && Array.isArray(socialData.linkedinler)) {
          linkedinler = [...linkedinler, ...socialData.linkedinler];
        }
        
        // Twitter hesaplarını ekle
        if (socialData.twitterlar && Array.isArray(socialData.twitterlar)) {
          twitterlar = [...twitterlar, ...socialData.twitterlar];
        }
        
        // Facebook hesaplarını ekle
        if (socialData.facebooklar && Array.isArray(socialData.facebooklar)) {
          facebooklar = [...facebooklar, ...socialData.facebooklar];
        }
        
        // TikTok hesaplarını ekle
        if (socialData.tiktoklar && Array.isArray(socialData.tiktoklar)) {
          tiktoklar = [...tiktoklar, ...socialData.tiktoklar];
        }
        
        // Web sitelerini ekle (eğer social_media_data içinde de varsa)
        if (socialData.websiteler && Array.isArray(socialData.websiteler)) {
          websiteler = [...websiteler, ...socialData.websiteler];
        }
        
        // Benzersiz değerleri al
        instagramlar = [...new Set(instagramlar)];
        youtubelar = [...new Set(youtubelar)];
        linkedinler = [...new Set(linkedinler)];
        twitterlar = [...new Set(twitterlar)];
        facebooklar = [...new Set(facebooklar)];
        tiktoklar = [...new Set(tiktoklar)];
        websiteler = [...new Set(websiteler)];
      } catch (e) {
        console.error('Sosyal medya verileri parse edilirken hata:', e);
      }
    }
    
    // vCard içeriği oluştur
    let vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${data.yetkili_adi ? data.yetkili_adi : data.firma_adi}
`;

    // Telefon numaralarını ekle
    telefonlar.forEach((tel, index) => {
      // Nesne kontrolü
      let telValue = '';
      if (typeof tel === 'object' && tel !== null) {
        telValue = (tel as any).value || (tel as any).tel || (tel as any).telefon || '';
      } else {
        telValue = String(tel || '');
      }
      
      // Geçerli bir telefon numarası varsa ekle
      if (telValue.trim()) {
        vCardContent += `TEL;TYPE=WORK,VOICE:${telValue}\n`;
      }
    });
    
    // E-posta adreslerini ekle 
    epostalar.forEach((mail, index) => {
      // Nesne kontrolü
      let mailValue = '';
      if (typeof mail === 'object' && mail !== null) {
        mailValue = (mail as any).value || (mail as any).mail || (mail as any).eposta || '';
      } else {
        mailValue = String(mail || '');
      }
      
      // Geçerli bir e-posta adresi varsa ekle
      if (mailValue.trim()) {
        vCardContent += `EMAIL;TYPE=WORK:${mailValue}\n`;
      }
    });
    
    // Telegram hesaplarını ekle
    telegramlar.forEach((username, index) => {
      try {
        if (username && typeof username === 'string') {
          vCardContent += `X-SOCIALPROFILE;TYPE=telegram;x-user=${username}:https://t.me/${username}\n`;
        } else if (username && typeof username === 'object' && username !== null) {
          vCardContent += `X-SOCIALPROFILE;TYPE=telegram;x-user=${(username as any).value}:https://t.me/${(username as any).value}\n`;
        }
      } catch (error) {
        console.error('Telegram hesabı işlenirken hata:', error);
      }
    });
    
    // Instagram hesaplarını ekle
    instagramlar.forEach((username, index) => {
      try {
        let cleanUsername = '';
        if (username && typeof username === 'string') {
          cleanUsername = username.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/.*$/, '').replace(/^@/, '');
        } else if (username && typeof username === 'object' && username !== null) {
          cleanUsername = ((username as any).url || '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/.*$/, '').replace(/^@/, '');
        }
        
        if (cleanUsername) {
          vCardContent += `X-SOCIALPROFILE;TYPE=instagram;x-user=${cleanUsername}:https://www.instagram.com/${cleanUsername}/\n`;
        }
      } catch (error) {
        console.error('Instagram hesabı işlenirken hata:', error);
      }
    });
    
    // YouTube hesaplarını ekle
    youtubelar.forEach((channel, index) => {
      try {
        let cleanChannel = '';
        let originalChannel = '';
        
        if (channel && typeof channel === 'string') {
          cleanChannel = channel.replace(/^https?:\/\/(www\.)?youtube\.com\//i, '');
          originalChannel = channel;
        } else if (channel && typeof channel === 'object' && channel !== null) {
          cleanChannel = ((channel as any).url || '').replace(/^https?:\/\/(www\.)?youtube\.com\//i, '');
          originalChannel = (channel as any).url || '';
        }
        
        if (cleanChannel) {
          vCardContent += `X-SOCIALPROFILE;TYPE=youtube;x-user=${cleanChannel}:${originalChannel}\n`;
        }
      } catch (error) {
        console.error('YouTube kanalı işlenirken hata:', error);
      }
    });
    
    // LinkedIn hesaplarını ekle
    linkedinler.forEach((profile, index) => {
      try {
        let cleanProfile = '';
        let originalProfile = '';
        
        if (profile && typeof profile === 'string') {
          cleanProfile = profile.replace(/^https?:\/\/(www\.)?linkedin\.com\//i, '');
          originalProfile = profile;
        } else if (profile && typeof profile === 'object' && profile !== null) {
          cleanProfile = ((profile as any).url || '').replace(/^https?:\/\/(www\.)?linkedin\.com\//i, '');
          originalProfile = (profile as any).url || '';
        }
        
        if (cleanProfile) {
          vCardContent += `X-SOCIALPROFILE;TYPE=linkedin;x-user=${cleanProfile}:${originalProfile}\n`;
        }
      } catch (error) {
        console.error('LinkedIn profili işlenirken hata:', error);
      }
    });
    
    // Twitter hesaplarını ekle
    twitterlar.forEach((username, index) => {
      try {
        let cleanUsername = '';
        
        if (username && typeof username === 'string') {
          cleanUsername = username.replace(/^https?:\/\/(www\.)?twitter\.com\//i, '').replace(/^@/, '');
        } else if (username && typeof username === 'object' && username !== null) {
          cleanUsername = ((username as any).url || '').replace(/^https?:\/\/(www\.)?twitter\.com\//i, '').replace(/^@/, '');
        }
        
        if (cleanUsername) {
          vCardContent += `X-SOCIALPROFILE;TYPE=twitter;x-user=${cleanUsername}:https://twitter.com/${cleanUsername}\n`;
        }
      } catch (error) {
        console.error('Twitter hesabı işlenirken hata:', error);
      }
    });
    
    // Facebook hesaplarını ekle
    facebooklar.forEach((profile, index) => {
      try {
        let cleanProfile = '';
        let originalProfile = '';
        
        if (profile && typeof profile === 'string') {
          cleanProfile = profile.replace(/^https?:\/\/(www\.)?facebook\.com\//i, '');
          originalProfile = profile;
        } else if (profile && typeof profile === 'object' && profile !== null) {
          cleanProfile = ((profile as any).url || '').replace(/^https?:\/\/(www\.)?facebook\.com\//i, '');
          originalProfile = (profile as any).url || '';
        }
        
        if (cleanProfile) {
          vCardContent += `X-SOCIALPROFILE;TYPE=facebook;x-user=${cleanProfile}:${originalProfile}\n`;
        }
      } catch (error) {
        console.error('Facebook profili işlenirken hata:', error);
      }
    });
    
    // TikTok hesaplarını ekle
    tiktoklar.forEach((username, index) => {
      try {
        let cleanUsername = '';
        
        if (username && typeof username === 'string') {
          cleanUsername = username.replace(/^https?:\/\/(www\.)?tiktok\.com\//i, '').replace(/^@/, '');
        } else if (username && typeof username === 'object' && username !== null) {
          cleanUsername = ((username as any).url || '').replace(/^https?:\/\/(www\.)?tiktok\.com\//i, '').replace(/^@/, '');
        }
        
        if (cleanUsername) {
          vCardContent += `X-SOCIALPROFILE;TYPE=tiktok;x-user=${cleanUsername}:https://tiktok.com/@${cleanUsername}\n`;
        }
      } catch (error) {
        console.error('TikTok hesabı işlenirken hata:', error);
      }
    });
    
    // Web sitelerini ekle
    websiteler.forEach((web, index) => {
      // Nesne kontrolü
      let webValue = '';
      if (typeof web === 'object' && web !== null) {
        webValue = (web as any).url || (web as any).value || (web as any).website || '';
      } else {
        webValue = String(web || '');
      }
      
      // Gerekli temizlemeyi yap
      webValue = webValue.replace(/[\[\]"{}']/g, '');
      
      // Geçerli bir web adresi varsa ekle
      if (webValue.trim()) {
        vCardContent += `URL:${webValue}\n`;
      }
    });
    
    // vCard'ı tamamla
    vCardContent += 'END:VCARD';

    return vCardContent;
  } catch (error) {
    console.error('vCard dosyası oluşturulurken hata:', error);
    return '';
  }
} 