"use client";
import React, { useState } from "react";

const FAQS = [
  { q: "Dijital kartviziti kimler kullanabilir?", a: "Bireysel ve kurumsal kullanıcılar, girişimciler, KOBİ'ler, şirketler ve profesyoneller dijital kartviziti kolayca kullanabilir." },
  { q: "Kartvizitime hangi bilgileri ekleyebilirim?", a: "Sosyal medya hesapları, iletişim bilgileri, banka hesapları, web sitesi, katalog PDF, firma logosu, profil fotoğrafı ve daha fazlasını ekleyebilirsiniz." },
  { q: "Dijital kartvizit neden avantajlıdır?", a: "Her yerden erişim, hızlı paylaşım, güncellenebilirlik, sürdürülebilirlik ve modern görünüm gibi birçok avantaj sunar." },
  { q: "Bilgilerim güvende mi?", a: "Tüm verileriniz güvenli altyapı ve modern güvenlik standartları ile korunur. Sadece sizin belirlediğiniz bilgiler paylaşılır." },
  { q: "Kartvizitimi nasıl paylaşabilirim?", a: "QR kod, kısa link veya vCard (Rehbere Ekle) ile kartvizitinizi kolayca paylaşabilirsiniz." },
  { q: "Başka sistemlerle entegrasyon mümkün mü?", a: "Evet, dijital kartvizit platformu çeşitli entegrasyonlara ve API desteğine sahiptir." },
];

export default function VideoFaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="diger-bilgiler" className="relative w-full min-h-[700px] flex flex-col items-center justify-center pt-48" style={{background: "linear-gradient(120deg, #f8fbfa 0%, #f8e8fa 100%)"}}>
      {/* Arka plan görseli (slider görseli) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img src="/img/home-1.png" alt="Background" className="w-full h-full object-cover opacity-80" />
      </div>
      {/* Video kutusu */}
      <div className="relative z-10 flex justify-center w-full" style={{marginTop: '-120px'}}>
        <div className="bg-white/80 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl border border-gray-200 backdrop-blur-md">
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            poster="/img/video-poster.jpg"
            className="w-full h-[340px] object-cover pointer-events-none select-none"
          >
            <source src="https://video-previews.elements.envatousercontent.com/00939f1f-ffb1-46d0-ac53-7b11dc3b6f1a/watermarked_preview/watermarked_preview.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      {/* FAQ alanı */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-12 px-4 pb-20">
        <div className="flex flex-col items-center mb-8">
          <span className="uppercase text-xs tracking-widest text-gray-400 mb-2">SIKÇA SORULAN SORULAR</span>
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800">
            Merak ettiğiniz bir konu mu var? <span className="text-[#5b6fff]">Cevabınızı</span> burada bulamazsanız, iletişim formumuzdan bize ulaşabilirsiniz.
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {FAQS.map((item, idx) => (
            <div key={idx} className="bg-white/80 rounded-lg shadow p-4">
              <button
                className="w-full flex justify-between items-center text-left font-medium text-gray-800 text-base focus:outline-none"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                aria-controls={`faq-content-${idx}`}
              >
                <span>{item.q}</span>
                <span className="ml-2 text-[#5b6fff]">{open === idx ? "-" : "+"}</span>
              </button>
              <div
                id={`faq-content-${idx}`}
                className={`overflow-hidden transition-all duration-400 ease-in-out mt-2 text-gray-600 text-sm ${open === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                style={{ transitionProperty: 'max-height, opacity' }}
              >
                {open === idx && <div>{item.a}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 