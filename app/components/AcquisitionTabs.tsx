"use client";
import React, { useState } from "react";

const tabs = [
  {
    label: "Unified User Acquisition",
    title: "A unified user acquisition approach",
    desc: "Manage all your user acquisition, both paid and organic, in one place for easier oversight and better findings. Simplify your decisions, cut down on unnecessary costs and workload, and smartly distribute your budget for optimized outcomes.",
    button: "Learn More",
    image: "https://www.mobileaction.co/wp-content/uploads/2024/08/User-Acqusition_08_24.png"
  },
  {
    label: "Data Coverage",
    title: "Comprehensive data coverage",
    desc: "Access a wide range of data sources to ensure your strategies are based on the most accurate and up-to-date information. Make informed decisions with confidence.",
    button: "Explore Data",
    image: "https://www.mobileaction.co/wp-content/uploads/2024/08/User-Acqusition_08_24.png"
  },
  {
    label: "App Growth Expertise",
    title: "Expertise for app growth",
    desc: "Leverage proven growth tactics and industry insights to accelerate your app's success. Our team supports you at every stage of your growth journey.",
    button: "See How",
    image: "https://www.mobileaction.co/wp-content/uploads/2024/08/User-Acqusition_08_24.png"
  },
  {
    label: "Global Competitive Edge",
    title: "Gain a global competitive edge",
    desc: "Stay ahead of the competition with tools and analytics designed for the global market. Expand your reach and outperform rivals worldwide.",
    button: "Get Started",
    image: "https://www.mobileaction.co/wp-content/uploads/2024/08/User-Acqusition_08_24.png"
  },
];

export default function AcquisitionTabs() {
  const [active, setActive] = useState(0);
  return (
    <section className="w-full bg-[#f8f9fb] py-20 px-2">
      <h2 className="text-center text-[2rem] md:text-[2.3rem] font-semibold tracking-tight text-gray-900 mb-12" style={{fontFamily: 'Inter, SF Pro, Rubik, sans-serif', fontWeight: 600, letterSpacing: '-0.01em'}}>Increase visibility, multiply downloads</h2>
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg flex flex-col md:flex-row items-stretch overflow-hidden">
        {/* Sol: Tab menü ve görsel */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 min-w-[320px]">
          {/* Tab menü */}
          <div className="w-full">
            <div className="flex flex-row justify-center gap-6">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActive(i)}
                  className={`pb-3 px-6 text-base md:text-[1.08rem] font-medium focus:outline-none transition-colors
                    ${active === i ? 'text-[#3b82f6]' : 'text-gray-500'}
                    whitespace-nowrap`}
                  style={{ minWidth: 160 }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="w-full h-[1.5px] bg-gray-200" />
          </div>
          {/* Görsel alanı */}
          <div className="relative flex items-center justify-center w-[340px] h-[340px] mx-auto mt-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e0e7ff] via-white to-[#f0f9ff] shadow-lg" style={{filter: 'blur(2px)', zIndex: 1}} />
            <div className="absolute inset-0 rounded-full border border-dashed border-blue-200 z-10" />
            <div className="relative z-20 flex flex-col items-center justify-center w-[220px] h-[220px] rounded-full bg-white shadow-md mx-auto overflow-hidden">
              <img src={tabs[active].image} alt={tabs[active].label} className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        {/* Sağ: İçerik alanı */}
        <div className="flex-1 flex flex-col justify-center p-8 md:pl-0 md:pr-12">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 mt-4 md:mt-0 text-left" style={{fontFamily: 'Inter, SF Pro, Rubik, sans-serif'}}>{tabs[active].title}</h3>
          <p className="text-gray-600 text-base md:text-[1.08rem] leading-relaxed mb-8 max-w-md text-left">{tabs[active].desc}</p>
          <button className="px-6 py-2 rounded-full border border-gray-900 text-gray-900 font-medium bg-white hover:bg-gray-100 transition shadow-sm w-max text-base md:text-[1.08rem]">{tabs[active].button}</button>
        </div>
      </div>
    </section>
  );
} 