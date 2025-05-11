"use client";

export default function BigCTA() {
  return (
    <section className="w-full flex justify-center items-center py-16 px-2">
      <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden p-1" style={{background: 'linear-gradient(120deg, #4f8cff 0%, #1e2a5a 100%)'}}>
        {/* Glow border efekti */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-blue-200 opacity-40" style={{boxShadow: '0 0 32px 4px #4f8cff55'}} />
        {/* İçerik kutusu */}
        <div className="relative z-10 rounded-3xl bg-gradient-to-br from-[#1e2a5a] via-[#233a7c] to-[#4f8cff] p-10 flex flex-col items-center justify-center text-center">
          {/* SVG dairesel desenler */}
          <svg className="absolute left-0 top-0 w-full h-full opacity-20" width="100%" height="100%" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="100" r="120" stroke="#fff" strokeWidth="1.5" opacity="0.12" />
            <circle cx="400" cy="100" r="80" stroke="#fff" strokeWidth="1.5" opacity="0.10" />
            <circle cx="400" cy="100" r="40" stroke="#fff" strokeWidth="1.5" opacity="0.08" />
          </svg>
          <h2 className="text-white text-2xl md:text-3xl font-semibold mb-8 relative z-10">Grow your app on the App Store and<br />Google Play Store with our solutions now</h2>
          <div className="flex gap-4 justify-center mt-2 relative z-10">
            <button className="px-6 py-2 rounded-full bg-white text-blue-900 font-semibold shadow hover:bg-blue-100 transition">Get Started</button>
            <button className="px-6 py-2 rounded-full border border-white text-white font-semibold bg-transparent hover:bg-white hover:text-blue-900 transition">Book a Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
} 