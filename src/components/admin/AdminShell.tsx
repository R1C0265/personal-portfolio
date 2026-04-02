"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, Mail, LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const NAV = [
  { href: "/admin",          label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects",  Icon: FolderKanban },
  { href: "/admin/messages", label: "Messages",  Icon: Mail },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname        = usePathname();
  const router          = useRouter();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      router.push("/auth/login");
      router.refresh();
    } catch {
      toast.error("Logout failed.");
    }
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const linkClass = (href: string, exact?: boolean) =>
    cn(
      "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
      isActive(href, exact)
        ? "bg-blue-500 text-white"
        : "text-white/50 hover:text-white hover:bg-white/5"
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-[#111] border-r border-white/5 min-h-screen sticky top-0">
        <div className="p-5 border-b border-white/5">
          <p className="font-display font-bold text-white text-xl">
            Dev<span className="text-blue-400">Folio</span>
          </p>
          <p className="text-white/30 text-xs tracking-widest uppercase mt-0.5">Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, Icon, exact }) => (
            <Link key={href} href={href} className={linkClass(href, exact)}>
              <Icon size={18} />{label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <p className="text-xs text-white/30 px-3 py-1 truncate">{user?.email}</p>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       text-red-400 hover:bg-red-500/10 transition-colors mt-1">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-col flex-1 min-h-0">
        <header className="md:hidden sticky top-0 z-40 bg-[#111] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <p className="font-display font-bold text-white text-lg">
            Dev<span className="text-blue-400">Folio</span>
          </p>
          <button onClick={handleLogout} className="p-2 text-red-400">
            <LogOut size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/5"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <div className="flex">
            {NAV.map(({ href, label, Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link key={href} href={href}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[60px] transition-colors",
                    active ? "text-blue-400" : "text-white/30"
                  )}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
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
