// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "ADMIN", "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  try {
    const formData    = await req.formData();
    const imageFile   = formData.get("image") as File | null;

    let imageUrl: string | undefined;
    if (imageFile && imageFile.size > 0) {
      // Delete old image from Cloudinary first
      const existing = await db.product.findUnique({ where: { id: params.id }, select: { imageUrl: true } });
      if (existing?.imageUrl) await deleteImage(existing.imageUrl);
      imageUrl = await uploadImage(imageFile);
    }

    const name        = formData.get("name")        as string | null;
    const description = formData.get("description") as string | null;
    const price       = formData.get("price")       as string | null;
    const category    = formData.get("category")    as string | null;
    const isAvailable = formData.get("isAvailable");
    const sortOrder   = formData.get("sortOrder")   as string | null;

    const product = await db.product.update({
      where: { id: params.id },
      data: {
        ...(name        && { name }),
        ...(description !== null && { description }),
        ...(price       && { price: parseInt(price) }),
        ...(category    && { category }),
        ...(imageUrl    && { imageUrl }),
        ...(isAvailable !== null && { isAvailable: isAvailable !== "false" }),
        ...(sortOrder   && { sortOrder: parseInt(sortOrder) }),
      },
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    if (err.code === "P2025") return NextResponse.json({ error: "Not found." }, { status: 404 });
    console.error("[products/PATCH]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, "SUPER_ADMIN");
  if (auth instanceof NextResponse) return auth;

  try {
    const product = await db.product.findUnique({ where: { id: params.id }, select: { imageUrl: true } });
    if (product?.imageUrl) await deleteImage(product.imageUrl);
    await db.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted." });
  } catch (err: any) {
    if (err.code === "P2025") return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
