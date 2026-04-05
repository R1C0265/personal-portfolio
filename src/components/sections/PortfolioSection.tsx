"use client";

import Image from "next/image";

const PROJECTS = [
  {
    title: "Waku Limited",
    category: "CRM + Website",
    description:
      "Full-stack website and CRM system for a Lilongwe-based poultry/agro dealer. Customer management, inventory tracking, and order processing.",
    tags: ["Next.js 14", "Prisma", "MySQL", "Tailwind"],
    image:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80&fit=crop",
    live: "#",
    status: "In Development",
  },
  {
    title: "QECH Donor Platform",
    category: "Healthcare / Non-profit",
    description:
      "Donor management platform for Queen Elizabeth Central Hospital. Tracks donations, campaigns, and donor communications.",
    tags: ["Next.js 14", "Node.js", "Cloudinary", "JWT"],
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80&fit=crop",
    live: "#",
    status: "In Development",
  },
  {
    title: "Davina Furnishers",
    category: "POS + Inventory",
    description:
      "Laravel-based furniture inventory and point-of-sale system with multi-image uploads, cashout flow, and sales reporting.",
    tags: ["Laravel", "Bootstrap", "MySQL", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop",
    live: "#",
    status: "In Development",
  },
  {
    title: "Trendy Threads",
    category: "E-Commerce + CMS",
    description:
      "E-commerce website and content management system for a retail fashion client with integrated inventory management and financial reporting.",
    tags: ["CMS", "E-Commerce", "MySQL", "JavaScript"],
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&fit=crop",
    live: "https://trendythreads.kesug.com",
  },
  {
    title: "Public Officers' Declarations",
    category: "Government Platform",
    description:
      "Government-compliant web platform for the Office of Director of Public Officers' Declarations with role-based authentication and encrypted data storage.",
    tags: ["Next.js", "JWT", "MySQL", "Encryption"],
    image:
      "https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=600&q=80&fit=crop",
    live: "https://declarations.gov.mw",
  },
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-3">
            Selected Work
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            Portfolio
          </h2>
          <div className="w-12 h-0.5 bg-blue-400 mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map(({ title, category, description, tags, image, live, status }) => (
            <div
              key={title}
              className="group bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 text-xs bg-blue-500/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {category}
                </span>
                {status && (
                  <span className="absolute top-3 right-3 text-xs bg-amber-500/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                    🚧 {status}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-blue-400/80 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {!status && (
                  <a
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    ↗ Visit Site
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
