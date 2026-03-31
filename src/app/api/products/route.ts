// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole, getAuthUser } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

// GET /api/products — public returns available only; admin returns all
export async function GET(req: NextRequest) {
  const user      = getAuthUser(req);
  const isAdmin   = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const products = await db.product.findMany({
    where:   isAdmin ? {} : { isAvailable: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ products });
}

// POST /api/products — admin only, accepts multipart/form-data
export async function POST(req: NextRequest) {
  const auth = requireRole(req, "ADMIN", "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  try {
    const formData    = await req.formData();
    const name        = formData.get("name")        as string;
    const description = formData.get("description") as string | null;
    const price       = formData.get("price")       as string;
    const category    = formData.get("category")    as string;
    const isAvailable = formData.get("isAvailable") !== "false";
    const sortOrder   = parseInt(formData.get("sortOrder") as string || "0");
    const imageFile   = formData.get("image")       as File | null;

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Name, price, and category are required." }, { status: 400 });
    }

    // Upload image if provided
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    const product = await db.product.create({
      data: {
        name, description: description || null,
        price: parseInt(price), category,
        imageUrl, isAvailable, sortOrder,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[products/POST]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
