import React from "react";

export default function HeroCTA() {
  return (
    <section className="w-full flex justify-center items-center py-16 px-2">
      <div
        className="w-full max-w-5xl mx-auto rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-12"
        style={{
          backgroundImage: 'url(/img/home-footer-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Sol: Başlık ve Butonlar */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Start tracking your<br />
            user analytics to boost<br />
            your business
          </h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-md text-lg shadow hover:bg-blue-50 transition border border-white">
              Get Started
            </button>
            <button className="bg-transparent text-white font-semibold px-8 py-3 rounded-md text-lg border border-white hover:bg-white hover:text-blue-700 transition">
              Learn More
            </button>
          </div>
        </div>
        {/* Sağ: Görsel Mockup */}
        <div className="flex-1 flex justify-center md:justify-end">
          {/* Placeholder görsel, istersen gerçek görsel ekleyebilirsin */}
          <div className="w-[340px] h-[220px] bg-white rounded-2xl shadow-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 w-40 h-20 bg-gray-100 rounded-lg" />
            <div className="absolute bottom-4 right-4 w-28 h-28 bg-gray-200 rounded-xl border-4 border-white" />
            <span className="text-blue-700 font-bold text-2xl z-10">Mockup</span>
          </div>
        </div>
      </div>
    </section>
  );
} 