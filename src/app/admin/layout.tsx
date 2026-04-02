// src/app/admin/layout.tsx
import { Providers }    from "@/components/layout/Providers";
import { AuthHydrator } from "@/components/layout/AuthHydrator";
import { AdminShell }   from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AuthHydrator />
      <AdminShell>{children}</AdminShell>
    </Providers>
  );
}
