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
  telefon: string | null;
  eposta: string | null;
  whatsapp: string | null;
  instagram: string | null;
  youtube: string | null;
  website: string | null;
  harita: string | null;
  profil_foto: string | null;
  vcard_dosya: string | null;
  yetkili_adi: string | null;
  yetkili_pozisyon: string | null;
  created_at: string;
  updated_at: string;
} 