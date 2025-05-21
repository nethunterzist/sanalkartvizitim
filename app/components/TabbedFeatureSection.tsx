"use client";
import React, { useState } from "react";

const TABS = [
  {
    key: "tab1",
    title: "Sosyal Medya Hesapları",
    image: "https://www.mobileaction.co/wp-content/uploads/2024/08/User-Acqusition_08_24.png",
    heading: "Tüm sosyal medya profillerinizi ekleyin",
    desc: "Instagram, LinkedIn, Facebook, Twitter, TikTok ve daha fazlasını kartvizitinize ekleyerek dijital ağınızı güçlendirin. Tek tıkla tüm sosyal medya hesaplarınıza erişim sağlayın.",
    link: "#sosyal-medya"
  },
  {
    key: "tab2",
    title: "Banka Hesapları",
    image: "https://www.mobileaction.co/wp-content/uploads/2024/08/User-Acqusition_08_24.png",
    heading: "Banka ve IBAN bilgilerinizi paylaşın",
    desc: "Tüm banka hesaplarınızı ve IBAN bilgilerinizi güvenli şekilde ekleyin. İş ortaklarınız ve müşterilerinizle kolayca finansal bilgi paylaşımı yapın.",
    link: "#banka"
  },
  {
    key: "tab3",
    title: "İletişim Bilgileri",
    image: "https://www.mobileaction.co/wp-content/uploads/2024/08/User-Acqusition_08_24.png",
    heading: "Telefon, e-posta ve adres bilgileri",
    desc: "Telefon numarası, e-posta adresi, ofis adresi gibi tüm iletişim bilgilerinizi tek bir dijital kartvizitte toplayın. Kolayca ulaşılabilir olun.",
    link: "#iletisim"
  },
  {
    key: "tab4",
    title: "Diğer Bilgiler",
    image: "https://www.mobileaction.co/wp-content/uploads/2024/08/User-Acqusition_08_24.png",
    heading: "Ekleyebileceğiniz diğer alanlar",
    desc: "Web sitesi, katalog PDF, firma logosu, profil fotoğrafı, vCard (Rehbere Ekle) ve daha fazlasını kartvizitinize entegre edin. Tüm kurumsal bilgilerinizi modern ve güvenli şekilde paylaşın.",
    link: "#diger-bilgiler"
  }
];

export default function TabbedFeatureSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="sosyal-medya" className="w-full bg-white py-20 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 flex flex-col">
        {/* Tab Menüsü */}
        <div className="flex gap-8 border-b border-gray-200 mb-8 justify-center">
          {TABS.map((tab, idx) => (
            <button
              key={tab.key}
              onClick={() => setActive(idx)}
              className={`pb-3 text-lg font-medium transition-colors duration-200 ${active === idx ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 border-b-2 border-transparent"}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        {/* İçerik */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center md:justify-center mt-6 md:mt-0">
            <img src={TABS[active].image} alt={TABS[active].title} className="w-[320px] h-[320px] object-contain rounded-xl bg-gray-50" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
            <h3 className="text-2xl font-semibold mb-4">{TABS[active].heading}</h3>
            <p className="text-gray-600 mb-6">{TABS[active].desc}</p>
            <a href={TABS[active].link} className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors">Detaylı Bilgi</a>
          </div>
        </div>
      </div>
    </section>
  );
} 