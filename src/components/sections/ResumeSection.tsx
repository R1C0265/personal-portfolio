"use client";

// Static data defined outside the component.
// This is a standard pattern: keep data separate from rendering logic.
// If this were real, it'd come from a CMS or API — but for a portfolio,
// colocating the data in the file is fine and simpler than overengineering it.
const EXPERIENCE = [
  {
    title: "Full Stack Developer",
    period: "2022 – Present",
    company: "R1C0 Digital Solutions, Malawi",
    bullets: [
      "Built and deployed production CRM + website for Waku Limited (poultry/agro sector)",
      "Developing QECH Donor Platform for Queen Elizabeth Central Hospital",
      "Architected Next.js 14 / Prisma / MySQL stack across multiple client projects",
      "Mobile-first development optimized for Malawi's 3G/4G network conditions",
    ],
  },
  {
    title: "Systems Engineer Intern",
    period: "2021",
    company: "ESCOM, Lilongwe",
    bullets: [
      "Administered Linux-based infrastructure and internal network systems",
      "Documented system configurations and assisted in network troubleshooting",
    ],
  },
  {
    title: "IT Intern",
    period: "2020",
    company: "MERA / NRB",
    bullets: [
      "Supported ICT operations and internal helpdesk",
      "Gained hands-on experience with enterprise IT environments",
    ],
  },
];

const EDUCATION = [
  {
    title: "BSc Information & Communication Technology",
    period: "2019 – 2023",
    company: "Daeyang University, Malawi",
    bullets: [
      "Graduated with focus on software engineering and systems administration",
      "President of robotics and programming interest group",
    ],
  },
];

// A single timeline item — this component is purely presentational.
// Accepting typed props (instead of spreading an object) makes it clearer
// what data each item needs at the call site.
function TimelineItem({
  title,
  period,
  company,
  bullets,
}: {
  title: string;
  period: string;
  company: string;
  bullets: string[];
}) {
  return (
    <div className="relative pl-6 pb-10 last:pb-0">
      {/* Vertical line — the left border of each item creates the timeline track */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />

      {/* Circle node on the timeline */}
      <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-[#0f0f0f]" />

      <div>
        <h4 className="text-white font-semibold">{title}</h4>
        <div className="flex items-center gap-2 mt-1 mb-1">
          <span className="text-blue-400 text-xs font-mono bg-blue-500/10 px-2 py-0.5 rounded">
            {period}
          </span>
        </div>
        <p className="text-white/40 text-sm mb-3 italic">{company}</p>
        <ul className="flex flex-col gap-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
              {/* Custom bullet — a small blue dot instead of a default list marker */}
              <span className="mt-2 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ResumeSection() {
  return (
    <section id="resume" className="py-24 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-3">
            My Background
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            Resume
          </h2>
          <div className="w-12 h-0.5 bg-blue-400 mx-auto mt-4" />
          <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm">
            Three years of production experience building for real clients,
            with a foundation in ICT from Daeyang University.
          </p>
        </div>

        {/* Two-column layout — matches the Bootstrap template's side-by-side structure */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Summary + Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              {/* Section icon badge */}
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
                ✦
              </div>
              <h3 className="text-xl font-bold text-white font-display">Summary</h3>
            </div>

            {/* Summary card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-8">
              <h4 className="text-white font-bold text-base mb-1">Eric Kabambe</h4>
              <p className="text-blue-400 text-sm mb-3">R1C0 Digital Solutions</p>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Full-stack freelancer building production-grade web systems for
                Malawian businesses and international clients. Focused on Next.js,
                Node.js, and mobile-first performance.
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  "Blantyre / Lilongwe, Malawi",
                  "+265 xxx xxx xxx",
                  "eric@r1co.dev",
                ].map((line) => (
                  <span key={line} className="text-white/40 text-sm">
                    {line}
                  </span>
                ))}
              </div>
            </div>

            {/* Education timeline */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
                ◆
              </div>
              <h3 className="text-xl font-bold text-white font-display">Education</h3>
            </div>
            {EDUCATION.map((item) => (
              <TimelineItem key={item.title} {...item} />
            ))}
          </div>

          {/* Right: Experience */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
                ★
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Professional Experience
              </h3>
            </div>
            {EXPERIENCE.map((item) => (
              <TimelineItem key={item.title} {...item} />
            ))}
          </div>
        </div>

        {/* Download CTA */}
        <div className="text-center mt-14">
          <a
            href="/cv.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-3 border border-blue-500/40 hover:border-blue-500 text-blue-400 hover:text-blue-300 font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 text-sm"
          >
            ↓ Download Full CV
          </a>
        </div>
      </div>
    </section>
  );
}
