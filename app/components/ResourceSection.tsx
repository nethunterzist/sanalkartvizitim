"use client";
import Image from 'next/image';

const resources = [
  {
    image: '/img/resource1.png',
    title: 'ASO keyword cannibalization: Stop competing with yourself...',
    desc: '',
  },
  {
    image: '/img/resource2.png',
    title: 'Learn the full story behind every install with the iOS...',
    desc: '',
  },
  {
    image: '/img/resource3.png',
    title: 'Apple Ads brings major updates to its way of...',
    desc: '',
  },
];

export default function ResourceSection() {
  return (
    <section className="relative w-full py-24 flex flex-col items-center justify-center overflow-hidden">
      {/* Gradient arka plan doku */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-20%] top-[-20%] w-[60vw] h-[60vw] bg-gradient-to-br from-orange-100 via-white to-blue-100 rounded-full blur-3xl opacity-70" />
        <div className="absolute right-[-20%] bottom-[-20%] w-[70vw] h-[70vw] bg-gradient-to-tr from-blue-200 via-white to-orange-100 rounded-full blur-3xl opacity-60" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">Resources that you&apos;ll love</h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8 z-10">
        {resources.map((r, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 w-[320px] flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:border-blue-400 cursor-pointer">
            <div className="w-full h-40 relative mb-4 rounded-lg overflow-hidden">
              <Image src={r.image} alt={r.title} fill className="object-cover" />
            </div>
            <div className="w-full text-gray-800 font-medium text-base line-clamp-2 text-center">{r.title}</div>
          </div>
        ))}
      </div>
      <button className="px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-900 font-semibold shadow hover:bg-blue-50 transition">Browse All Articles</button>
    </section>
  );
} 