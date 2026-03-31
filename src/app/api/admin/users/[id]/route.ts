// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  if (params.id === auth.id) {
    const body = await req.json();
    if (body.isActive === false)
      return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 400 });
  }

  const { role, isActive, firstName, lastName, phone } = await req.json();

  try {
    const user = await db.user.update({
      where: { id: params.id },
      data: {
        ...(role      !== undefined && { role }),
        ...(isActive  !== undefined && { isActive }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName  !== undefined && { lastName }),
        ...(phone     !== undefined && { phone }),
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
    });
    return NextResponse.json({ user });
  } catch (err: any) {
    if (err.code === "P2025") return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
