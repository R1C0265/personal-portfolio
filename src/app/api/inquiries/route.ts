// src/app/api/inquiries/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { inquirySchema } from "@/lib/validations";
import { sendInquiryNotification } from "@/lib/email";

// POST /api/inquiries — public, no auth required
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = inquirySchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => `${e.path.join(".")}: ${e.message}`);
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const { customerName, customerEmail, customerPhone, productId, quantity, preferredContact, message } = parsed.data;

    const existingUser = await db.user.findUnique({ where: { email: customerEmail.toLowerCase() } });

    const inquiry = await db.inquiry.create({
      data: {
        customerName,
        customerEmail: customerEmail.toLowerCase(),
        customerPhone,
        quantity:         quantity ?? null,
        preferredContact,
        message:          message ?? null,
        productId:        productId ?? null,
        customerId:       existingUser?.id ?? null,
        status:           "NEW",
      },
      include: { product: { select: { name: true, price: true } } },
    });

    // Fire-and-forget — don't await so customer gets fast response
    sendInquiryNotification(inquiry).catch(console.error);

    return NextResponse.json({ message: "Inquiry submitted. We'll be in touch soon!", inquiryId: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("[inquiries/POST]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// GET /api/inquiries — admin only
export async function GET(req: NextRequest) {
  const auth = requireRole(req, "ADMIN", "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const status      = searchParams.get("status") || undefined;
  const search      = searchParams.get("search")  || undefined;
  const page        = parseInt(searchParams.get("page")  || "1");
  const limit       = parseInt(searchParams.get("limit") || "20");
  const assignedToMe = searchParams.get("assignedToMe") === "true";
  const skip        = (page - 1) * limit;

  const where: any = {};
  if (status)       where.status       = status;
  if (assignedToMe) where.assignedToId = auth.id;
  if (search) {
    where.OR = [
      { customerName:  { contains: search } },
      { customerEmail: { contains: search } },
      { customerPhone: { contains: search } },
    ];
  }

  const [total, inquiries] = await Promise.all([
    db.inquiry.count({ where }),
    db.inquiry.findMany({
      where,
      skip,
      take:      limit,
      orderBy:   { createdAt: "desc" },
      include: {
        product:    { select: { name: true } },
        assignedTo: { select: { firstName: true, lastName: true } },
        _count:     { select: { notes: true } },
      },
    }),
  ]);

  return NextResponse.json({
    inquiries,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
