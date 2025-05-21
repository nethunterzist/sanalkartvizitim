"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  QrCode,
  Contact2,
  Palette,
  Share2,
} from 'lucide-react';

const faqs = [
  {
    icon: <Building2 size={24} className="text-blue-600" />,
    label: 'Firma Oluşturma',
    desc: 'Kolayca yeni bir firma profili oluşturun, tüm bilgileri tek panelden yönetin.',
    image: '/img/faq-firma-gorsel.png',
  },
  {
    icon: <QrCode size={24} className="text-blue-600" />,
    label: 'QR Kod Paylaşımı',
    desc: 'Firmanızın dijital kartvizitini QR kod ile hızlıca paylaşın.',
    image: '/img/faq-qr-gorsel.png',
  },
  {
    icon: <Contact2 size={24} className="text-blue-600" />,
    label: 'Rehbere Kaydetme',
    desc: 'vCard desteğiyle iletişim bilgilerinizi tek tıkla rehbere ekleyin.',
    image: '/img/faq-vcard-gorsel.png',
  },
  {
    icon: <Palette size={24} className="text-blue-600" />,
    label: 'Sayfa Özelleştirme',
    desc: 'Renk, logo ve sosyal medya alanlarını dilediğiniz gibi kişiselleştirin.',
    image: '/img/faq-custom-gorsel.png',
  },
  {
    icon: <Share2 size={24} className="text-blue-600" />,
    label: 'Sosyal Medya ve Paylaşım',
    desc: 'Tüm sosyal medya ve iletişim kanallarınızı tek sayfada toplayın.',
    image: '/img/faq-share-gorsel.png',
  },
];

export default function SmartFaq() {
  const [open, setOpen] = useState(0);
  const [lastOpen, setLastOpen] = useState(0);

  const handleAccordion = (i: number) => {
    if (open === i) {
      setOpen(-1);
      setLastOpen(i);
    } else {
      setOpen(i);
      setLastOpen(i);
    }
  };

  return (
    <section className="w-full py-20 bg-white" id="smart-faq">
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Akıllı Sistemler & Sıkça Sorulanlar</h2>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-stretch">
          {/* Sol: Büyük görsel */}
          <div className="flex-1 flex items-center justify-center min-h-[420px] h-[420px]">
            <div
              key={lastOpen}
              className="relative w-80 h-80 md:w-[420px] md:h-[420px] rounded-3xl overflow-hidden shadow-lg bg-white flex items-center justify-center transition-all duration-500 animate-slide-in-left"
              style={{
                animation: 'slide-in-left 0.5s cubic-bezier(0.4,0,0.2,1)'
              }}
            >
              <Image 
                src={faqs[lastOpen].image} 
                alt={faqs[lastOpen].label} 
                fill 
                className="object-contain" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>
          {/* Sağ: Accordion başlıklar */}
          <div className="flex-1 flex flex-col gap-4 justify-center min-h-[420px] h-[420px]">
            {faqs.map((faq, i) => (
              <div key={faq.label} className="flex flex-col gap-0">
                {/* Accordion başlık */}
                <div
                  className={`w-full flex items-center gap-4 px-6 py-5 text-left transition group cursor-pointer
                    ${open === i ? 'bg-blue-50 border border-blue-200 rounded-t-2xl text-blue-700 font-semibold shadow-md' : 'bg-[#f8fafc] border border-gray-200 rounded-2xl text-gray-800 font-semibold hover:bg-blue-50'}`}
                  onClick={() => handleAccordion(i)}
                  aria-expanded={open === i}
                >
                  <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-200 group-hover:border-blue-400">
                    {faq.icon}
                  </span>
                  <span className={`font-semibold text-lg flex-1 ${open === i ? 'text-blue-700' : 'text-gray-800'}`}>{faq.label}</span>
                  <svg className={`w-5 h-5 ml-2 transition-transform ${open === i ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                </div>
                {/* Accordion içeriği */}
                {open === i && (
                  <div
                    className="transition-all duration-500 bg-white border border-blue-200 border-t-0 rounded-b-2xl shadow-md py-4 px-6 animate-fade-in"
                  >
                    <p className="text-gray-600 mb-4 mt-2 text-base md:text-lg">{faq.desc}</p>
                    <a href="#" className="inline-block px-6 py-2 rounded-lg border border-blue-700 text-blue-700 font-medium hover:bg-blue-50 transition">Learn More</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
} 