import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "waku-green":      "#1A4D2E",
        "waku-green-light":"#2A6B40",
        "waku-green-dark": "#0F2E1A",
        "waku-green-50":   "#EAF3E9",
        "waku-green-100":  "#C4DFC3",
        "waku-gold":       "#C9A84C",
        "waku-gold-light": "#D4B870",
        "waku-gold-50":    "#FAF3E0",
        "waku-cream":      "#FBF8F0",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "card":    "0 2px 12px rgba(26,77,46,0.08)",
        "card-lg": "0 8px 32px rgba(26,77,46,0.12)",
        "gold":    "0 4px 16px rgba(201,168,76,0.3)",
      },
      minHeight: { touch: "44px" },
      minWidth:  { touch: "44px" },
    },
  },
  plugins: [],
};
export default config;
