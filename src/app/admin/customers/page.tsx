import type { Metadata } from "next";
import { CustomersClient } from "@/components/admin/CustomersClient";
export const metadata: Metadata = { title: "Customers" };
export default function CustomersPage() { return <CustomersClient />; }
