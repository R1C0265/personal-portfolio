"use client";

const EXPERIENCE = [
  {
    title: "Corporate Systems Administration Intern",
    period: "Oct 2024 – Sep 2025",
    company: "Electricity Supply Corporation of Malawi (ESCOM), Lilongwe",
    bullets: [
      "Supported enterprise IT infrastructure for 1,500+ concurrent users, maintaining 99.5% system uptime",
      "Configured Active Directory, DNS & DHCP for 1,500+ user accounts and network devices",
      "Deployed SCOM, SCCM & SCSM — prevented 3 cybersecurity breaches, achieved 100% patch compliance",
      "Administered Microsoft 365 (Exchange Online, SharePoint, Teams) and SQL Server / MySQL databases",
      "Developed 3+ PowerBI dashboards with MongoDB integration, cutting report generation time by 40%",
    ],
  },
  {
    title: "IT Specialist Intern",
    period: "Jun 2023 – May 2024",
    company: "Malawi Energy Regulatory Authority (MERA), Lilongwe",
    bullets: [
      "Migrated 5 enterprise servers from Windows Server 2012 to 2022, achieving 35% performance improvement",
      "Configured Active Directory for 200+ users and integrated 150+ CISCO IP phones with 98% uptime",
      "Managed SAGE Evolution ERP database with 100% data integrity and zero reporting errors",
      "Led digitization project converting 5,000+ physical records to searchable digital archive",
      "Developed SRS for ICT Geo-Mapping application procurement valued at $30,000",
    ],
  },
  {
    title: "Systems Developer (Part-Time Consultant)",
    period: "Jan 2023 – Present",
    company: "Palm Technologies Inc., Blantyre / Lilongwe",
    bullets: [
      "Architected government-compliant web platform for Office of Director of Public Officers' Declarations (declarations.gov.mw)",
      "Developed e-commerce website and CMS for retail client — trendythreads.kesug.com",
      "Implemented secure authentication and database encryption compliant with data protection regulations",
    ],
  },
  {
    title: "Technical Support Technician",
    period: "Oct 2024 – Nov 2024",
    company: "National Registration Bureau (NRB), Lilongwe",
    bullets: [
      "Diagnosed and resolved hardware/software failures on electoral registration equipment supporting 50,000+ citizens",
    ],
  },
];

const EDUCATION = [
  {
    title: "BSc Information and Communication Technology",
    period: "2019 – 2023",
    company: "Daeyang University, Lilongwe, Malawi",
    bullets: [
      "Specialization: Software Development and Database Systems",
      "Sociall Welfare Director in the Student Council",
    ],
  },
  {
    title: "Malawi School Certificate of Education (MSCE)",
    period: "2016",
    company: "Michiru View Secondary School, Blantyre",
    bullets: ["16 Points"],
  },
];

function TimelineItem({
  title, period, company, bullets,
}: {
  title: string; period: string; company: string; bullets: string[];
}) {
  return (
    <div className="relative pl-6 pb-10 last:pb-0">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
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
        <div className="text-center mb-16">
          <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-3">
            My Background
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            Resume
          </h2>
          <div className="w-12 h-0.5 bg-blue-400 mx-auto mt-4" />
          <p className="text-white/40 mt-4 max-w-xl mx-auto text-sm">
            BSc ICT graduate with 3+ years across enterprise infrastructure, systems administration, and full-stack development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Summary + Education */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">✦</div>
              <h3 className="text-xl font-bold text-white font-display">Summary</h3>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-8">
              <h4 className="text-white font-bold text-base mb-1">Eric Zitheka Kabambe</h4>
              <p className="text-blue-400 text-sm mb-3">Systems Engineer · Full Stack Developer</p>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                BSc ICT graduate with hands-on experience in enterprise IT infrastructure, Windows Server, Active Directory, virtualization, and full-stack web development. Operating under Palm Technologies.
              </p>
              <div className="flex flex-col gap-1.5">
                {["Blantyre / Lilongwe, Malawi", "+265 997 835 428", "ericzkabambe@gmail.com"].map((line) => (
                  <span key={line} className="text-white/40 text-sm">{line}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">◆</div>
              <h3 className="text-xl font-bold text-white font-display">Education</h3>
            </div>
            {EDUCATION.map((item) => (
              <TimelineItem key={item.title} {...item} />
            ))}
          </div>

          {/* Right: Experience */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">★</div>
              <h3 className="text-xl font-bold text-white font-display">Professional Experience</h3>
            </div>
            {EXPERIENCE.map((item) => (
              <TimelineItem key={item.title} {...item} />
            ))}
          </div>
        </div>

        <div className="text-center mt-14">
          <a
            href="/resume/Eric_Kabambe_CV_IT_Infrasctructure_Trainee.pdf"
            target="_blank"
            download
            className="inline-flex items-center gap-2 px-8 py-3 border border-blue-500/40 hover:border-blue-500 text-blue-400 hover:text-blue-300 font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 text-sm"
          >
            ↓ Download Full CV
          </a>
        </div>
      </div>
    </section>
  );
}
