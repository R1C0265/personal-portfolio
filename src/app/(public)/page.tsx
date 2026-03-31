// src/app/(public)/page.tsx  →  renders at /
"use client";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, Mail, Shield, Truck, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const up = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } };

const CAT: Record<string, string> = {
  Chicks:  "bg-amber-50  border-amber-200",
  Growers: "bg-green-50  border-green-200",
  Layers:  "bg-orange-50 border-orange-200",
};

export default function HomePage() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["products", "public"],
    queryFn:  async () => (await api.get("/products/public")).data.products,
  });

  return (
    <>
      {/* HERO */}
      <section className="relative bg-waku-green overflow-hidden">
        <div aria-hidden className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/5" />
        <div aria-hidden className="absolute top-24 -left-16 w-40 h-40 rounded-full bg-waku-gold/10" />

        <div className="relative z-10 px-5 pt-10 pb-12">
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-4">

            <motion.span variants={up}
              className="inline-flex items-center gap-2 bg-waku-gold/20 text-waku-gold text-xs
                         font-semibold px-3 py-1.5 rounded-full border border-waku-gold/30 self-start">
              <span className="w-1.5 h-1.5 bg-waku-gold rounded-full animate-pulse" />
              Lilongwe · Area 49, Baghdad
            </motion.span>

            <motion.h1 variants={up} className="font-display text-white leading-[1.1]">
              <span className="block text-4xl font-bold">Your Trusted</span>
              <span className="block text-4xl font-bold text-waku-gold mt-1">Agro Dealer</span>
            </motion.h1>

            <motion.p variants={up} className="text-white/75 text-base leading-relaxed max-w-xs">
              Quality day-old chicks, growers &amp; layers. Mikolongwe &amp; Kuroiler breeds, direct from our farm.
            </motion.p>

            <motion.div variants={up} className="flex flex-col sm:flex-row gap-3 mt-1">
              <Link href="/order"
                className="flex items-center justify-center gap-2 bg-waku-gold text-waku-green-dark
                           font-semibold py-4 px-6 rounded-2xl min-h-[52px] active:scale-95 transition-all shadow-gold">
                Order Now <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <a href="https://wa.me/265999793842?text=Hello%20Waku%2C%20I%27d%20like%20to%20order"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/10 border border-white/20
                           text-white font-semibold py-4 px-6 rounded-2xl min-h-[52px] active:scale-95 transition-all">
                <MessageCircle size={18} /> WhatsApp
              </a>
            </motion.div>

            <motion.div variants={up} className="flex gap-2 mt-1 flex-wrap">
              {[{ label: "Day-old", price: 2300 }, { label: "4–6 wks", price: 3800 }, { label: "6 wks", price: 5900 }]
                .map(({ label, price }) => (
                  <div key={label} className="flex-1 min-w-[90px] bg-white/10 border border-white/15 rounded-xl p-3 text-center">
                    <p className="text-white/60 text-[11px] mb-0.5">{label}</p>
                    <p className="text-waku-gold font-display font-bold text-lg">{formatPrice(price)}</p>
                  </div>
                ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="px-4 py-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-waku-gold text-xs font-semibold uppercase tracking-widest mb-1">Available Now</p>
            <h2 className="font-display text-2xl text-waku-green font-bold">Our Stock</h2>
          </div>
          <Link href="/products" className="text-waku-green text-sm font-semibold underline underline-offset-2">View all</Link>
        </div>

        <div className="-mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
            {(products ?? [null, null, null]).map((p, i) =>
              p ? (
                <Link key={p.id} href="/products"
                  className={`flex-shrink-0 snap-start w-[190px] rounded-2xl p-4 border flex flex-col
                             justify-between min-h-[200px] active:scale-[0.97] transition-all
                             ${CAT[p.category] ?? "bg-gray-50 border-gray-200"}`}>
                  <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-white/60 self-start">{p.category}</span>
                  <div>
                    <h3 className="font-display font-bold text-waku-green text-base leading-tight mb-1">{p.name}</h3>
                    {p.description && <p className="text-gray-600 text-xs line-clamp-2">{p.description}</p>}
                  </div>
                  <p className="font-display font-bold text-2xl text-waku-green mt-2">{formatPrice(p.price)}</p>
                </Link>
              ) : (
                <div key={i} className="flex-shrink-0 snap-start w-[190px] h-[200px] bg-gray-100 rounded-2xl animate-pulse" />
              )
            )}
            <Link href="/products"
              className="flex-shrink-0 snap-start w-[130px] rounded-2xl border-2 border-dashed
                         border-waku-green/30 flex flex-col items-center justify-center gap-1
                         text-waku-green min-h-[200px] active:scale-[0.97] transition-all">
              <span className="text-3xl font-display font-bold">+</span>
              <span className="text-xs font-semibold text-center px-2">See all</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { Icon: Shield,  title: "Healthy Stock",   desc: "Vaccinated & sourced" },
            { Icon: Truck,   title: "Order & Collect", desc: "Call ahead, pick up" },
            { Icon: Package, title: "Quality Breeds",  desc: "Kuroiler & Mikolongwe" },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-3 shadow-card text-center border border-gray-50">
              <div className="w-8 h-8 bg-waku-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon size={15} className="text-waku-green" />
              </div>
              <p className="font-semibold text-waku-green text-[11px] leading-tight mb-0.5">{title}</p>
              <p className="text-gray-500 text-[10px] leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="px-4 pb-8">
        <div className="bg-waku-green rounded-3xl p-5 text-white">
          <p className="text-waku-gold font-semibold text-xs uppercase tracking-widest mb-1">Get in touch</p>
          <h2 className="font-display text-xl font-bold mb-4">Ready to order?</h2>
          <div className="flex flex-col gap-3">
            {[
              { href: "tel:+265999793842",                  Icon: Phone,          label: "Call us",   val: "+265 999 793 842" },
              { href: "https://wa.me/265999793842",         Icon: MessageCircle,  label: "WhatsApp",  val: "+265 999 793 842", ext: true },
              { href: "mailto:wakulimited3@gmail.com",      Icon: Mail,           label: "Email",     val: "wakulimited3@gmail.com" },
            ].map(({ href, Icon, label, val, ext }) => (
              <a key={label} href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3.5 border border-white/15 active:bg-white/20 transition-colors min-h-[56px]">
                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-waku-gold" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">{label}</p>
                  <p className="font-semibold text-sm">{val}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
