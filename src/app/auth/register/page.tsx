// src/app/auth/register/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterClient } from "@/components/auth/RegisterClient";
export const metadata: Metadata = { title: "Create Account" };
export default function RegisterPage() {
  return <Suspense><RegisterClient /></Suspense>;
}
