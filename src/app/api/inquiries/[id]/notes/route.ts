// src/app/api/inquiries/[id]/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "ADMIN", "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: "Note cannot be empty." }, { status: 400 });
  }

  const note = await db.note.create({
    data:    { content: content.trim(), inquiryId: params.id, authorId: auth.id },
    include: { author: { select: { firstName: true, lastName: true, role: true } } },
  });

  return NextResponse.json({ note }, { status: 201 });
}
