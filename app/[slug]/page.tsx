import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// Handlebars helper fonksiyonunu kaydet
handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// Dinamik metadatayı oluşturan fonksiyon
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = params;
    try {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const apiUrl = `${baseUrl}/api/sayfalar/${slug}`;
        const response = await fetch(apiUrl, { cache: 'no-store', headers: { 'Accept': 'text/html' } });
        
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
        const response = await fetch(apiUrl, { cache: 'no-store', headers: { 'Accept': 'text/html' } });
        
        if (!response.ok) {
            return notFound();
        }

        const data = await response.json();
        
        // HTML template'ini oku
        const templatePath = path.join(process.cwd(), 'templates', 'index-template.html');
        const template = fs.readFileSync(templatePath, 'utf-8');
        
        // Handlebars ile template'i derle
        const compiledTemplate = handlebars.compile(template);
        
        // Template'i veri ile doldur
        const html = compiledTemplate(data);
        
        // HTML'i döndür
        return (
            <div dangerouslySetInnerHTML={{ __html: html }} />
        );
    } catch (error) {
        console.error('Kartvizit sayfası oluşturulurken hata:', error);
        return notFound();
    }
}