// src/app/api/inquiries/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "ADMIN", "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  const inquiry = await db.inquiry.findUnique({
    where:   { id: params.id },
    include: {
      product:    true,
      customer:   { select: { id: true, email: true, firstName: true, lastName: true } },
      assignedTo: { select: { id: true, firstName: true, lastName: true } },
      notes: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { firstName: true, lastName: true, role: true } } },
      },
    },
  });

  if (!inquiry) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ inquiry });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "ADMIN", "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { status, assignedToId } = await req.json();

  try {
    const updated = await db.inquiry.update({
      where: { id: params.id },
      data: {
        ...(status       !== undefined && { status }),
        ...(assignedToId !== undefined && { assignedToId }),
      },
      include: {
        product:    { select: { name: true } },
        assignedTo: { select: { firstName: true, lastName: true } },
      },
    });
    return NextResponse.json({ inquiry: updated });
  } catch (err: any) {
    if (err.code === "P2025") return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  try {
    await db.inquiry.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err: any) {
    if (err.code === "P2025") return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
