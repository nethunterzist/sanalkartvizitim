import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    console.log("1. save-html API başladı");
    const { slug, html } = await req.json();
    console.log("2. Gelen veriler:", { slug, html_length: html?.length || 0 });
    
    if (!slug || !html) {
      console.log("HATA: Slug veya HTML boş!");
      return NextResponse.json(
        { message: 'Slug ve HTML içeriği gereklidir' },
        { status: 400 }
      );
    }
    
    // Proje kök dizini
    const projectRoot = process.cwd();
    console.log("3. Proje kök dizini:", projectRoot);
    
    // Firma için klasör oluşturma
    const firmaDir = path.join(projectRoot, 'public', slug);
    console.log("4. Oluşturulacak firma dizini:", firmaDir);
    
    // Public dizini var mı kontrol et
    const publicDir = path.join(projectRoot, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      console.log("Public dizini oluşturuldu:", publicDir);
    }
    
    if (!fs.existsSync(firmaDir)) {
      fs.mkdirSync(firmaDir, { recursive: true });
      console.log("5. Firma dizini oluşturuldu:", firmaDir);
    } else {
      console.log("5. Firma dizini zaten var:", firmaDir);
    }
    
    // HTML dosyasını yazma
    const outputPath = path.join(firmaDir, 'index.html');
    console.log("6. HTML dosya yolu:", outputPath);
    
    try {
      fs.writeFileSync(outputPath, html, 'utf-8');
      console.log(`7. HTML dosyası başarıyla oluşturuldu: ${outputPath}`);
    } catch (writeError) {
      console.error("HATA: Dosya yazma hatası:", writeError);
      throw writeError;
    }
    
    // Dosyanın varlığını son kontrol
    if (fs.existsSync(outputPath)) {
      console.log("8. Dosya kontrol: HTML dosyası mevcut");
      const fileSize = fs.statSync(outputPath).size;
      console.log("9. Dosya boyutu:", fileSize, "byte");
      
      // İçerik doğrulama
      try {
        const writtenContent = fs.readFileSync(outputPath, 'utf-8');
        console.log("10. Yazılan içerik uzunluğu:", writtenContent.length);
        
        if (writtenContent.length !== html.length) {
          console.warn("UYARI: Yazılan içerik uzunluğu orijinal içerikten farklı!");
        }
      } catch (readError) {
        console.error("HATA: Dosya okuma hatası:", readError);
      }
    } else {
      console.error("HATA: Dosya yazıldı ama bulunamıyor!");
      throw new Error("Dosya oluşturuldu ama daha sonra bulunamadı!");
    }
    
    console.log("11. İşlem başarıyla tamamlandı");
    return NextResponse.json({ 
      success: true, 
      message: 'HTML dosyası başarıyla kaydedildi',
      path: outputPath,
      html_length: html.length
    });
  } catch (error) {
    console.error('HTML dosyası kaydedilirken hata oluştu:', error);
    return NextResponse.json(
      { message: 'HTML dosyası kaydedilirken bir hata oluştu', error: String(error) },
      { status: 500 }
    );
  }
} 