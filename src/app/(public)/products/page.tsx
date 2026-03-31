import type { Metadata } from "next";
import { ProductsClient } from "@/components/public/ProductsClient";
export const metadata: Metadata = { title: "Products" };
export default function ProductsPage() { return <ProductsClient />; }
