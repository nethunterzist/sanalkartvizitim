"use client";
import React, { useState } from 'react';
import Image from 'next/image';

const tabs = [
  {
    label: 'QR Kod ile Paylaşım',
    image: '/img/feature-qr.png',
    title: 'QR Kod ile Anında Paylaşım',
    desc: 'Kartvizitinizi QR kod ile anında paylaşın, temassız ve hızlı iletişim kurun.'
  },
  {
    label: 'vCard ile Rehbere Kaydet',
    image: '/img/feature-vcard.png',
    title: 'vCard ile Rehbere Kaydet',
    desc: 'Tek tıkla rehbere eklenebilen vCard desteğiyle profesyonel görünüm.'
  },
  {
    label: 'Tüm Cihazlarla Uyumlu',
    image: '/img/feature-responsive.png',
    title: 'Tüm Cihazlarla Uyumlu',
    desc: 'iOS, Android ve tüm tarayıcılarda sorunsuz dijital kartvizit deneyimi.'
  },
  {
    label: 'Sayfa Özelleştirme',
    image: '/img/feature-customize.png',
    title: 'Sayfa Özelleştirme',
    desc: 'Renk, logo, sosyal medya ve iletişim alanlarını dilediğiniz gibi kişiselleştirin.'
  },
  {
    label: 'Güvenli ve Hızlı',
    image: '/img/feature-secure.png',
    title: 'Güvenli ve Hızlı',
    desc: 'Verileriniz bulutta güvenle saklanır, hızlı yükleme ve erişim.'
  },
  {
    label: 'Modern Entegrasyonlar',
    image: '/img/feature-integration.png',
    title: 'Modern Entegrasyonlar',
    desc: 'Supabase, Vercel, Next.js gibi modern altyapı ile geliştirildi.'
  },
];

export default function TabbedFeatures() {
  const [active, setActive] = useState(0);
  return (
    <section className="w-full bg-[#f6fbfa] py-20" id="features">
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        <div className="w-full bg-white rounded-3xl shadow-xl mx-auto p-0 md:p-0 flex flex-col items-center" style={{minHeight: 480}}>
          {/* Başlık */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mt-10 mb-8 text-gray-900">Dijital kartvizit ile işinizi büyütün</h2>
          {/* Sekme başlıkları yatayda, kutunun üstünde */}
          <div className="flex justify-center gap-2 md:gap-6 w-full border-b border-gray-200 mb-8 px-2 md:px-8">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActive(i)}
                className={`px-2 md:px-4 py-3 text-base md:text-lg font-medium transition border-b-2 ${active === i ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'} focus:outline-none bg-transparent`}
                style={{ minWidth: 120 }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* İçerik kutusu */}
          <div className="w-full flex justify-center px-2 md:px-8 pb-12">
            <div className="w-full flex flex-col md:flex-row items-center md:items-stretch gap-8 max-w-4xl mt-4">
              <div className="flex-1 flex items-center justify-center min-w-[220px]">
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image src={tabs[active].image} alt={tabs[active].label} fill className="object-contain rounded-2xl bg-gray-50" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center max-w-lg">
                <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-900">{tabs[active].title}</h3>
                <p className="text-gray-600 mb-6 text-base md:text-lg">{tabs[active].desc}</p>
                <a href="#" className="inline-block px-6 py-2 rounded-lg border border-blue-700 text-blue-700 font-medium hover:bg-blue-50 transition w-max">Daha Fazla</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 