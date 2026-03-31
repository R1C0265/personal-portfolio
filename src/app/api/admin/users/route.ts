// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { createUserSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  const role = new URL(req.url).searchParams.get("role") || undefined;

  const users = await db.user.findMany({
    where:   role ? { role: role as any } : {},
    select: {
      id: true, email: true, firstName: true, lastName: true,
      phone: true, role: true, isActive: true, createdAt: true,
      _count: { select: { assignedLeads: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  const body   = await req.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { email, password, firstName, lastName, phone, role } = parsed.data;

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return NextResponse.json({ error: "Email already in use." }, { status: 409 });

  const hashed = await bcrypt.hash(password, 12);
  const user   = await db.user.create({
    data:   { email: email.toLowerCase(), password: hashed, firstName, lastName, phone: phone || null, role, createdById: auth.id },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
