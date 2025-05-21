"use client";
import React, { useRef, useEffect } from "react";

const images = [
  "https://furkanyigit.com/sanal/1.jpg",
  "https://furkanyigit.com/sanal/2.jpg",
  "https://furkanyigit.com/sanal/3.jpg",
  "https://furkanyigit.com/sanal/4.jpg",
  "https://furkanyigit.com/sanal/5.jpg",
  "https://furkanyigit.com/sanal/6.jpg"
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