'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { SparklesIcon } from '@heroicons/react/24/solid';

// newBankAccount fonksiyonu: Yeni bir boş banka hesabı objesi oluşturur
const newBankAccount = () => {
  return {
    bank_name: "",
    bank_label: "",
    bank_logo: "",
    account_holder: "",
    accounts: [
      {
        iban: "",
        currency: "TRY"
      }
    ]
  };
};

// Banka listesi sabit verisi
const BANKALAR = [
  { id: "ziraat", label: "Ziraat Bankası", logo: "/img/banks/ziraat.png" },
  { id: "vakifbank", label: "VakıfBank", logo: "/img/banks/vakifbank.png" },
  { id: "halkbank", label: "Halkbank", logo: "/img/banks/halkbank.png" },
  { id: "isbankasi", label: "İş Bankası", logo: "/img/banks/isbankasi.png" },
  { id: "garanti", label: "Garanti BBVA", logo: "/img/banks/garanti.png" },
  { id: "akbank", label: "Akbank", logo: "/img/banks/akbank.png" },
  { id: "yapikredi", label: "Yapı Kredi", logo: "/img/banks/yapikredi.png" },
  { id: "qnb", label: "QNB Finansbank", logo: "/img/banks/qnb.png" },
  { id: "teb", label: "TEB (Türk Ekonomi Bankası)", logo: "/img/banks/teb.png" },
  { id: "kuveytturk", label: "Kuveyt Türk", logo: "/img/banks/kuveytturk.png" },
  { id: "albaraka", label: "Albaraka Türk", logo: "/img/banks/albaraka.png" },
  { id: "turkiyefinans", label: "Türkiye Finans", logo: "/img/banks/turkiyefinans.png" },
  { id: "anadolubank", label: "AnadoluBank", logo: "/img/banks/anadolubank.png" },
  { id: "sekerbank", label: "Şekerbank", logo: "/img/banks/sekerbank.png" },
  { id: "icbc", label: "ICBC Turkey Bank", logo: "/img/banks/icbc.png" },
  { id: "odeabank", label: "Odeabank", logo: "/img/banks/odeabank.png" }
];

interface Firma {
  id: number;
  firma_adi: string;
  slug: string;
  telefon?: string;
  eposta?: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string[];
  youtube?: string[];
  linkedin?: string[];
  twitter?: string[];
  facebook?: string[];
  website?: string[];
  harita?: string[];
  yetkiliAdi?: string;
  yetkiliPozisyon?: string;
  bank_accounts?: BankAccount[];
  katalog?: string;
  firma_hakkinda?: string;
  firma_hakkinda_baslik?: string;
  firma_unvan?: string;
  firma_vergi_no?: string;
  vergi_dairesi?: string;
  created_at: string;
  updated_at: string;
}

interface BankAccount {
  bank_name: string;
  bank_label: string;
  bank_logo: string | null;
  account_holder: string;
  accounts: {
    iban: string;
    currency: string;
  }[];
}

// Sosyal Medya hesapları için arayüz tanımı
interface SocialMediaAccount {
  platform: string;
  url: string;
  type?: 'communication' | 'social' | 'other';
  label?: string; // Özel başlık için yeni alan eklendi
}

// İletişim hesapları için arayüz tanımı
interface CommunicationAccount {
  type: string; // telefon, whatsapp, eposta
  value: string;
  label?: string; // Özel başlık için yeni alan eklendi
}

export default function FirmaDuzenlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [firmaAdi, setFirmaAdi] = useState('');
  const [slug, setSlug] = useState('');
  const [telefon, setTelefon] = useState('');
  const [eposta, setEposta] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState<string[]>(['']);
  const [youtube, setYoutube] = useState<string[]>(['']);
  const [linkedin, setLinkedin] = useState<string[]>(['']);
  const [twitter, setTwitter] = useState<string[]>(['']);
  const [facebook, setFacebook] = useState<string[]>(['']);
  const [website, setWebsite] = useState<string[]>(['']);
  const [harita, setHarita] = useState<string[]>(['']);
  const [tiktoks, setTiktoks] = useState<string[]>(['']);
  const [yetkiliAdi, setYetkiliAdi] = useState('');
  const [yetkiliPozisyon, setYetkiliPozisyon] = useState('');
  const [firmaHakkinda, setFirmaHakkinda] = useState('');
  const [firmaHakkindaBaslik, setFirmaHakkindaBaslik] = useState('Hakkımızda');
  const [firmaUnvan, setFirmaUnvan] = useState('');
  const [firmaVergiNo, setFirmaVergiNo] = useState('');
  const [vergiDairesi, setVergiDairesi] = useState('');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([newBankAccount()]);
  const [profilFoto, setProfilFoto] = useState<File | null>(null);
  const [profilFotoPreview, setProfilFotoPreview] = useState('');
  const [profilFotoSil, setProfilFotoSil] = useState(false);
  const [katalogDosya, setKatalogDosya] = useState<File | null>(null);
  const [katalogDosyaAdi, setKatalogDosyaAdi] = useState('');
  const [katalogSil, setKatalogSil] = useState(false);
  const [firmaLogo, setFirmaLogo] = useState<File | null>(null);
  const [firmaLogoPreview, setFirmaLogoPreview] = useState('');
  const [firmaLogoSil, setFirmaLogoSil] = useState(false);
  const [loading, setLoading] = useState(true); // true çünkü veriler yüklenirken loading olmalı
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);

  // Sosyal medya için state
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<SocialMediaAccount[]>([{
    platform: '',
    url: '', 
    type: undefined
  }]);

  // İletişim hesapları için state
  const [communicationAccounts, setCommunicationAccounts] = useState<CommunicationAccount[]>([{
    type: '',
    value: ''
  }]);

  // Rastgele veri oluşturucu fonksiyonlar
  const generateRandomName = () => {
    const companyPrefixes = ['Mega', 'Ultra', 'Super', 'Pro', 'Global', 'Tech', 'Smart', 'Digital', 'Türk', 'Net', 'Efe', 'Ege', 'Mert', 'Anadolu'];
    const companySuffixes = ['Teknoloji', 'Yazılım', 'Bilişim', 'İnşaat', 'Ticaret', 'Gıda', 'Nakliyat', 'Tekstil', 'Sanayi', 'Turizm', 'Holding', 'Medya', 'Group'];
    return `${companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)]} ${companySuffixes[Math.floor(Math.random() * companySuffixes.length)]}`;
  };
  
  const generateRandomPhone = () => {
    return `05${Math.floor(Math.random() * 5) + 3}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`;
  };
  
  const generateRandomEmail = (companyName: string) => {
    const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'example.com'];
    const simplifiedName = companyName.toLowerCase().replace(/\s+/g, '').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c');
    return `info@${simplifiedName}.com`;
  };
  
  const generateRandomPersonName = () => {
    const firstNames = ['Ali', 'Ayşe', 'Mehmet', 'Fatma', 'Ahmet', 'Zeynep', 'Mustafa', 'Emine', 'İbrahim', 'Hatice', 'Hüseyin', 'Melek', 'İsmail', 'Merve', 'Ömer', 'Elif', 'Murat', 'Sevgi'];
    const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Çetin', 'Koç', 'Arslan', 'Aslan', 'Taş', 'Aksoy', 'Kurt', 'Özdemir', 'Aydın', 'Öztürk'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  };
  
  const generateRandomTitle = () => {
    const titles = ['Genel Müdür', 'CEO', 'Firma Sahibi', 'Yönetici', 'Müdür', 'Satış Müdürü', 'Pazarlama Müdürü', 'İnsan Kaynakları Müdürü', 'Finans Müdürü', 'Teknik Müdür'];
    return titles[Math.floor(Math.random() * titles.length)];
  };
  
  const generateRandomWebsite = (companyName: string) => {
    const simplifiedName = companyName.toLowerCase().replace(/\s+/g, '').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c');
    return `https://www.${simplifiedName}.com`;
  };
  
  const generateRandomSocialMedia = (companyName: string) => {
    const simplifiedName = companyName.toLowerCase().replace(/\s+/g, '').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c');
    return `${simplifiedName}`;
  };
  
  // Formu rastgele verilerle doldur
  const autoFillForm = () => {
    const randomCompanyName = generateRandomName();
    const randomSlug = randomCompanyName.toLowerCase().replace(/\s+/g, '-').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c');
    const randomPersonName = generateRandomPersonName();
    const randomTitle = generateRandomTitle();
    const randomPhone1 = generateRandomPhone();
    const randomPhone2 = generateRandomPhone();
    const randomEmail1 = generateRandomEmail(randomCompanyName);
    const randomEmail2 = `destek@${randomCompanyName.toLowerCase().replace(/\s+/g, '').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c')}.com`;
    const randomWebsite1 = generateRandomWebsite(randomCompanyName);
    const randomWebsite2 = `${generateRandomWebsite(randomCompanyName).replace('.com', '.net')}`;
    const randomInsta1 = generateRandomSocialMedia(randomCompanyName);
    const randomInsta2 = `${randomInsta1}_official`;
    const randomTwitter1 = generateRandomSocialMedia(randomCompanyName);
    const randomTwitter2 = `${randomTwitter1}_tr`;
    const randomFacebook1 = generateRandomSocialMedia(randomCompanyName);
    const randomFacebook2 = `${randomFacebook1}.official`;
    const randomYoutube1 = generateRandomSocialMedia(randomCompanyName);
    const randomYoutube2 = `${randomYoutube1}TV`;
    const randomLinkedin1 = generateRandomSocialMedia(randomCompanyName);
    const randomLinkedin2 = `${randomLinkedin1}-group`;
    const randomTiktok1 = generateRandomSocialMedia(randomCompanyName);
    const randomTiktok2 = `${randomTiktok1}.official`;
    const randomHarita1 = "https://maps.google.com/?q=Istanbul,Turkey";
    const randomHarita2 = "https://maps.google.com/?q=Ankara,Turkey";
    
    // Form alanlarını rastgele değerlerle doldur
    setFirmaAdi(randomCompanyName);
    setSlug(randomSlug);
    setYetkiliAdi(randomPersonName);
    setYetkiliPozisyon(randomTitle);
    
    // İletişim bilgileri - her türden 2'şer tane (telefon, e-posta, whatsapp, telegram, website, harita)
    setCommunicationAccounts([
      { type: 'telefon', value: randomPhone1 },
      { type: 'telefon', value: randomPhone2 },
      { type: 'eposta', value: randomEmail1 },
      { type: 'eposta', value: randomEmail2 },
      { type: 'whatsapp', value: randomPhone1 },
      { type: 'whatsapp', value: randomPhone2 },
      { type: 'telegram', value: `@${randomInsta1}` },
      { type: 'telegram', value: `@${randomInsta2}` },
      { type: 'website', value: randomWebsite1 },
      { type: 'website', value: randomWebsite2 },
      { type: 'harita', value: randomHarita1 },
      { type: 'harita', value: randomHarita2 }
    ]);
    
    // Sosyal medya - her türden 2'şer tane (sadece sosyal medya platformları)
    setSocialMediaAccounts([
      { platform: 'instagram', url: randomInsta1, type: 'social' },
      { platform: 'instagram', url: randomInsta2, type: 'social' },
      { platform: 'facebook', url: randomFacebook1, type: 'social' },
      { platform: 'facebook', url: randomFacebook2, type: 'social' },
      { platform: 'twitter', url: randomTwitter1, type: 'social' },
      { platform: 'twitter', url: randomTwitter2, type: 'social' },
      { platform: 'youtube', url: randomYoutube1, type: 'social' },
      { platform: 'youtube', url: randomYoutube2, type: 'social' },
      { platform: 'linkedin', url: randomLinkedin1, type: 'social' },
      { platform: 'linkedin', url: randomLinkedin2, type: 'social' },
      { platform: 'tiktok', url: randomTiktok1, type: 'social' },
      { platform: 'tiktok', url: randomTiktok2, type: 'social' }
    ]);
    
    // Diğer bilgiler
    setFirmaHakkinda(`${randomCompanyName} olarak müşterilerimize en kaliteli hizmeti sunmak için çalışıyoruz. ${new Date().getFullYear()} yılından bu yana sektörde lider konumdayız.`);
    setFirmaHakkindaBaslik('Hakkımızda');
    setFirmaUnvan(`${randomCompanyName} A.Ş.`);
    setFirmaVergiNo(`${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`);
    setVergiDairesi('Merkez Vergi Dairesi');
    
    // Bankalar listesinden rastgele banka seçimi
    const getRandomBank = () => {
      const randomIndex = Math.floor(Math.random() * BANKALAR.length);
      return BANKALAR[randomIndex];
    };
    
    // İlk rastgele banka
    const randomBank1 = getRandomBank();
    // İkinci rastgele banka (ilkinden farklı olacak şekilde)
    let randomBank2;
    do {
      randomBank2 = getRandomBank();
    } while (randomBank2.id === randomBank1.id);
    
    // Banka hesapları - 2 banka hesabı, her hesapta 3 para birimi
    setBankAccounts([
      {
        bank_name: randomBank1.id,
        bank_label: randomBank1.label,
        bank_logo: randomBank1.logo,
        account_holder: randomCompanyName,
        accounts: [
          { iban: `TR${Math.floor(Math.random() * 100000000000000000000000).toString().padStart(24, '0')}`, currency: 'TRY' },
          { iban: `TR${Math.floor(Math.random() * 100000000000000000000000).toString().padStart(24, '0')}`, currency: 'USD' },
          { iban: `TR${Math.floor(Math.random() * 100000000000000000000000).toString().padStart(24, '0')}`, currency: 'EUR' }
        ]
      },
      {
        bank_name: randomBank2.id,
        bank_label: randomBank2.label,
        bank_logo: randomBank2.logo,
        account_holder: randomCompanyName,
        accounts: [
          { iban: `TR${Math.floor(Math.random() * 100000000000000000000000).toString().padStart(24, '0')}`, currency: 'TRY' },
          { iban: `TR${Math.floor(Math.random() * 100000000000000000000000).toString().padStart(24, '0')}`, currency: 'USD' },
          { iban: `TR${Math.floor(Math.random() * 100000000000000000000000).toString().padStart(24, '0')}`, currency: 'EUR' }
        ]
      }
    ]);
  };

  // Yardımcı fonksiyon - string halindeki JSON verisini parse eder
  const parseJSON = (jsonString: string | null, defaultValue: any) => {
    if (!jsonString || jsonString === "null" || jsonString === "") return defaultValue;
    
    try {
      // String mi kontrol et
      if (typeof jsonString === 'string') {
        return JSON.parse(jsonString);
      } 
      // Zaten obje mi?
      else if (typeof jsonString === 'object') {
        return jsonString;
      }
      return defaultValue;
    } catch (error) {
      console.error("JSON parse hatası:", error, "Veri:", jsonString);
      return defaultValue;
    }
  };

  // Firma bilgilerini getirme işlemi
  useEffect(() => {
    const fetchFirma = async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/firmalar/${params.id}`);
        const data = await response.json();
        
        if (!data?.firma) {
          console.error("Firma bulunamadı!");
          return;
        }

        // Konsola gelen veriyi yazdır
        console.log("API'den gelen firma verisi:", data.firma);
        
        // Ana firma bilgilerini state'e ata
        setFirmaAdi(data.firma.firma_adi || "");
        setSlug(data.firma.slug || "");
        setFirmaHakkinda(data.firma.firma_hakkinda || "");
        setFirmaHakkindaBaslik(data.firma.firma_hakkinda_baslik || "");
        setFirmaUnvan(data.firma.firma_unvan || "");
        setFirmaVergiNo(data.firma.firma_vergi_no || "");
        setVergiDairesi(data.firma.vergi_dairesi || "");
        setYetkiliAdi(data.firma.yetkili_adi || "");
        setYetkiliPozisyon(data.firma.yetkili_pozisyon || "");
        
        // İletişim bilgilerini işle ve state'e ata
        console.log("İletişim verisi (ham):", data.firma.communication_data);
        try {
          const commDataParsed = parseJSON(data.firma.communication_data, {});
          console.log("İletişim verisi parse edildi:", commDataParsed);
          
          const initialCommunicationAccounts: CommunicationAccount[] = [];
          
          // Objeyi döngüyle işle
          if (commDataParsed && typeof commDataParsed === 'object') {
            Object.entries(commDataParsed).forEach(([typeKey, accounts]: [string, any]) => {
              if (Array.isArray(accounts)) {
                accounts.forEach((acc: { value: string, label?: string }) => {
                  const type = typeKey.replace(/lar$/, ''); 
                  if (acc && typeof acc === 'object' && acc.value) {
                    initialCommunicationAccounts.push({ 
                      type: type, 
                      value: acc.value || '', 
                      label: acc.label || '' 
                    });
                  }
                });
              }
            });
          }
          
          // Eğer boşsa, en azından bir tane iletişim hesabı oluştur
          if (initialCommunicationAccounts.length === 0) {
            initialCommunicationAccounts.push({
              type: 'telefon',
              value: '',
              label: ''
            });
          }
          
          setCommunicationAccounts(initialCommunicationAccounts);
          console.log("İletişim hesapları state'e atandı:", initialCommunicationAccounts);
          
        } catch (error) {
          console.error("İletişim bilgileri işlenirken hata oluştu:", error);
          setCommunicationAccounts([{
            type: 'telefon',
            value: '',
            label: ''
          }]); // Hata durumunda en azından bir boş telefon hesabı
        }

        // Sosyal medya hesaplarını işle
        console.log("Sosyal medya verisi (ham):", data.firma.social_media_data);
        try {
          const socialMediaParsed = parseJSON(data.firma.social_media_data, {});
          console.log("Sosyal medya verisi parse edildi:", socialMediaParsed);
          
          const initialSocialMediaAccounts: SocialMediaAccount[] = [];
          
          // Objeyi döngüyle işle ve düzgün platform atama yap
          const platformMapping: {[key: string]: string} = {
            'instagramlar': 'instagram',
            'youtubelar': 'youtube',
            'linkedinler': 'linkedin',
            'twitterlar': 'twitter',
            'facebooklar': 'facebook',
            'tiktoklar': 'tiktok',
            'haritalar': 'harita',
            'websiteler': 'website'
          };
          
          if (socialMediaParsed && typeof socialMediaParsed === 'object') {
            Object.entries(socialMediaParsed).forEach(([platformKey, accounts]: [string, any]) => {
              const platform = platformMapping[platformKey] || platformKey.replace(/lar$/, '');
              
              if (Array.isArray(accounts)) {
                accounts.forEach((acc: { url: string, label?: string }) => {
                  if (acc && typeof acc === 'object' && acc.url) {
                    initialSocialMediaAccounts.push({
                      platform: platform,
                      url: acc.url || '',
                      label: acc.label || '',
                      type: platform === 'harita' || platform === 'website' ? 'other' : 'social'
                    });
                  }
                });
              }
            });
          }
          
          if (initialSocialMediaAccounts.length === 0) {
            // Eğer sosyal medya hesabı yoksa, en azından bir tane boş ekleyelim
            initialSocialMediaAccounts.push({
              platform: 'instagram',
              url: '',
              type: 'social'
            });
          }
          
          setSocialMediaAccounts(initialSocialMediaAccounts);
          console.log("Sosyal medya hesapları state'e atandı:", initialSocialMediaAccounts);
          
        } catch (error) {
          console.error("Sosyal medya bilgileri işlenirken hata oluştu:", error);
          setSocialMediaAccounts([{
            platform: 'instagram',
            url: '',
            type: 'social'
          }]); // Hata durumunda en azından bir boş sosyal medya hesabı
        }

        // Banka hesaplarını işle (varsa)
        console.log("Banka hesapları raw verisi:", data.firma.bank_accounts);
        try {
          let bankAccountsData = parseJSON(data.firma.bank_accounts, [newBankAccount()]);
          
          // Array kontrolü
          if (!Array.isArray(bankAccountsData)) {
            console.warn("Banka hesapları array değil:", bankAccountsData);
            bankAccountsData = [newBankAccount()];
          }
          
          // Boş array kontrolü
          if (bankAccountsData.length === 0) {
            bankAccountsData = [newBankAccount()];
          }
          
          // Her bir hesabın gerekli alanlarını kontrol et
          bankAccountsData = bankAccountsData.map((account: any) => {
            // Validasyon kontrolleri
            if (!account || typeof account !== 'object') {
              return newBankAccount();
            }
            
            // Her hesabın en azından boş bir alt hesabı olsun
            if (!Array.isArray(account.accounts) || account.accounts.length === 0) {
              account.accounts = [{ iban: '', currency: 'TRY' }];
            }
            
            return account;
          });
          
          setBankAccounts(bankAccountsData);
          console.log("Banka hesapları state'e atandı:", bankAccountsData);
        } catch (error) {
          console.error("Banka hesapları işlenirken hata oluştu:", error);
          setBankAccounts([newBankAccount()]); // Hata durumunda yeni boş hesap
        }
        
        // Katalog dosyası varsa, adını ayarla
        if (data.firma.katalog) {
          // Dosya yolundan sadece dosya adını çıkar
          const katalogPath = data.firma.katalog;
          const katalogFileName = katalogPath.split('/').pop() || katalogPath;
          setKatalogDosyaAdi(katalogFileName);
          console.log("Katalog dosya adı:", katalogFileName);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Firma bilgileri yüklenirken bir hata oluştu:", error);
        setError("Firma bilgileri yüklenirken bir hata oluştu!");
        setLoading(false);
      }
    };

    if (id) {
      fetchFirma();
    }
  }, [id]);

  const handleProfilFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilFoto(file);
      setProfilFotoSil(false); // Yeni dosya seçildiğinde silme işaretini kaldır
      
      // Önizleme URL'si oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFirmaLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFirmaLogo(file);
      setFirmaLogoSil(false); // Yeni dosya seçildiğinde silme işaretini kaldır
      
      // Önizleme URL'si oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setFirmaLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKatalogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setKatalogDosya(file);
      setKatalogDosyaAdi(file.name);
      setKatalogSil(false); // Yeni dosya seçildiğinde silme işaretini kaldır
    }
  };

  // Banka hesabı güncelleme fonksiyonu
  const handleBankAccountChange = (index: number, field: keyof Omit<BankAccount, 'accounts'>, value: string) => {
    const updatedAccounts = [...bankAccounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      [field]: value
    };
    
    // Eğer banka seçiliyorsa, ilgili banka bilgilerini de güncelle
    if (field === 'bank_name' && value) {
      const selectedBank = BANKALAR.find(bank => bank.id === value);
      if (selectedBank) {
        updatedAccounts[index].bank_label = selectedBank.label;
        updatedAccounts[index].bank_logo = selectedBank.logo;
      }
    }
    
    setBankAccounts(updatedAccounts);
  };

  // Alt hesap (IBAN ve para birimi) güncelleme fonksiyonu
  const handleSubAccountChange = (accountIndex: number, subAccountIndex: number, field: 'iban' | 'currency', value: string) => {
    const updatedAccounts = [...bankAccounts];
    updatedAccounts[accountIndex].accounts[subAccountIndex] = {
      ...updatedAccounts[accountIndex].accounts[subAccountIndex],
      [field]: value
    };
    setBankAccounts(updatedAccounts);
  };
  
  // Alt hesap ekleme fonksiyonu
  const handleAddSubAccount = (accountIndex: number) => {
    const updatedAccounts = [...bankAccounts];
    updatedAccounts[accountIndex].accounts.push({
      iban: '',
      currency: 'TRY'
    });
    setBankAccounts(updatedAccounts);
  };
  
  // Alt hesap silme fonksiyonu
  const handleRemoveSubAccount = (accountIndex: number, subAccountIndex: number) => {
    if (bankAccounts[accountIndex].accounts.length > 1) {
      const updatedAccounts = [...bankAccounts];
      updatedAccounts[accountIndex].accounts.splice(subAccountIndex, 1);
      setBankAccounts(updatedAccounts);
    }
  };
  
  // Yeni banka hesabı ekleme fonksiyonu
  const handleAddBankAccount = () => {
    setBankAccounts([...bankAccounts, newBankAccount()]);
  };
  
  // Banka hesabı silme fonksiyonu
  const handleRemoveBankAccount = (index: number) => {
    if (bankAccounts.length > 1) {
      const updatedAccounts = [...bankAccounts];
      updatedAccounts.splice(index, 1);
      setBankAccounts(updatedAccounts);
    }
  };

  // Firma bilgileri değişim işleyicisi
  const handleFirmaBilgileriChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFirmaHakkinda(value);
  };

  // Sosyal medya hesabı güncelleme fonksiyonu
  const handleSocialMediaChange = (index: number, field: keyof SocialMediaAccount, value: string) => {
    const updatedAccounts = [...socialMediaAccounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      [field]: value
    };
    
    // Platform değiştiğinde, otomatik olarak type değerini güncelle
    if (field === 'platform') {
      if (['telefon', 'eposta', 'whatsapp', 'telegram'].includes(value)) {
        updatedAccounts[index].type = 'communication';
      } else if (['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok'].includes(value)) {
        updatedAccounts[index].type = 'social';
      } else if (['website', 'harita'].includes(value)) {
        updatedAccounts[index].type = 'other';
      } else {
        updatedAccounts[index].type = undefined;
      }
    }
    
    setSocialMediaAccounts(updatedAccounts);
  };
  
  // Yeni sosyal medya hesabı ekleme fonksiyonu
  const handleAddSocialMedia = () => {
    setSocialMediaAccounts([
      ...socialMediaAccounts,
      {
        platform: '',
        url: '',
        type: undefined
      }
    ]);
  };
  
  // Sosyal medya hesabı silme fonksiyonu
  const handleRemoveSocialMedia = (index: number) => {
    if (socialMediaAccounts.length > 1) {
      const updatedAccounts = [...socialMediaAccounts];
      updatedAccounts.splice(index, 1);
      setSocialMediaAccounts(updatedAccounts);
    }
  };

  // İletişim hesabı güncelleme fonksiyonu  
  const handleCommunicationChange = (index: number, field: 'type' | 'value' | 'label', value: string) => {
    const updatedAccounts = [...communicationAccounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      [field]: value
    };
    setCommunicationAccounts(updatedAccounts);
  };
  
  // Yeni iletişim hesabı ekleme fonksiyonu
  const handleAddCommunication = () => {
    setCommunicationAccounts([
      ...communicationAccounts,
      {
        type: '',
        value: ''
      }
    ]);
  };
  
  // İletişim hesabı silme fonksiyonu
  const handleRemoveCommunication = (index: number) => {
    if (communicationAccounts.length > 1) {
      const updatedAccounts = [...communicationAccounts];
      updatedAccounts.splice(index, 1);
      setCommunicationAccounts(updatedAccounts);
    }
  };

  // Diziye yeni öğe ekleme fonksiyonu (instagram, website gibi dizi alanları için)
  const handleAddInput = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  // Diziden öğe silme fonksiyonu
  const handleRemoveInput = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Dizi elemanlarını güncelleme fonksiyonu
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // SORUN GİDERME FONKSİYONU EKLİYORUM - FORMA YENİ BİR BUTON EKLEYEREK FORMDATA KONTROLÜ YAPACAĞIZ
  const testYetkiliVeUnvan = () => {
    try {
      const testForm = new FormData();
      
      if (yetkiliAdi) {
        testForm.append("yetkili_adi", yetkiliAdi);
        console.log("TEST - Yetkili adı eklendi:", yetkiliAdi);
      }
      
      if (yetkiliPozisyon) {
        testForm.append("yetkili_pozisyon", yetkiliPozisyon);
        console.log("TEST - Yetkili pozisyon eklendi:", yetkiliPozisyon);
      }
      
      if (firmaUnvan) {
        testForm.append("firma_unvan", firmaUnvan);
        console.log("TEST - Firma ünvanı eklendi:", firmaUnvan);
      }
      
      // FormData içeriğini konsola yazdır
      console.log("TEST - Form verileri:");
      for (let [key, value] of testForm.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      // State değerlerini de kontrol et
      console.log("TEST - State değerleri:");
      console.log("yetkiliAdi:", yetkiliAdi);
      console.log("yetkiliPozisyon:", yetkiliPozisyon);
      console.log("firmaUnvan:", firmaUnvan);
      
      // Fetch API ile PUT isteği gönder
      fetch(`/api/firmalar/test-yetkili/${params.id}`, {
        method: 'POST',
        body: JSON.stringify({
          yetkili_adi: yetkiliAdi,
          yetkili_pozisyon: yetkiliPozisyon,
          firma_unvan: firmaUnvan
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log("TEST - API yanıtı:", data);
        setSuccess("Test tamamlandı, konsolu kontrol edin");
      })
      .catch(error => {
        console.error("TEST - Hata:", error);
        setError("Test sırasında hata: " + error.message);
      });
    } catch (err) {
      console.error("TEST - Hata:", err);
      setError("Test sırasında hata: " + String(err));
    }
  };

  // Form gönderme işlemi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Minimum gereksinimler için kontrol
      if (!firmaAdi) {
        throw new Error("Firma adı alanı zorunludur");
      }

      if (!slug) {
        throw new Error("URL (Slug) alanı zorunludur");
      }

      console.log("Form gönderimi başlıyor...");
      
      // Dosya yüklemeleri için formData oluştur
      const formData = new FormData();
      
      // ===== TEMEL BİLGİLER =====
      formData.append("firma_adi", firmaAdi);
      formData.append("slug", slug);
      
      if (yetkiliAdi) {
        formData.append("yetkili_adi", yetkiliAdi);
      }
      
      if (yetkiliPozisyon) {
        formData.append("yetkili_pozisyon", yetkiliPozisyon);
      }
      
      if (firmaHakkinda) {
        formData.append("firma_hakkinda", firmaHakkinda);
      }
      
      if (firmaHakkindaBaslik) {
        formData.append("firma_hakkinda_baslik", firmaHakkindaBaslik);
      }
      
      if (firmaUnvan) {
        formData.append("firma_unvan", firmaUnvan);
      }
      
      if (firmaVergiNo) {
        formData.append("firma_vergi_no", firmaVergiNo);
      }
      
      if (vergiDairesi) {
        formData.append("vergi_dairesi", vergiDairesi);
      }
      
      // ===== SOSYAL MEDYA =====
      // Önce tüm sosyal medya hesaplarını işleyip boş olmayanları konsola yazdıralım
      const filteredSocialMediaAccounts = socialMediaAccounts.filter(acc => acc.platform && acc.url && acc.url.trim() !== '');
      console.log("Güncellenecek sosyal medya hesapları (filtered):", JSON.stringify(filteredSocialMediaAccounts, null, 2));
      
      // Sosyal medya hesaplarını DOĞRU FORMATTA FormData'ya ekleyelim
      filteredSocialMediaAccounts.forEach((account, index) => {
        formData.append(`${account.platform}[${index}]`, account.url);
        if (account.label && account.label.trim() !== '') {
          formData.append(`${account.platform}_label[${index}]`, account.label);
        }
      });
      
      // ===== İLETİŞİM BİLGİLERİ =====
      // Önce tüm iletişim hesaplarını işleyip boş olmayanları hazırla
      const filteredCommunicationAccounts = communicationAccounts.filter(acc => acc.type && acc.value && acc.value.trim() !== '');
      console.log("Güncellenecek iletişim hesapları (filtered):", JSON.stringify(filteredCommunicationAccounts, null, 2));
      
      // İletişim hesaplarını DOĞRU FORMATTA FormData'ya ekleyelim
      filteredCommunicationAccounts.forEach((account, index) => {
        formData.append(`${account.type}[${index}]`, account.value);
        if (account.label && account.label.trim() !== '') {
          formData.append(`${account.type}_label[${index}]`, account.label);
        }
      });
      
      // ===== BANKA HESAPLARI =====
      if (bankAccounts.length > 0) {
        const validBankAccounts = bankAccounts.filter(
          acc => acc.bank_name && acc.account_holder && acc.accounts.some(a => a.iban)
        );
        
        if (validBankAccounts.length > 0) {
          formData.append("bank_accounts", JSON.stringify(validBankAccounts));
          console.log("Banka hesapları eklendi:", validBankAccounts.length);
        }
      }
      
      // ===== DOSYA YÜKLEMELERİ =====
      if (profilFotoSil) {
        formData.append("delete_profil_foto", "1");
      } else if (profilFoto) {
        formData.append("profilFoto", profilFoto);
      }
      
      if (firmaLogoSil) {
        formData.append("delete_firma_logo", "1");
      } else if (firmaLogo) {
        formData.append("logoFile", firmaLogo);
      }
      
      if (katalogSil) {
        formData.append("delete_katalog", "1");
      } else if (katalogDosya) {
        formData.append("katalog", katalogDosya);
      }
      
      // ===== FORM VERİLERİNİ LOGLA =====
      console.log("=== FORM VERİLERİ DETAYLARI ===");
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          console.log(`Form alanı ${key}:`, value.length > 100 ? `${value.substring(0, 100)}...` : value);
        } else {
          console.log(`Form alanı ${key}:`, `[${typeof value}] - ${value instanceof File ? value.name : 'Dosya değil'}`);
        }
      }
      
      // API isteği gönder
      console.log(`API isteği gönderiliyor: PUT /api/firmalar/${params.id}`);
      
      try {
        // Debug için FETCH_DEBUG ekleyelim
        const response = await fetch(`/api/firmalar/${params.id}?FETCH_DEBUG=true`, {
          method: 'PUT',
          body: formData,
        });
        
        console.log("API yanıt durumu:", response.status, response.statusText);
        
        if (!response.ok) {
          let errorMessage = `Firma güncellenirken hata: HTTP ${response.status} ${response.statusText}`;
          
          try {
            // Response'u önce text olarak al
            const responseText = await response.text();
            console.log("Hata yanıtı ham veri:", responseText);
            
            if (responseText && responseText.trim() !== '') {
              try {
                // Text'i JSON olarak parse etmeyi dene
                const errorData = JSON.parse(responseText);
                if (errorData.message) {
                  errorMessage = errorData.message;
                } else if (errorData.error) {
                  errorMessage = errorData.error;
                } else {
                  // JSON içeriğini string olarak göster
                  errorMessage = `API hatası: ${JSON.stringify(errorData)}`;
                }
              } catch (jsonError) {
                console.error("Hata yanıtı JSON parse hatası:", jsonError);
                // JSON parse edilemezse, text'i doğrudan hata mesajı olarak kullan
                if (responseText.length < 500) {  // Çok uzun değilse
                  errorMessage = `API yanıtı: ${responseText}`;
                }
              }
            }
          } catch (textError) {
            console.error("Hata yanıtı alınamadı:", textError);
          }
          
          throw new Error(errorMessage);
        }
        
        // Başarılı yanıtı işle
        let data;
        try {
          // JSON yerine Text olarak alalım
          const responseText = await response.text();
          console.log("API Başarılı yanıt ham verisi:", responseText);
          
          if (!responseText || responseText.trim() === '') {
            console.warn("API'den boş yanıt geldi, başarılı kabul ediliyor");
            data = { success: true, message: "İşlem başarılı fakat yanıt boş" };
          } else {
            try {
              data = JSON.parse(responseText);
              console.log("API Yanıtı (parse edilmiş):", data);
              
              // Güncellenmiş firma verisini kontrol et
              if (data.firma) {
                console.log("Güncellenmiş firma verileri:", {
                  instagram: data.firma.instagram,
                  facebook: data.firma.facebook,
                  twitter: data.firma.twitter,
                  linkedin: data.firma.linkedin,
                  youtube: data.firma.youtube,
                  telefon: data.firma.telefon,
                  eposta: data.firma.eposta,
                  whatsapp: data.firma.whatsapp,
                  telegram: data.firma.telegram,
                });
              }
            } catch (jsonError) {
              console.error("Başarılı yanıt JSON parse hatası:", jsonError);
              // JSON parse edilemezse, yine de başarılı kabul et
              data = { success: true, message: "İşlem başarılı fakat yanıt ayrıştırılamadı" };
            }
          }
        } catch (textError) {
          console.error("Yanıt metni alınamadı:", textError);
          data = { success: true, message: "İşlem başarılı gibi görünüyor" };
        }
        
        // Başarı mesajını göster
        setSuccess(data.message || "Firma başarıyla güncellendi!");
        
        // Başarılı yanıt sonrası 2 saniye bekle ve yönlendir
        setTimeout(() => {
          router.push('/admin/firmalar');
        }, 2000);
      } catch (err: any) {
        console.error("Form gönderim hatası:", err);
        setError(err.message || "Firma güncellenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Form gönderim hatası:", err);
      setError(err.message || "Firma güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Slugify: Firma adını URL-uyumlu hale getirir
  const slugify = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/â/g, 'a')
      .replace(/ê/g, 'e')
      .replace(/î/g, 'i')
      .replace(/ô/g, 'o')
      .replace(/û/g, 'u')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Firma adı değiştiğinde slugı da otomatik olarak güncelle
  const handleFirmaAdiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirmaAdi(value);
    // Sadece slug boşsa veya daha önce değiştirilmemişse otomatik güncelle
    if (!slug) {
      setSlug(slugify(value));
    }
  };

  // Yeni boş iletişim hesabı ekleme
  const addEmptyCommunicationAccount = () => {
    handleAddCommunication();
  };

  // İletişim hesabı türü değiştiğinde
  const handleCommunicationAccountTypeChange = (index: number, newType: string) => {
    const updatedAccounts = [...communicationAccounts];
    updatedAccounts[index].type = newType;
    setCommunicationAccounts(updatedAccounts);
  };

  // İletişim hesabı değeri değiştiğinde
  const handleCommunicationAccountValueChange = (index: number, newValue: string) => {
    const updatedAccounts = [...communicationAccounts];
    updatedAccounts[index].value = newValue;
    setCommunicationAccounts(updatedAccounts);
  };

  // İletişim hesabı silme
  const removeCommunicationAccount = (index: number) => {
    if (communicationAccounts.length > 1) {
      const updatedAccounts = [...communicationAccounts];
      updatedAccounts.splice(index, 1);
      setCommunicationAccounts(updatedAccounts);
    }
  };

  // Eğer veriler yükleniyorsa yükleniyor göster
  if (loading && !error && !success) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-3 text-gray-700">Firma bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 flex-shrink-0 flex flex-col">
        <div className="px-4 py-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Yönetim Paneli</h2>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Genel Bakış
          </Link>
          
          <Link
            href="/admin/firmalar"
            className="flex items-center px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            Firmalar
          </Link>
          
          <Link
            href="/admin/firmalar/yeni"
            className="flex items-center px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Yeni Firma Ekle
          </Link>
          
          {/* HTML Şablonu bağlantısını kaldırıyorum */}
        </nav>
      </div>
        
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow flex-shrink-0">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Firma Düzenle: {firmaAdi}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hoş geldiniz, Admin
              </span>
              
              {/* Otomatik Doldur Butonu */}
              <button
                type="button"
                onClick={autoFillForm}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <SparklesIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Otomatik Doldur
              </button>
              
              <Link 
                href="/login"
                className="text-sm text-red-600 hover:text-red-800 hover:underline focus:outline-none"
              >
                Çıkış Yap
              </Link>
            </div>
          </div>
        </header>
        
        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-5xl mx-auto">
            <form 
              onSubmit={(e) => {
                // Form varsayılan submit davranışını engelle
                e.preventDefault();
                // Son sekmedeyse manuel olarak submit et
                if (selectedTab === 3 || selectedTab === 4) {
                  handleSubmit(e);
                }
              }} 
              className="bg-white shadow-md rounded-lg p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-3">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 rounded-md p-3">
                  {success}
                </div>
              )}

              <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                <Tab.List className="flex p-1 space-x-1 rounded-xl bg-blue-50">
                  <Tab
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm font-medium rounded-lg leading-5 
                      ${selected 
                        ? 'bg-green-600 text-white shadow' 
                        : 'text-gray-700 hover:bg-white/[0.12] hover:text-green-700'}`
                    }
                  >
                    🟢 Firma Bilgileri
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm font-medium rounded-lg leading-5 
                      ${selected 
                        ? 'bg-indigo-600 text-white shadow' 
                        : 'text-gray-700 hover:bg-white/[0.12] hover:text-indigo-700'}`
                    }
                  >
                    🟣 Kurumsal Bilgiler
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm font-medium rounded-lg leading-5 
                      ${selected 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-700'}`
                    }
                  >
                    🔵 Sosyal Medya
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm font-medium rounded-lg leading-5 
                      ${selected 
                        ? 'bg-purple-600 text-white shadow' 
                        : 'text-gray-700 hover:bg-white/[0.12] hover:text-purple-700'}`
                    }
                  >
                    🟣 İletişim
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      `w-full py-2.5 text-sm font-medium rounded-lg leading-5 
                      ${selected 
                        ? 'bg-yellow-600 text-white shadow' 
                        : 'text-gray-700 hover:bg-white/[0.12] hover:text-yellow-700'}`
                    }
                  >
                    🟡 Banka Hesapları
                  </Tab>
                </Tab.List>
                
                <Tab.Panels className="mt-6 overflow-visible">
                  {/* Tab 1: Firma Bilgileri */}
                  <Tab.Panel className="space-y-6 rounded-xl p-3 bg-white">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="firmaAdi" className="block text-sm font-medium text-gray-700">
                          Firma Adı *
                        </label>
                        <input
                          type="text"
                          id="firmaAdi"
                          required
                          value={firmaAdi}
                          onChange={handleFirmaAdiChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                        <p className="mt-1 text-xs text-red-500">Bu alan zorunludur</p>
                      </div>
                      
                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                          URL (Slug) *
                        </label>
                        <input
                          type="text"
                          id="slug"
                          required
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                        <p className="mt-1 text-xs text-red-500">Bu alan zorunludur</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="yetkiliAdi" className="block text-sm font-medium text-gray-700">
                          Yetkili Adı Soyadı
                        </label>
                        <input
                          type="text"
                          id="yetkiliAdi"
                          value={yetkiliAdi}
                          onChange={(e) => setYetkiliAdi(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          placeholder="Furkan Yiğit"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="yetkiliPozisyon" className="block text-sm font-medium text-gray-700">
                          Pozisyon
                        </label>
                        <input
                          type="text"
                          id="yetkiliPozisyon"
                          value={yetkiliPozisyon}
                          onChange={(e) => setYetkiliPozisyon(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          placeholder="Genel Müdür"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="profilFoto" className="block text-sm font-medium text-gray-700">
                          Profil Fotoğrafı
                        </label>
                        <div className="mt-1 flex items-center">
                          {profilFotoPreview ? (
                            <div className="relative mr-4">
                              <img 
                                src={profilFotoPreview} 
                                alt="Profil önizleme" 
                                className="h-32 w-32 object-cover rounded-full border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setProfilFoto(null);
                                  setProfilFotoPreview("");
                                  setProfilFotoSil(true);
                                }}
                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                              <svg
                                className="h-24 w-24 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                                />
                              </svg>
                            </div>
                          )}
                          <input
                            type="file"
                            id="profilFoto"
                            accept="image/*"
                            onChange={handleProfilFotoChange}
                            className="mt-1 p-2 flex-1 border border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Firma profil fotoğrafı kartvizitte logo olarak kullanılacaktır. Tercihen kare formatta olmalıdır.
                        </p>
                      </div>

                      <div>
                        <label htmlFor="firmaLogo" className="block text-sm font-medium text-gray-700">
                          Firma Logosu
                        </label>
                        <div className="mt-1 flex items-center">
                          {firmaLogoPreview ? (
                            <div className="relative mr-4">
                              <img 
                                src={firmaLogoPreview} 
                                alt="Logo önizleme" 
                                className="h-32 w-32 object-contain border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFirmaLogo(null);
                                  setFirmaLogoPreview("");
                                  setFirmaLogoSil(true);
                                }}
                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className="h-32 w-32 bg-gray-200 flex items-center justify-center mr-4 border border-gray-300">
                              <svg
                                className="h-24 w-24 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7V8h-2v4H8l4 4 4-4h-2z"
                                />
                              </svg>
                            </div>
                          )}
                          <input
                            type="file"
                            id="firmaLogo"
                            accept="image/*"
                            onChange={handleFirmaLogoChange}
                            className="mt-1 p-2 flex-1 border border-gray-300 rounded-md shadow-sm"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Firma logosu QR kod sayfasında gösterilecektir.
                        </p>
                      </div>
                    </div>
                  </Tab.Panel>

                  {/* Tab 2: Kurumsal Bilgiler */}
                  <Tab.Panel className="space-y-6 rounded-xl p-3 bg-white">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="firma_hakkinda_baslik" className="block text-sm font-medium text-gray-700">
                          Firma Hakkında Başlık
                        </label>
                        <input
                          type="text"
                          id="firma_hakkinda_baslik"
                          value={firmaHakkindaBaslik}
                          onChange={(e) => setFirmaHakkindaBaslik(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          placeholder="Hakkımızda"
                        />
                      </div>

                      <div>
                        <label htmlFor="firma_unvan" className="block text-sm font-medium text-gray-700">
                          Firma Ünvanı
                        </label>
                        <input
                          type="text"
                          id="firma_unvan"
                          value={firmaUnvan}
                          onChange={(e) => setFirmaUnvan(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          placeholder="Örnek A.Ş."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="firma_vergi_no" className="block text-sm font-medium text-gray-700">
                          Vergi No
                        </label>
                        <input
                          type="text"
                          id="firma_vergi_no"
                          value={firmaVergiNo}
                          onChange={(e) => setFirmaVergiNo(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          placeholder="1234567890"
                        />
                      </div>

                      <div>
                        <label htmlFor="vergi_dairesi" className="block text-sm font-medium text-gray-700">
                          Vergi Dairesi
                        </label>
                        <input
                          type="text"
                          id="vergi_dairesi"
                          value={vergiDairesi}
                          onChange={(e) => setVergiDairesi(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          placeholder="Merkez Vergi Dairesi"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="firma_hakkinda" className="block text-sm font-medium text-gray-700">
                        Firma Hakkında
                      </label>
                      <textarea
                        id="firma_hakkinda"
                        rows={4}
                        value={firmaHakkinda}
                        onChange={handleFirmaBilgileriChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="Firmamız 2012 yılında kurulmuş..."
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="katalog" className="block text-sm font-medium text-gray-700">
                        Katalog (PDF)
                      </label>
                      <div className="mt-1 flex items-center">
                        {katalogDosyaAdi && (
                          <div className="flex items-center mr-4">
                            <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-600">{katalogDosyaAdi}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setKatalogDosya(null);
                                setKatalogDosyaAdi("");
                                setKatalogSil(true);
                              }}
                              className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          id="katalog"
                          accept="application/pdf"
                          onChange={handleKatalogChange}
                          className="mt-1 p-2 flex-1 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Firma kataloğu PDF formatında olmalıdır.
                      </p>
                    </div>
                  </Tab.Panel>

                  {/* Tab 3: Sosyal Medya */}
                  <Tab.Panel className="relative z-10">
                    <div className="space-y-6 rounded-xl p-3 bg-white">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Sosyal Medya Hesapları</h3>
                      
                      {socialMediaAccounts.map((account, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-medium text-gray-800">Hesap #{index + 1}</h4>
                            {socialMediaAccounts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSocialMedia(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label htmlFor={`platform-${index}`} className="block text-sm font-medium text-gray-700">
                                Platform
                              </label>
                              <select
                                id={`platform-${index}`}
                                value={account.platform}
                                onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                              >
                                <option value="">Platform Seçiniz</option>
                                <option value="instagram">Instagram</option>
                                <option value="facebook">Facebook</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="youtube">YouTube</option>
                                <option value="tiktok">TikTok</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor={`url-${index}`} className="block text-sm font-medium text-gray-700">
                                Bağlantı URL'i veya Kullanıcı Adı
                              </label>
                              <input
                                type="text"
                                id={`url-${index}`}
                                value={account.url}
                                onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder={
                                  account.platform === 'instagram' ? '@kullaniciadi veya instagram.com/kullaniciadi' : 
                                  account.platform === 'facebook' ? 'facebook.com/sayfaadi' :
                                  account.platform === 'twitter' ? '@kullaniciadi veya twitter.com/kullaniciadi' :
                                  account.platform === 'linkedin' ? 'linkedin.com/in/profiladi' :
                                  account.platform === 'youtube' ? 'youtube.com/channel/ID veya youtube.com/@kullaniciadi' :
                                  account.platform === 'tiktok' ? '@kullaniciadi veya tiktok.com/@kullaniciadi' :
                                  'URL veya kullanıcı adı girin'
                                }
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`label-${index}`} className="block text-sm font-medium text-gray-700">
                                Özel Başlık (Boş bırakılırsa platform adı kullanılır)
                              </label>
                              <input
                                type="text"
                                id={`label-${index}`}
                                value={account.label || ''}
                                onChange={(e) => handleSocialMediaChange(index, 'label', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder={`Örn: Kişisel ${account.platform || 'hesap'}, Firma ${account.platform || 'hesabı'}`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={handleAddSocialMedia}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Yeni Sosyal Medya Hesabı Ekle
                        </button>
                      </div>
                    </div>
                  </Tab.Panel>

                  {/* Tab 4: İletişim */}
                  <Tab.Panel className="relative z-10">
                    <div className="space-y-6 rounded-xl p-3 bg-white">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">İletişim Hesapları</h3>
                      
                      {communicationAccounts.map((account, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-medium text-gray-800">Hesap #{index + 1}</h4>
                            {communicationAccounts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCommunication(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label htmlFor={`type-${index}`} className="block text-sm font-medium text-gray-700">
                                İletişim Türü
                              </label>
                              <select
                                id={`type-${index}`}
                                value={account.type}
                                onChange={(e) => handleCommunicationChange(index, 'type', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                              >
                                <option value="">İletişim Türü Seçiniz</option>
                                <option value="telefon">Telefon</option>
                                <option value="eposta">E-posta</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="telegram">Telegram</option>
                                <option value="harita">Harita</option>
                                <option value="website">Website</option>
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor={`value-${index}`} className="block text-sm font-medium text-gray-700">
                                Değer
                              </label>
                              <input
                                type="text"
                                id={`value-${index}`}
                                value={account.value}
                                onChange={(e) => handleCommunicationChange(index, 'value', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder={
                                  account.type === 'telefon' ? '0555 555 55 55' :
                                  account.type === 'eposta' ? 'ornek@email.com' :
                                  account.type === 'whatsapp' ? '0555 555 55 55' :
                                  account.type === 'telegram' ? '@kullaniciadi' :
                                  account.type === 'harita' ? 'https://maps.google.com/?q=Istanbul,Turkey' :
                                  account.type === 'website' ? 'https://www.example.com' :
                                  'İletişim bilgisi girin'
                                }
                              />
                            </div>
                            
                            <div>
                              <label htmlFor={`label-${index}`} className="block text-sm font-medium text-gray-700">
                                Özel Başlık (Boş bırakılırsa varsayılan başlık kullanılır)
                              </label>
                              <input
                                type="text"
                                id={`label-${index}`}
                                value={account.label || ''}
                                onChange={(e) => handleCommunicationChange(index, 'label', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                placeholder="Özel başlık girin (örn: 'İş Telefonu')"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={handleAddCommunication}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Yeni İletişim Hesabı Ekle
                        </button>
                      </div>
                    </div>
                  </Tab.Panel>

                  {/* Tab 5: Banka Hesapları */}
                  <Tab.Panel className="relative z-10">
                    <div className="space-y-6 rounded-xl p-3 bg-white">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Banka Hesap Bilgileri</h3>
                      
                      {bankAccounts.map((account, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-md font-medium text-gray-800">Hesap #{index + 1}</h4>
                            {bankAccounts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBankAccount(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                              <label htmlFor={`banka-${index}`} className="block text-sm font-medium text-gray-700">
                                Banka
                              </label>
                              <select
                                id={`banka-${index}`}
                                value={account.bank_name}
                                onChange={(e) => handleBankAccountChange(index, 'bank_name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-0 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                              >
                                <option value="">Banka Seçiniz</option>
                                {BANKALAR.map((banka) => (
                                  <option key={banka.id} value={banka.id}>
                                    {banka.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label htmlFor={`hesapSahibi-${index}`} className="block text-sm font-medium text-gray-700">
                                Hesap Sahibi Adı Soyadı
                              </label>
                              <input
                                type="text"
                                id={`hesapSahibi-${index}`}
                                value={account.account_holder}
                                onChange={(e) => handleBankAccountChange(index, 'account_holder', e.target.value)}
                                className="mt-1 block w-full rounded-md border-0 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                placeholder="Ahmet Yılmaz"
                              />
                            </div>
                            
                            {/* Alt hesaplar (IBAN ve para birimi) */}
                            {account.accounts.map((subAccount, subIndex) => (
                              <div key={`${index}-${subIndex}`} className="border border-gray-200 rounded-md p-3 bg-white">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-medium text-gray-800">
                                    {subIndex === 0 ? "Ana IBAN" : `Ek IBAN #${subIndex}`}
                                  </h5>
                                  {account.accounts.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSubAccount(index, subIndex)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                  <div className="sm:col-span-3">
                                    <label htmlFor={`iban-${index}-${subIndex}`} className="block text-sm font-medium text-gray-700">
                                      IBAN
                                    </label>
                                    <input
                                      type="text"
                                      id={`iban-${index}-${subIndex}`}
                                      value={subAccount.iban}
                                      onChange={(e) => handleSubAccountChange(index, subIndex, 'iban', e.target.value)}
                                      className="mt-1 block w-full rounded-md border-0 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`currency-${index}-${subIndex}`} className="block text-sm font-medium text-gray-700">
                                      Para Birimi
                                    </label>
                                    <select
                                      id={`currency-${index}-${subIndex}`}
                                      value={subAccount.currency}
                                      onChange={(e) => handleSubAccountChange(index, subIndex, 'currency', e.target.value)}
                                      className="mt-1 block w-full rounded-md border-0 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                    >
                                      <option value="TL">TL</option>
                                      <option value="USD">USD ($)</option>
                                      <option value="EUR">EUR (€)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Alt hesap ekleme butonu */}
                            <div>
                              <button
                                type="button"
                                onClick={() => handleAddSubAccount(index)}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Yeni IBAN Ekle
                              </button>
                              <p className="mt-1 text-xs text-gray-500">
                                Aynı banka ve hesap sahibi için farklı para birimlerinde IBAN eklemek için kullanabilirsiniz.
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={handleAddBankAccount}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Yeni Banka Hesabı Ekle
                        </button>
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
              
              <div className="pt-5">
                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/firmalar"
                    className="flex items-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    İptal
                  </Link>
                  
                  {/* Yetkili ve ünvan testi butonu */}
                  <button
                    type="button"
                    onClick={testYetkiliVeUnvan}
                    className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Yetkili & Ünvan Testi
                  </button>
                  
                  {selectedTab === 4 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedTab(selectedTab - 1)}
                        className="flex items-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Geri
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!firmaAdi) {
                            setError('Firma adı alanı zorunludur');
                            setSelectedTab(0);
                            return;
                          }
                          if (!slug) {
                            setError('URL (slug) alanı zorunludur');
                            setSelectedTab(0);
                            return;
                          }
                          handleSubmit(e as React.FormEvent);
                        }}
                        disabled={loading}
                        className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l7 7-7 7" />
                        </svg>
                        {loading ? 'Kaydediliyor...' : 'Güncelle'}
                      </button>
                    </>
                  ) : (
                    <>
                      {selectedTab > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedTab(selectedTab - 1)}
                          className="flex items-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Geri
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          // Birinci tabda form doğrulama kontrolü
                          if (selectedTab === 0 && !firmaAdi) {
                            setError('Firma adı alanı zorunludur');
                            return;
                          }
                          // Birinci tabda slug kontrolü
                          if (selectedTab === 0 && !slug) {
                            setError('URL (slug) alanı zorunludur');
                            return;
                          }
                          setSelectedTab(selectedTab + 1);
                          setError(null);
                        }}
                        className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        İleri
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 