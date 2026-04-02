// prisma/seed.ts  — run with: npm run db:seed
import { PrismaClient, SkillCategory, ProficiencyLevel } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  const hashed = await bcrypt.hash("DevPortfolio2026!", 12);

  await db.user.upsert({
    where:  { email: "hello@erickabambe.dev" },
    update: {},
    create: {
      email:    "hello@erickabambe.dev",
      password: hashed,
    },
  });
  console.log("✅ Seeded admin user: hello@erickabambe.dev / DevPortfolio2026!");

  const projects = [
    {
      title: "Personal Portfolio Website",
      description: "A modern Next.js portfolio to showcase projects, blog posts, and skills.",
      longDescription: "Built with Next.js App Router, TypeScript, Prisma, Tailwind CSS, and Stripe for donations. Includes admin dashboard and authentication.",
      imageUrl: "https://placehold.co/800x600?text=Portfolio+Website",
      galleryImages: [
        "https://placehold.co/1200x800?text=Project+1",
        "https://placehold.co/1200x800?text=Project+2"
      ],
      technologies: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS", "Node.js"],
      liveUrl: "https://erickabambe.dev",
      githubUrl: "https://github.com/erickabambe/portfolio",
      featured: true,
      sortOrder: 1,
      startDate: new Date("2025-04-01"),
      endDate: null,
    },
    {
      title: "E-Commerce Headless API",
      description: "API for product catalog and checkout workflows built in Express and Prisma.",
      longDescription: "Designed scalable backend for modern e-commerce with JWT authentication and payment integration.",
      imageUrl: "https://placehold.co/800x600?text=E-Commerce+API",
      galleryImages: [],
      technologies: ["Node.js", "Express", "Prisma", "MySQL", "Postman"],
      liveUrl: null,
      githubUrl: "https://github.com/erickabambe/ecommerce-api",
      featured: false,
      sortOrder: 2,
      startDate: new Date("2024-10-01"),
      endDate: new Date("2025-02-28"),
    },
  ];

  for (const p of projects) {
    const existing = await db.project.findFirst({ where: { title: p.title } });
    if (!existing) {
      await db.project.create({ data: p });
      console.log(`✅ Project: ${p.title}`);
    }
  }

  const experiences = [
    {
      company: "Freelance",
      position: "Full Stack Developer",
      description: "Developed web applications for startups and small businesses using modern JavaScript stacks.",
      technologies: ["React", "Next.js", "Node.js", "Prisma", "PostgreSQL"],
      startDate: new Date("2023-06-01"),
      endDate: null,
      isCurrent: true,
      sortOrder: 1,
    },
    {
      company: "Tech Startup Co.",
      position: "Frontend Engineer",
      description: "Implemented UI features and performance improvements across a SaaS platform.",
      technologies: ["React", "TypeScript", "GraphQL", "Vite"],
      startDate: new Date("2021-01-01"),
      endDate: new Date("2023-05-31"),
      isCurrent: false,
      sortOrder: 2,
    },
  ];

  for (const e of experiences) {
    const existing = await db.experience.findFirst({ where: { company: e.company, position: e.position } });
    if (!existing) {
      await db.experience.create({ data: e });
      console.log(`✅ Experience: ${e.company} - ${e.position}`);
    }
  }

  const skills = [
    { name: "TypeScript", category: SkillCategory.FULL_STACK, proficiency: ProficiencyLevel.EXPERT, yearsOfExperience: 4, sortOrder: 1 },
    { name: "React", category: SkillCategory.FRONTEND, proficiency: ProficiencyLevel.EXPERT, yearsOfExperience: 4, sortOrder: 2 },
    { name: "Node.js", category: SkillCategory.BACKEND, proficiency: ProficiencyLevel.ADVANCED, yearsOfExperience: 5, sortOrder: 3 },
    { name: "Prisma", category: SkillCategory.DATABASE, proficiency: ProficiencyLevel.ADVANCED, yearsOfExperience: 3, sortOrder: 4 },
    { name: "Docker", category: SkillCategory.DEVOPS, proficiency: ProficiencyLevel.INTERMEDIATE, yearsOfExperience: 2, sortOrder: 5 },
  ];

  for (const s of skills) {
    const existing = await db.skill.findFirst({ where: { name: s.name } });
    if (!existing) {
      await db.skill.create({ data: s });
      console.log(`✅ Skill: ${s.name}`);
    }
  }

  const socialLinks = [
    { platform: "GitHub", url: "https://github.com/erickabambe", icon: "github", sortOrder: 1 },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/erickabambe", icon: "linkedin", sortOrder: 2 },
    { platform: "Twitter", url: "https://twitter.com/erickabambe", icon: "twitter", sortOrder: 3 },
  ];

  for (const social of socialLinks) {
    const existing = await db.socialLink.findFirst({ where: { platform: social.platform } });
    if (!existing) {
      await db.socialLink.create({ data: social });
      console.log(`✅ SocialLink: ${social.platform}`);
    }
  }

  console.log("✅ Seed complete.");
}

main().catch(console.error).finally(() => db.$disconnect());
