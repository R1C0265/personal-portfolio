// src/app/admin/layout.tsx
// Server Component — no hooks here, just structure.
// AuthHydrator handles the client-side session check.
import { AuthHydrator } from "@/components/layout/AuthHydrator";
import { AdminShell }   from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthHydrator />
      <AdminShell>{children}</AdminShell>
    </>
  );
}
