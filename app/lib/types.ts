import "next-auth";

// NextAuth User türünü genişlet
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

// Firma tipi
export interface Firma {
  id: number;
  firma_adi: string;
  slug: string;
  telefon?: string;
  eposta?: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string | string[];
  youtube?: string | string[];
  linkedin?: string | string[];
  twitter?: string | string[];
  facebook?: string | string[];
  website?: string | string[];
  harita?: string | string[];
  profil_foto?: string;
  vcard_dosya?: string;
  yetkili_adi?: string;
  yetkili_pozisyon?: string;
  katalog?: string;
  firma_hakkinda?: string;
  firma_unvan?: string;
  firma_vergi_no?: string;
  vergi_dairesi?: string;
  communication_data?: string;
  created_at: string;
  updated_at: string;
} 