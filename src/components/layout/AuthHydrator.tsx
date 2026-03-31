// src/components/layout/AuthHydrator.tsx
// A tiny client component whose only job is to call useAuth().
// We can't call hooks in Server Components (layouts), so we isolate
// the hook call here and render it as a child.
"use client";
import { useAuth } from "@/hooks/useAuth";

export function AuthHydrator() {
  useAuth();
  return null; // renders nothing — side-effect only
}
