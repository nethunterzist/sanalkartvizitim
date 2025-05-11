"use client";
import React, { useRef, useEffect } from "react";

const images = [
  "https://mobbin.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogin.991fa6c8.png&w=1920&q=75",
  "https://mobbin.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile.d7334f53.png&w=1920&q=75",
  "https://mobbin.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Faccount-setup.2b6b3e99.png&w=1920&q=75",
  "https://mobbin.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcheckout.ba9e44a5.png&w=1920&q=75",
  "https://mobbin.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubscription-paywall.e3ad5de9.png&w=1920&q=75",
  "https://mobbin.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsettings.9d0ddd46.png&w=1920&q=75"
];
const allImages = Array.from({ length: 20 }, (_, i) => images[i % images.length]);

export default function HeroCarousel() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    let pos = 0;
    const speed = 0.5; // Hızı burada ayarlayabilirsin (daha küçük daha yavaş)
    const animate = () => {
      if (marqueeRef.current) {
        pos -= speed;
        // Sonsuz döngü için: toplam genişliğin yarısı kadar kayınca başa sar
        const totalWidth = marqueeRef.current.scrollWidth / 2;
        if (Math.abs(pos) >= totalWidth) {
          pos = 0;
        }
        marqueeRef.current.style.transform = `translateX(${pos}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="w-full flex justify-center items-center p-0 m-0 overflow-hidden select-none">
      <div className="overflow-hidden w-full py-4" style={{ background: "transparent" }}>
        <div
          ref={marqueeRef}
          className="flex gap-0"
          style={{ willChange: "transform", transition: "none" }}
        >
          {[...allImages, ...allImages].map((src, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{
                width: "220px",
                height: "420px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={src}
                alt={`App Mockup ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none", pointerEvents: "none" }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 