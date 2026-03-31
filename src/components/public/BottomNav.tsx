// src/components/public/BottomNav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, FileText, Info, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/",         label: "Home",     Icon: Home    },
  { href: "/products", label: "Products", Icon: Package },
  { href: "/order",    label: "Order",    Icon: FileText },
  { href: "/about",    label: "About",    Icon: Info    },
  { href: "/contact",  label: "Contact",  Icon: Phone   },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[60px] transition-colors",
                active ? "text-waku-green" : "text-gray-400"
              )}>
              <div className="relative">
                {active && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-waku-gold rounded-full" />
                )}
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={cn("text-[10px]", active ? "font-semibold" : "font-normal")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
