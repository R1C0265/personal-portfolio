"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SKILLS = [
  { label: "Next.js / React", level: 90 },
  { label: "Node.js / Express", level: 85 },
  { label: "TypeScript", level: 80 },
  { label: "Prisma / MySQL", level: 75 },
  { label: "Tailwind CSS", level: 95 },
  { label: "Linux / DevOps", level: 65 },
];

// SkillBar is a small presentational sub-component.
// Splitting it out keeps the parent clean and makes each bar independently testable.
// The animation trick here uses CSS transitions: we start the bar at width 0,
// then set the real width once the section is visible. This creates a smooth
// "fill" animation on scroll-into-view.
function SkillBar({
  label,
  level,
  animate,
}: {
  label: string;
  level: number;
  animate: boolean;
}) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <span className="text-sm text-blue-400 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
          // The style prop is used here (rather than a Tailwind class) because
          // the width value is dynamic. Tailwind purges unused classes at build
          // time, so dynamic values like `w-[${level}%]` won't always work
          // reliably without safelist configuration.
          style={{ width: animate ? `${level}%` : "0%" }}
        />
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // We use IntersectionObserver again here — but this time to trigger the
  // skill bar animation once (and only once) when the section scrolls into view.
  // { once: true } is achieved by disconnecting after the first intersection.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 bg-[#0f0f0f]"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-3">
            Who I Am
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            About Me
          </h2>
          <div className="w-12 h-0.5 bg-blue-400 mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Profile Card + Skills */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            {/* Profile */}
            <div className="flex items-center gap-5 mb-8 pb-8 border-b border-white/10">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-2 ring-blue-500/30 flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop&crop=face"
                  alt="Eric Kabambe"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Eric Kabambe</h3>
                <p className="text-blue-400 text-sm">Full Stack Developer</p>
                <p className="text-white/40 text-xs mt-1">Malawi 🇲🇼</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 gap-3 mb-8 pb-8 border-b border-white/10">
              {[
                { label: "Email", value: "eric@r1co.dev" },
                { label: "Phone", value: "+265 xxx xxx xxx" },
                { label: "Location", value: "Blantyre, Malawi" },
                { label: "Profile", value: "R1C0 Digital Solutions" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <span className="text-white/40 text-sm w-20 flex-shrink-0">
                    {label}:
                  </span>
                  <span className="text-white/80 text-sm">{value}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">
                Skills
              </h4>
              <div className="flex flex-col gap-5">
                {SKILLS.map((skill) => (
                  <SkillBar key={skill.label} {...skill} animate={hasAnimated} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: About Text */}
          <div className="flex flex-col justify-center gap-6">
            <h3 className="text-2xl font-bold text-white font-display">
              Building digital products for{" "}
              <span className="text-blue-400">Malawi and beyond</span>
            </h3>

            <p className="text-white/60 leading-relaxed">
              I&apos;m a freelance full-stack developer operating under{" "}
              <strong className="text-white/80">R1C0 Digital Solutions</strong>.
              With ~3 years of hands-on experience across web development and
              systems administration, I build fast, mobile-first applications
              tailored to real business needs.
            </p>

            <p className="text-white/60 leading-relaxed">
              My stack centers on{" "}
              <strong className="text-white/80">Next.js 14, Node.js, Prisma, and MySQL</strong> —
              proven in production across clients like Waku Limited and Queen
              Elizabeth Central Hospital. I care deeply about code quality,
              performance on 3G/4G networks, and building systems that actually
              get used.
            </p>

            <p className="text-white/60 leading-relaxed">
              Longer term, I&apos;m transitioning R1C0 Digital Solutions into a SaaS
              business — targeting a Malawian market I know is underserved.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: "3+", label: "Years Exp." },
                { value: "10+", label: "Projects" },
                { value: "5+", label: "Clients" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="text-center bg-white/[0.03] border border-white/10 rounded-xl p-4"
                >
                  <div className="text-3xl font-bold text-blue-400 font-display">
                    {value}
                  </div>
                  <div className="text-white/40 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <a
                href="#contact"
                className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5"
              >
                Hire Me
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                className="px-6 py-2.5 border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
