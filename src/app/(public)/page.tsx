import type { Metadata } from "next";
import { ProductsClient } from "@/components/public/ProductsClient";
export const metadata: Metadata = { title: "Home" };
export default function WakuHomePage() { return <ProductsClient />; }
