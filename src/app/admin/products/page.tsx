import type { Metadata } from "next";
import { ProductsAdminClient } from "@/components/admin/ProductsAdminClient";
export const metadata: Metadata = { title: "Products" };
export default function ProductsAdminPage() { return <ProductsAdminClient />; }
