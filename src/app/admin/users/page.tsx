import type { Metadata } from "next";
import { UsersClient } from "@/components/admin/UsersClient";
export const metadata: Metadata = { title: "Staff Accounts" };
export default function UsersPage() { return <UsersClient />; }
