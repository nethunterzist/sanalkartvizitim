import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import handlebars from 'handlebars';
import { cardTemplate } from '../lib/cardTemplate';

// Handlebars helper fonksiyonunu kaydet
handlebars.registerHelper('ifEquals', function(this: any, arg1: any, arg2: any, options: any) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// Banka hesapları için JSON parse helper'ı
handlebars.registerHelper('parseBankAccounts', function(jsonStr: string) {
    try { return JSON.parse(jsonStr); } catch { return []; }
});

// Dinamik metadatayı oluşturan fonksiyon
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    try {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const apiUrl = `${baseUrl}/api/sayfalar/${slug}`;
        const response = await fetch(apiUrl, { 
            cache: 'no-store', 
            headers: { 
                'Accept': 'application/json'
            } 
        });
        
        if (!response.ok) {
            return {
                title: 'Kartvizit Bulunamadı',
                description: 'İstediğiniz kartvizit sayfası bulunamadı.'
            };
        }

        const data = await response.json();
        
        return {
            title: `${data.firma_adi} - Dijital Kartvizit`,
            description: data.firma_hakkinda ? data.firma_hakkinda.substring(0, 160) : `${data.firma_adi} dijital kartvizit sayfası`,
            openGraph: {
                title: `${data.firma_adi} - Dijital Kartvizit`,
                description: data.firma_hakkinda ? data.firma_hakkinda.substring(0, 160) : `${data.firma_adi} dijital kartvizit sayfası`,
                images: data.profil_foto ? [data.profil_foto] : [],
            },
        };
    } catch (error) {
        console.error('Metadata oluşturulurken hata:', error);
        return {
            title: 'Kartvizit Bulunamadı',
            description: 'İstediğiniz kartvizit sayfası bulunamadı.'
        };
    }
}

export default async function KartvizitPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    
    try {
        // API'den veriyi çek
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const apiUrl = `${baseUrl}/api/sayfalar/${slug}`;
        
        // API'den JSON verisi al
        const response = await fetch(apiUrl, { 
            cache: 'no-store', 
            headers: { 
                'Accept': 'application/json'
            } 
        });
        
        if (!response.ok) {
            return notFound();
        }

        // JSON verisini parse et
        const data = await response.json();
        console.log('API JSON:', data);
        
        // Handlebars ile template'i derle
        const compiledTemplate = handlebars.compile(cardTemplate);
        
        // Template'i veri ile doldur
        const html = compiledTemplate({
            ...data,
            rehbereEkleButonu: data && `
                <div style="display: flex; flex-direction: column; align-items: center; margin-top: 8px;">
                    ${data.yetkili_pozisyon ? `<div style="font-size: 1.05em; color: #888; margin-bottom: 8px;">${data.yetkili_pozisyon}</div>` : ''}
                    <a href="/${data.slug}/${data.slug}.vcf" download="${data.firma_adi}.vcf" style="display: flex; align-items: center; gap: 6px; background: #f5f5f5; border-radius: 8px; padding: 6px 14px; font-size: 15px; color: #222; text-decoration: none; box-shadow: 0 1px 4px #0001; margin-top: 2px;">
                        <img src="/img/rehber.png" alt="Rehbere Ekle" style="width: 22px; height: 22px;" />
                        <span>Rehbere Ekle</span>
                    </a>
                </div>
            `
        });
        
        // HTML'i döndür
        return (
            <div dangerouslySetInnerHTML={{ __html: html }} />
        );
    } catch (error) {
        console.error('Kartvizit sayfası oluşturulurken hata:', error);
        return notFound();
    }
}