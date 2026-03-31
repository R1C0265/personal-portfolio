import type { Metadata } from "next";
import { OrderClient } from "@/components/public/OrderClient";
export const metadata: Metadata = { title: "Place an Order" };
export default function OrderPage() { return <OrderClient />; }
