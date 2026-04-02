"use client";

const SERVICES = [
  {
    icon: "⬡",
    title: "Full Stack Web Apps",
    description:
      "End-to-end web applications using Next.js 14, Node.js, and Prisma. From database schema to deployed product.",
  },
  {
    icon: "◈",
    title: "CRM & Business Systems",
    description:
      "Custom CRM systems, inventory management, and internal tools tailored to your business workflows.",
  },
  {
    icon: "◎",
    title: "API Design & Integration",
    description:
      "RESTful APIs, third-party integrations (payment gateways, Cloudinary, etc.), and backend architecture.",
  },
  {
    icon: "◉",
    title: "Mobile-First UI",
    description:
      "Responsive interfaces built for Malawi's mobile-dominant market. Fast on 3G, beautiful everywhere.",
  },
  {
    icon: "⬟",
    title: "Linux & DevOps",
    description:
      "Server setup, deployment pipelines, domain/SSL configuration, and ongoing maintenance.",
  },
  {
    icon: "◫",
    title: "Tech Consulting",
    description:
      "Stack advice, code reviews, architecture planning, and helping businesses make smart technology decisions.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-3">
            What I Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            Services
          </h2>
          <div className="w-12 h-0.5 bg-blue-400 mx-auto mt-4" />
        </div>

        {/* 3-column grid on desktop, 1 on mobile */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ icon, title, description }) => (
            <div
              key={title}
              className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-blue-500/30 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-2xl mb-5 group-hover:bg-blue-500/20 transition-colors">
                {icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{description}</p>

              {/* Corner accent — a small decorative detail that appears on hover */}
              <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500/60 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
