"use client";
import React from "react";

const STEPS = [
  {
    number: "01",
    title: "Dijital Kartvizitini Oluştur",
    desc: "Hızlıca kaydol, kendi dijital kartvizitini saniyeler içinde oluştur."
  },
  {
    number: "02",
    title: "Bilgilerini ve Sosyal Medyanı Ekle",
    desc: "İletişim bilgilerini, sosyal medya hesaplarını ve firma detaylarını kolayca ekle."
  },
  {
    number: "03",
    title: "QR Kod ile Anında Paylaş",
    desc: "Kartvizitini QR kod veya kısa link ile dilediğin kişiyle anında paylaş."
  },
  {
    number: "04",
    title: "Tüm İletişim Kanallarını Tek Platformda Yönet",
    desc: "Tüm iletişim, sosyal medya ve tanıtım kanallarını tek bir dijital kartvizitte birleştir, güncel tut."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="iletisim" className="w-full bg-white py-20 flex flex-col items-center">
      <div className="text-center mb-4">
        <span className="uppercase tracking-widest text-gray-400 text-sm font-medium">Nasıl çalışır?</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 text-center">
        Dijital kartvizitini oluştur, bilgilerini ekle ve <span className="text-[#5b6fff]">tek tıkla paylaş!</span>
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl mt-12">
        {/* Sol kutular */}
        <div className="flex flex-col gap-16 items-end flex-1">
          {STEPS.slice(0,2).map((step) => (
            <div key={step.number} className="text-right">
              <div className="text-5xl font-bold text-[#5b6fff] mb-2">{step.number}</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{step.title}</div>
              <div className="text-gray-500 max-w-xs text-base">{step.desc}</div>
            </div>
          ))}
        </div>
        {/* Telefon görseli */}
        <div className="flex-shrink-0 mx-8 my-12 md:my-0">
          <img src="https://sandbox-tailwind-nextjs.netlify.app/assets/img/photos/devices4.png" alt="App Phone" className="w-[320px] md:w-[380px] h-auto drop-shadow-xl" />
        </div>
        {/* Sağ kutular */}
        <div className="flex flex-col gap-16 items-start flex-1">
          {STEPS.slice(2,4).map((step) => (
            <div key={step.number} className="text-left">
              <div className="text-5xl font-bold text-[#5b6fff] mb-2">{step.number}</div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{step.title}</div>
              <div className="text-gray-500 max-w-xs text-base">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 