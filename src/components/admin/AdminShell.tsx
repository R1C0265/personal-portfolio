// src/components/admin/AdminShell.tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  LayoutDashboard, MessageSquare, Users,
  Package, UserCog, LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore, useIsSuperAdmin } from "@/store/authStore";
import api from "@/lib/api";

const BASE_NAV = [
  { href: "/admin",           label: "Dashboard",  Icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "Inquiries",  Icon: MessageSquare },
  { href: "/admin/customers", label: "Customers",  Icon: Users },
  { href: "/admin/products",  label: "Products",   Icon: Package },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname     = usePathname();
  const router       = useRouter();
  const { user, logout } = useAuthStore();
  const isSuperAdmin = useIsSuperAdmin();

  const nav = isSuperAdmin ? [...BASE_NAV, { href: "/admin/users", label: "Users", Icon: UserCog }] : BASE_NAV;

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      logout();
      router.push("/auth/login");
      router.refresh();
    },
    onError: () => toast.error("Logout failed."),
  });

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const linkClass = (href: string, exact?: boolean) =>
    cn(
      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
      isActive(href, exact)
        ? "bg-waku-green text-white"
        : "text-gray-600 hover:bg-gray-100 active:bg-gray-100"
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 min-h-screen sticky top-0">
        <div className="p-5 border-b border-gray-100">
          <p className="font-display font-bold text-waku-green text-xl">WAKU</p>
          <p className="text-gray-400 text-xs tracking-widest uppercase">CRM Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ href, label, Icon, exact }) => (
            <Link key={href} href={href} className={linkClass(href, exact)}>
              <Icon size={18} />{label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-waku-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-waku-green text-xs font-bold">
                {user?.firstName[0]}{user?.lastName[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.role.replace("_", " ")}</p>
            </div>
          </div>
          <button onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-h-0">
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <p className="font-display font-bold text-waku-green text-lg leading-none">WAKU CRM</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-waku-green-50 rounded-full flex items-center justify-center">
              <span className="text-waku-green text-xs font-bold">
                {user?.firstName[0]}{user?.lastName[0]}
              </span>
            </div>
            <button onClick={() => logoutMutation.mutate()}
              className="p-2 text-red-500 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-[72px] md:pb-0 overflow-y-auto">
          {children}
        </main>

        {/* ── Mobile bottom tab bar ──────────────────────────────── */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex">
            {nav.map(({ href, label, Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link key={href} href={href}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[60px] transition-colors",
                    active ? "text-waku-green" : "text-gray-400"
                  )}>
                  <div className="relative">
                    {active && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-waku-gold rounded-full" />
                    )}
                    <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  </div>
                  <span className={cn("text-[10px]", active ? "font-semibold" : "font-normal")}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
