// src/app/(public)/layout.tsx
// Route group (public) — the parentheses mean this folder doesn't add a URL segment.
// All pages inside share this layout: sticky header + fixed bottom nav.
import { PublicHeader } from "@/components/public/PublicHeader";
import { BottomNav }    from "@/components/public/BottomNav";
import { AuthHydrator } from "@/components/layout/AuthHydrator";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthHydrator />
      <PublicHeader />
      <main className="has-bottom-nav">{children}</main>
      <BottomNav />
    </>
  );
}
