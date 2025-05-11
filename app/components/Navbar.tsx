"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const menuItems = [
  { label: 'Özellikler', href: '#sosyal-medya' },
  { label: 'QR Kod', href: '#banka' },
  { label: 'İletişim', href: '#iletisim' },
  { label: 'Diğer Bilgiler', href: '#diger-bilgiler' },
  { label: 'Destek', href: '#support' },
  { label: 'Giriş', href: '/login' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/">
          <span className="flex items-center gap-2 font-bold text-xl text-blue-900">
            <Image src="/img/logo.svg" alt="Logo" width={36} height={36} className="rounded-full" />
            Sanal Kartvizit
          </span>
        </Link>
        <div className="hidden md:flex gap-2 items-center">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="px-4 py-2 rounded transition font-medium text-gray-700 hover:text-blue-900">{item.label}</Link>
          ))}
        </div>
        <button className="md:hidden flex items-center" onClick={() => setOpen(!open)}>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow px-4 pb-3 flex flex-col gap-2 animate-fade-in">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="py-2 px-2 rounded text-gray-700 hover:text-blue-900">{item.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
} 