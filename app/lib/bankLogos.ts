export interface BankLogo {
  name: string;
  slug: string;
  logoUrl: string;
}

// Türkiye'deki popüler bankaların logoları
export const bankLogos: BankLogo[] = [
  {
    name: "Ziraat Bankası",
    slug: "ziraat-bankasi",
    logoUrl: "/img/banks/ziraat.png"
  },
  {
    name: "İş Bankası",
    slug: "is-bankasi",
    logoUrl: "/img/banks/is-bankasi.png"
  },
  {
    name: "Garanti BBVA",
    slug: "garanti-bbva",
    logoUrl: "/img/banks/garanti.png"
  },
  {
    name: "Akbank",
    slug: "akbank",
    logoUrl: "/img/banks/akbank.png"
  },
  {
    name: "Yapı Kredi",
    slug: "yapi-kredi",
    logoUrl: "/img/banks/yapi-kredi.png"
  },
  {
    name: "Halkbank",
    slug: "halkbank",
    logoUrl: "/img/banks/halkbank.png"
  },
  {
    name: "VakıfBank",
    slug: "vakifbank",
    logoUrl: "/img/banks/vakifbank.png"
  },
  {
    name: "QNB Finansbank",
    slug: "qnb-finansbank",
    logoUrl: "/img/banks/finansbank.png"
  },
  {
    name: "Denizbank",
    slug: "denizbank",
    logoUrl: "/img/banks/denizbank.png"
  },
  {
    name: "TEB",
    slug: "teb",
    logoUrl: "/img/banks/teb.png"
  },
  {
    name: "ING Bank",
    slug: "ing-bank",
    logoUrl: "/img/banks/ing.png"
  },
  {
    name: "HSBC",
    slug: "hsbc",
    logoUrl: "/img/banks/hsbc.png"
  },
  {
    name: "Odeabank",
    slug: "odeabank",
    logoUrl: "/img/banks/odeabank.png"
  },
  {
    name: "Şekerbank",
    slug: "sekerbank",
    logoUrl: "/img/banks/sekerbank.png"
  },
  {
    name: "Diğer",
    slug: "diger",
    logoUrl: "/img/banks/default.png"
  }
];

// Banka adına göre logo URL'si döndüren yardımcı fonksiyon
export function getBankLogoUrl(bankName: string): string {
  if (!bankName) return "/img/banks/default.png";
  
  const normalizedBankName = bankName.toLowerCase().trim();
  
  const bank = bankLogos.find(bank => 
    normalizedBankName.includes(bank.name.toLowerCase()) || 
    normalizedBankName.includes(bank.slug)
  );
  
  return bank?.logoUrl || "/img/banks/default.png";
} 