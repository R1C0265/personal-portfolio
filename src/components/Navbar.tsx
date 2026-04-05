"use client";

import { useEffect, useState } from "react";
import { usePortfolioStore } from "@/store/portfolio";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { activeSection, setActiveSection } = usePortfolioStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // IntersectionObserver watches each section and fires a callback whenever
  // a section enters/exits the viewport. This is much more performant than
  // a scroll event listener + getBoundingClientRect() on every scroll event.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // threshold: 0.4 means the callback fires when 40% of the section is visible
      { threshold: 0.4 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));

    // Cleanup: always disconnect observers when the component unmounts
    // to prevent memory leaks.
    return () => observer.disconnect();
  }, [setActiveSection]);

  // Separate scroll listener just for the navbar background blur effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <a
          href="#home"
          className="text-white font-bold text-xl tracking-tight font-display"
        >
          Powered by <span className="text-blue-400">Palm Tech.</span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={label}>
                <a
                  href={href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {label}
                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-400 rounded-full" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5">
          <ul className="flex flex-col px-6 py-4 gap-2">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
