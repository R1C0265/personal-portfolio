// src/components/public/ProductsClient.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductsClient() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", "public"],
    queryFn:  async () => (await api.get("/products/public")).data.products,
  });

  const grouped = products?.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <p className="text-waku-gold text-xs font-semibold uppercase tracking-widest mb-1">What we offer</p>
        <h1 className="font-display text-3xl font-bold text-waku-green">Our Products</h1>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {grouped && Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-8">
          <h2 className="font-display text-lg font-bold text-waku-green mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-waku-gold rounded-full" />{cat}
          </h2>
          <div className="space-y-3">
            {items.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-card border border-gray-50 flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-waku-green-50 relative">
                  {p.imageUrl
                    ? <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={22} className="text-waku-green/30" />
                      </div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-waku-green text-base leading-tight">{p.name}</h3>
                  {p.description && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.description}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-display font-bold text-xl text-waku-green">{formatPrice(p.price)}</span>
                    <span className="text-xs text-gray-400">per bird</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Link href="/order"
        className="block w-full bg-waku-green text-white font-semibold text-center
                   py-4 rounded-2xl min-h-[52px] active:scale-[0.98] transition-all shadow-card-lg mt-4">
        Place an Order
      </Link>
    </div>
  );
}
