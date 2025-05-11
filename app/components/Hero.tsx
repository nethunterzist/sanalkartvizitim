"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import HeroCarousel from './HeroCarousel';

export default function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ adSoyad: '', telefon: '', webSite: '', firmaAdi: '' });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Burada backend entegrasyonu yapılabilir
    console.log('Demo Talebi:', form);
    setShowModal(false);
    setForm({ adSoyad: '', telefon: '', webSite: '', firmaAdi: '' });
  };
  return (
    <section
      className="relative w-full min-h-[80vh] flex flex-col justify-center items-center overflow-hidden"
      style={{
        backgroundImage: 'url(/img/home-1.png)',
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-3xl w-full text-center pt-24 pb-12 z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-2">
          Yeni Nesil Dijital Kartvizitler ile
        </h1>
        <div className="text-2xl md:text-4xl font-bold flex flex-col items-center mb-6 min-h-[56px]">
          <GradientTypewriter
            words={["hız", "güven", "stil", "entegrasyon", "özgürlük"]}
            gradients={[
              'linear-gradient(90deg, #5b6fff 0%, #7fbcfb 100%)', // hız
              'linear-gradient(90deg, #ff8c42 0%, #ff5e62 100%)', // güven
              'linear-gradient(90deg, #a259ff 0%, #5b6fff 100%)', // stil
              'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', // entegrasyon
              'linear-gradient(90deg, #fa709a 0%, #fee140 100%)', // özgürlük
            ]}
          />
        </div>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Dijital kartvizit, QR kod ve vCard ile firmanızı tek bir linkte tanıtın. Modern, güvenli ve serverless mimariyle, her yerden erişim ve paylaşım kolaylığı.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button onClick={() => setShowModal(true)} className="px-8 py-3 rounded-lg bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition">Hemen Ücretsiz Demo Alın</button>
          <a href="#" className="px-8 py-3 rounded-lg bg-white border border-blue-700 text-blue-700 font-semibold shadow hover:bg-blue-50 transition">Örnekleri İncele</a>
        </div>
      </div>
      {/* Carousel alanı */}
      <HeroCarousel />
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg width="32" height="32" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
      </div>
      {/* Demo Talep Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 text-2xl">&times;</button>
            <h3 className="text-xl font-bold mb-2 text-center">Hemen Bilgilerinizi Doldurun, Demonuzu İletelim!</h3>
            <p className="text-gray-600 text-center mb-6">Sadece birkaç bilgiyle ücretsiz demo talebinizi hemen oluşturun.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input name="adSoyad" value={form.adSoyad} onChange={handleChange} required placeholder="Ad Soyad" className="border rounded-lg px-4 py-2" />
              <input name="telefon" value={form.telefon} onChange={handleChange} required placeholder="Telefon" className="border rounded-lg px-4 py-2" />
              <input name="webSite" value={form.webSite} onChange={handleChange} required placeholder="Web Site" className="border rounded-lg px-4 py-2" />
              <input name="firmaAdi" value={form.firmaAdi} onChange={handleChange} required placeholder="Firma Adı" className="border rounded-lg px-4 py-2" />
              <button type="submit" className="mt-2 px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">Demo Talebini Gönder</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// GradientTypewriter bileşeni
type GradientTypewriterProps = {
  words: string[];
  gradients: string[];
};
function GradientTypewriter({ words, gradients }: GradientTypewriterProps) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1200);
      return;
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? 60 : 90);
    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, words]);
  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(blinkInterval);
  }, []);
  if (subIndex === 0) return null;
  return (
    <span
      style={{
        background: gradients[index],
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold',
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      {words[index].substring(0, subIndex)}{blink && <span>|</span>}
    </span>
  );
} 