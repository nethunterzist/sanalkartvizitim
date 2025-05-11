'use client';
import React, { useEffect, useRef } from "react";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaTelegramPlane, FaTiktok, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { SiX } from "react-icons/si";

const ICONS = [
  { icon: <FaInstagram size={32} color="#E1306C" />, name: "Instagram" },
  { icon: <SiX size={32} color="#000" />, name: "X" },
  { icon: <FaYoutube size={32} color="#FF0000" />, name: "YouTube" },
  { icon: <FaLinkedinIn size={32} color="#0A66C2" />, name: "LinkedIn" },
  { icon: <FaTiktok size={32} color="#000" />, name: "TikTok" },
  { icon: <FaWhatsapp size={32} color="#25d366" />, name: "WhatsApp" },
];

const BUBBLE_SIZE = 64;
const SPEED = 1.2;

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getNonOverlappingPositions(count: number, width: number, height: number, size: number) {
  const positions: { x: number; y: number }[] = [];
  let attempts = 0;
  while (positions.length < count && attempts < 1000) {
    const x = getRandom(size, width - size);
    const y = getRandom(size, height - size);
    let overlap = false;
    for (const pos of positions) {
      if (Math.hypot(pos.x - x, pos.y - y) < size + 8) {
        overlap = true;
        break;
      }
    }
    if (!overlap) {
      positions.push({ x, y });
    }
    attempts++;
  }
  // Eğer yeterli pozisyon bulunamazsa kalanları rastgele ekle
  while (positions.length < count) {
    positions.push({ x: getRandom(size, width - size), y: getRandom(size, height - size) });
  }
  return positions;
}

export default function SocialMediaBubbles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<any[]>([]);
  const animRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const positions = getNonOverlappingPositions(ICONS.length, width, height, BUBBLE_SIZE);
    const bubbles = ICONS.map((_, i) => ({
      x: positions[i].x,
      y: positions[i].y,
      dx: getRandom(-SPEED, SPEED),
      dy: getRandom(-SPEED, SPEED),
    }));
    bubblesRef.current = bubbles;

    function animate() {
      for (let i = 0; i < bubbles.length; i++) {
        let b = bubbles[i];
        b.x += b.dx;
        b.y += b.dy;
        // Kenarlardan sekme
        if (b.x < 0 || b.x > width - BUBBLE_SIZE) b.dx *= -1;
        if (b.y < 0 || b.y > height - BUBBLE_SIZE) b.dy *= -1;
        // Diğer balonlarla çarpışma
        for (let j = 0; j < bubbles.length; j++) {
          if (i === j) continue;
          let b2 = bubbles[j];
          let dist = Math.hypot(b.x - b2.x, b.y - b2.y);
          if (dist < BUBBLE_SIZE) {
            // Basit çarpışma: yön değiştir
            let tempDx = b.dx;
            let tempDy = b.dy;
            b.dx = b2.dx;
            b.dy = b2.dy;
            b2.dx = tempDx;
            b2.dy = tempDy;
          }
        }
      }
      // DOM'u güncelle
      for (let i = 0; i < bubbles.length; i++) {
        const el = document.getElementById(`bubble-${i}`);
        if (el) {
          el.style.transform = `translate(${bubbles[i].x}px, ${bubbles[i].y}px)`;
        }
      }
      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <section
      className="w-full flex justify-center items-center py-24 relative overflow-hidden"
      style={{
        background: `url('https://www.mobileaction.co/wp-content/uploads/2023/09/pattern-4-e1702641945183.png') center/cover no-repeat`,
        minHeight: 420,
      }}
    >
      <div className="absolute inset-0 bg-[#e8f0fe]/80 pointer-events-none" />
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[300px] mx-auto"
        style={{ zIndex: 2 }}
      >
        {ICONS.map((item, i) => (
          <div
            key={i}
            id={`bubble-${i}`}
            className="absolute flex items-center justify-center rounded-full shadow-lg"
            style={{
              width: BUBBLE_SIZE,
              height: BUBBLE_SIZE,
              background: '#fff',
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
              transition: 'box-shadow 0.2s',
              zIndex: 3,
              cursor: 'pointer',
            }}
            title={item.name}
          >
            {item.icon}
          </div>
        ))}
      </div>
      <h2 className="absolute top-10 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-bold text-[#1a2233] z-10 text-center">
        Tüm Sosyal Medya Hesaplarınızı Tek Platformda Yönetin
      </h2>
    </section>
  );
} 