"use client";

import { useEffect, useState } from "react";

// The strings the typewriter cycles through
const TYPED_STRINGS = [
  "Full Stack Developer",
  "Freelancer",
  "Open Source Contributor",
  "Problem Solver",
];

// Custom hook that handles the typewriter logic.
// Extracting this into a hook keeps the component clean — the component
// only cares about WHAT to display, not HOW the animation works.
function useTypewriter(strings: string[], speed = 80, pause = 1800) {
  const [displayText, setDisplayText] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = strings[stringIndex];

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          // Still typing forward
          setDisplayText(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) {
            // Full string typed — pause then start deleting
            setTimeout(() => setDeleting(true), pause);
          } else {
            setCharIndex((c) => c + 1);
          }
        } else {
          // Deleting backward
          setDisplayText(current.slice(0, charIndex - 1));
          if (charIndex - 1 === 0) {
            // Fully deleted — move to next string
            setDeleting(false);
            setCharIndex(0);
            setStringIndex((i) => (i + 1) % strings.length);
          } else {
            setCharIndex((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed // Delete faster than type
    );

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, stringIndex, strings, speed, pause]);

  return displayText;
}

export default function HeroSection() {
  const displayText = useTypewriter(TYPED_STRINGS);

  // Unsplash Source API — returns a random photo matching the query.
  // Using ?sig= with a fixed number ensures the image stays consistent
  // across renders instead of changing on every page load.
  const heroImageUrl =
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1920&q=80&fit=crop";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with overlay */}
      {/* The layered divs create a dark gradient over the photo so text remains readable */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      />
      {/* Dark overlay — a semi-transparent gradient that's darkest at the bottom
          where the text sits, lighter at the top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/85" />

      {/* Subtle noise texture overlay for depth — pure CSS, no images needed */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Fade-in animation via Tailwind's animate-* + custom delay via style */}
        <div className="animate-fade-in">
          <p className="text-blue-400 text-sm font-medium tracking-[0.3em] uppercase mb-6">
            Welcome to my portfolio
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-display leading-none tracking-tight">
            I am{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Eric Kabambe
            </span>
          </h1>

          {/* Typewriter container — fixed height prevents layout shift as text changes */}
          <div className="h-10 flex items-center justify-center">
            <p className="text-xl md:text-2xl text-white/70 font-light">
              {displayText}
              {/* Blinking cursor */}
              <span className="inline-block w-0.5 h-6 bg-blue-400 ml-1 animate-pulse" />
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            <a
              href="#portfolio"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/30 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
