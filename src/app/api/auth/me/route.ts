// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const user = await db.user.findUnique({
    where:  { id: auth.id },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    const res = NextResponse.json({ error: "Account not found." }, { status: 401 });
    res.cookies.delete("token");
    return res;
  }

  return NextResponse.json({ user });
}
