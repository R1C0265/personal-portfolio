// src/lib/db.ts
// Prisma client singleton.
// Next.js hot-reload creates new module instances on each save — without this
// pattern you'd exhaust MySQL connections within minutes of development.
// globalThis persists across hot reloads so we reuse the same client instance.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
