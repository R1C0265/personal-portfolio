// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "sonner";

// next/font self-hosts fonts — no external request at runtime.
// On slow 3G/4G connections this is a meaningful perf win.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:  "Waku Limited — Your Trusted Agro Dealer",
    template: "%s | Waku Limited",
  },
  description:
    "Quality day-old chicks, growers and layers in Lilongwe, Malawi. " +
    "Mikolongwe & Kuroiler breeds. Order by phone, WhatsApp or online.",
  keywords: ["chicks", "poultry", "Lilongwe", "Malawi", "agro dealer", "Kuroiler"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A4D2E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-waku-cream">
        <Providers>
          {children}
          <Toaster
            position="bottom-center"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                marginBottom: "80px", // clears mobile bottom nav
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
