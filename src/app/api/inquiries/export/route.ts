// src/app/api/inquiries/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireRole(req, "ADMIN", "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  const status = new URL(req.url).searchParams.get("status") || undefined;

  const inquiries = await db.inquiry.findMany({
    where:   status ? { status: status as any } : {},
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });

  const headers = ["ID","Name","Email","Phone","Product","Quantity","Preferred Contact","Status","Date"];
  const rows    = inquiries.map(i => [
    i.id, i.customerName, i.customerEmail, i.customerPhone,
    i.product?.name ?? "", i.quantity ?? "", i.preferredContact,
    i.status, new Date(i.createdAt).toLocaleDateString("en-GB"),
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type":        "text/csv",
      "Content-Disposition": `attachment; filename="waku-inquiries-${Date.now()}.csv"`,
    },
  });
}
