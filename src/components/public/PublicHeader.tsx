// src/components/public/PublicHeader.tsx
"use client";
import Link from "next/link";
import { Phone } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 bg-waku-green shadow-md"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display font-bold text-waku-gold text-xl tracking-wide">WAKU</span>
          <span className="text-white/70 text-[10px] tracking-[0.2em] uppercase">Limited</span>
        </Link>
        <a href="tel:+265999793842"
          className="flex items-center gap-2 bg-waku-gold text-waku-green-dark font-semibold
                     px-4 py-2 rounded-full text-sm min-h-[44px] active:scale-95 transition-all shadow-gold">
          <Phone size={14} strokeWidth={2.5} /> Call Now
        </a>
      </div>
    </header>
  );
}
