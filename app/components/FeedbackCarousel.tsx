"use client";
import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaQuoteLeft } from 'react-icons/fa';

const feedbacks = [
  {
    text: "Sanal Kartvizit ile tüm kartvizit süreçlerimizi dijitalleştirdik. QR kod ve vCard entegrasyonu sayesinde müşterilerimize hızlıca ulaşabiliyoruz. Cloudinary entegrasyonu ile dosya yükleme ve paylaşım çok pratik.",
    name: "Zehra Türksoy",
    title: "SEO & ASO Takım Lideri",
    avatar: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
  },
  {
    text: "Serverless mimari ve modern arayüz sayesinde, ekibimiz her yerden güvenle erişim sağlıyor. Tüm sosyal medya ve iletişim bilgilerimizi tek bir linkte toplamak büyük kolaylık.",
    name: "Melih Yurduseven",
    title: "Büyüme Yöneticisi, Leke Games",
    avatar: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    text: "Vercel ve Supabase altyapısı ile hızlı, güvenli ve sürdürülebilir bir çözüm. Tüm dosya işlemlerinin Cloudinary ile yönetilmesi, projeyi rakiplerinden ayırıyor.",
    name: "Mengjie Gao",
    title: "ASO Strateji Direktörü, LinkDesks",
    avatar: "https://media.istockphoto.com/id/1682296067/photo/happy-studio-portrait-or-professional-man-real-estate-agent-or-asian-businessman-smile-for.jpg?s=612x612&w=0&k=20&c=9zbG2-9fl741fbTWw5fNgcEEe4ll-JegrGlQQ6m54rg="
  },
  {
    text: "Sunduğunuz altyapı sayesinde dijital kartvizit süreçlerimizi çok daha verimli ve profesyonel yönetiyoruz. Platformun tüm potansiyelini kullanmak işimizi büyüttü.",
    name: "Li'ang Bian",
    title: "Reklam Yöneticisi, IGG",
    avatar: "https://writestylesonline.com/wp-content/uploads/2018/11/Three-Statistics-That-Will-Make-You-Rethink-Your-Professional-Profile-Picture-1024x1024.jpg"
  },
];

export default function FeedbackCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', slidesToScroll: 1 });

  // Otomatik kaydırma
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  // 3'lü grid görünümü için slideWidth %33
  const slideClass =
    'embla__slide flex-shrink-0 w-full md:w-1/3 px-2';

  return (
    <section className="w-full py-20 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Mobil odaklı global şirketleri güçlendiriyoruz</h2>
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex -mx-2">
            {feedbacks.map((f, idx) => (
              <div key={idx} className={slideClass}>
                <div className="relative h-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col justify-between transition-all duration-300 hover:border-blue-400 hover:shadow-lg group cursor-pointer">
                  <p className="text-gray-700 text-base mb-8">{f.text}</p>
                  <div className="flex items-center gap-3 mt-auto relative">
                    <img src={f.avatar} alt={f.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-lg">{f.name}</span>
                      <span className="text-base text-gray-500">{f.title}</span>
                    </div>
                    <span className="flex-1" />
                    {/* Sağda büyük tırnak işareti (react-icons) */}
                    <FaQuoteLeft className="w-14 h-14 ml-4 -mr-2 text-gray-200 opacity-80" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 