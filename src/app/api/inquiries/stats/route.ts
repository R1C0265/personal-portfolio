// src/app/api/inquiries/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "ADMIN", "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  const now          = new Date();
  const startOfWeek  = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [total, newThisWeek, byStatus] = await Promise.all([
    db.inquiry.count(),
    db.inquiry.count({ where: { createdAt: { gte: startOfWeek } } }),
    db.inquiry.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const statusBreakdown = Object.fromEntries(
    byStatus.map(s => [s.status, s._count.status])
  );

  return NextResponse.json({ total, newThisWeek, statusBreakdown });
}
