import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginClient } from "@/components/auth/LoginClient";
export const metadata: Metadata = { title: "Sign In" };
export default function LoginPage() {
  return (
    // useSearchParams() inside LoginClient requires a Suspense boundary in Next.js 14
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
