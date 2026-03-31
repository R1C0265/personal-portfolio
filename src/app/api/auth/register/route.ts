// src/app/api/auth/register/route.ts  — public customer self-registration
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const { email, password, firstName, lastName, phone } = parsed.data;

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: "Email already in use." }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await db.user.create({
      data: { email: email.toLowerCase(), password: hashed, firstName, lastName, phone: phone || null, role: "CUSTOMER" },
    });

    const payload = { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName };
    const token   = signToken(payload as any);
    const response = NextResponse.json({ user: payload }, { status: 201 });
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("[auth/register]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
