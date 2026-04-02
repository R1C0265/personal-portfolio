// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const payload = { id: user.id, email: user.email };
    const token   = signToken(payload);

    const response = NextResponse.json({ message: "Logged in.", user: payload });
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
