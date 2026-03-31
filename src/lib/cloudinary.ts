// src/lib/cloudinary.ts
// In Next.js API routes, request bodies come as Web API FormData,
// not multer-processed req.file. We read the file buffer directly
// and stream it to Cloudinary using upload_stream.
// Multer is an Express middleware and cannot be used here.

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Upload a File (from FormData) to Cloudinary — returns the secure URL
export async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:         "waku-products",
        allowed_formats:["jpg", "jpeg", "png", "webp"],
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// Delete an image by its Cloudinary URL
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract public_id from URL: "waku-products/filename" (no extension)
    const parts    = imageUrl.split("/");
    const publicId = parts.slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn("[cloudinary] Failed to delete image:", err);
  }
}
