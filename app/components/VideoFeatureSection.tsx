import React from "react";
import { FaPlay } from "react-icons/fa";

const videoData = [
  {
    src: "https://bytescale.mobbin.com/FW25bBB/video/assets/videos/lp_flow_video_demo_v1.mp4?mute=true&f=mp4-h264&a=%2Fvideo.mp4&w=500&sh=90&q=6",
    title: "Dijital Kartvizit Oluştur",
    desc: "Kendi dijital kartvizitini saniyeler içinde oluştur, kişisel ve kurumsal bilgilerini ekle."
  },
  {
    src: "https://bytescale.mobbin.com/FW25bBB/video/assets/videos/lp_prototype_demo_v1.mp4?mute=true&f=mp4-h264&a=%2Fvideo.mp4&w=500&sh=90&q=6",
    title: "Tüm Sosyal Medya ve İletişim Bilgileri",
    desc: "Instagram, X, LinkedIn, WhatsApp ve tüm iletişim kanallarını tek bir kartta topla."
  },
  {
    src: "https://bytescale.mobbin.com/FW25bBB/video/assets/videos/lp_flow_video_demo_v1.mp4?mute=true&f=mp4-h264&a=%2Fvideo.mp4&w=500&sh=90&q=6",
    title: "QR Kod ile Kolay Paylaşım",
    desc: "Kartvizitini QR kod veya kısa link ile anında paylaş, hızlıca rehbere eklet."
  },
  {
    src: "https://bytescale.mobbin.com/FW25bBB/video/assets/videos/lp_prototype_demo_v1.mp4?mute=true&f=mp4-h264&a=%2Fvideo.mp4&w=500&sh=90&q=6",
    title: "Dosya ve Katalog Yükleme",
    desc: "Firma logonu, profil fotoğrafını ve PDF kataloglarını güvenle yükle, her yerden eriş."
  }
];

export default function VideoFeatureSection() {
  return (
    <section id="banka" className="w-full flex flex-col justify-center items-center py-20 bg-transparent">
      <h2 className="text-3xl md:text-5xl font-bold text-center mt-12 md:mt-20 mb-16 text-gray-900">
        Dijital kartvizit ile tüm iletişim ve tanıtım kanallarını <span className="text-[#5b6fff]">tek platformda birleştir, hızlıca paylaş!</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl mx-auto px-2 md:px-4">
        {videoData.map((video, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-[#f7f7f7] rounded-3xl shadow-sm p-14"
            style={{ width: 480, minHeight: 600 }}
          >
            <div className="w-[230px] h-[450px] flex items-center justify-center mb-10 rounded-2xl overflow-hidden">
              <video
                src={video.src}
                width={230}
                height={450}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                className="rounded-2xl object-cover pointer-events-none select-none"
                style={{ background: '#000' }}
              />
            </div>
            <div className="w-full text-center">
              <div className="font-semibold text-lg text-gray-900 mb-2">{video.title}</div>
              <div className="text-gray-500 text-base leading-tight">{video.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 