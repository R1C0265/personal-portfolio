// src/components/admin/UsersClient.tsx
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Loader2, ShieldCheck, Shield, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { useAuthStore, useIsSuperAdmin } from "@/store/authStore";
import type { User } from "@/types";

const schema = z.object({
  email:     z.string().email("Valid email required"),
  password:  z.string().min(8, "Min 8 chars").regex(/[A-Z]/, "Need one uppercase").regex(/[0-9]/, "Need one number"),
  firstName: z.string().min(2, "Required"),
  lastName:  z.string().min(2, "Required"),
  phone:     z.string().optional(),
  role:      z.enum(["ADMIN", "SUPER_ADMIN"]),
});
type F = z.infer<typeof schema>;

const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 outline-none focus:border-waku-green focus:ring-2 focus:ring-waku-green/10 min-h-[52px]";

function CreateModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { role: "ADMIN" },
  });

  const mutation = useMutation({
    mutationFn: (d: F) => api.post("/admin/users", d),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Account created."); onClose(); },
    onError:    (e: any) => toast.error(e.response?.data?.error ?? "Failed to create user."),
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-display font-bold text-gray-900 text-lg">Create Staff Account</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {(["firstName", "lastName"] as const).map(f => (
              <div key={f} className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">{f === "firstName" ? "First name" : "Last name"}</label>
                <input {...register(f)} className={cn(inp, errors[f] && "border-red-300")} />
                {errors[f] && <p className="text-red-500 text-xs">{errors[f]?.message}</p>}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input {...register("email")} type="email" inputMode="email" autoCapitalize="none" className={cn(inp, errors.email && "border-red-300")} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
            <input {...register("phone")} type="tel" inputMode="tel" placeholder="0999 123 456" className={inp} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Temporary Password</label>
            <input {...register("password")} type="text" placeholder="Min 8 chars, 1 uppercase, 1 number" className={cn(inp, errors.password && "border-red-300")} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            <p className="text-xs text-gray-400">User should change this after first login</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(["ADMIN", "SUPER_ADMIN"] as const).map(r => (
                <label key={r} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl p-3 cursor-pointer has-[:checked]:border-waku-green has-[:checked]:bg-waku-green-50 transition-all min-h-[52px]">
                  <input type="radio" {...register("role")} value={r} className="w-4 h-4 accent-waku-green" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{r === "ADMIN" ? "Admin" : "Super Admin"}</p>
                    <p className="text-[11px] text-gray-500">{r === "ADMIN" ? "Manage leads" : "Full access"}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={mutation.isPending}
            className="w-full bg-waku-green text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 min-h-[52px] active:scale-[0.98] transition-all disabled:opacity-60 mt-2">
            {mutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function UsersClient() {
  const isSuperAdmin  = useIsSuperAdmin();
  const currentUser   = useAuthStore(s => s.user);
  const qc            = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn:  async () => (await api.get("/admin/users")).data.users as (User & { _count: { assignedLeads: number } })[],
    enabled:  isSuperAdmin,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.patch("/admin/users/" + id, { isActive: !isActive }),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
    onError:    () => toast.error("Failed to update."),
  });

  if (!isSuperAdmin) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <ShieldCheck size={48} className="text-gray-200 mb-4" />
      <p className="font-semibold text-gray-600 text-lg">Access Restricted</p>
      <p className="text-gray-400 text-sm mt-1">Only Super Admins can manage accounts.</p>
    </div>
  );

  return (
    <>
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Staff Accounts</h1>
            <p className="text-gray-500 text-sm">Manage CRM access for your team</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-waku-green text-white font-semibold px-4 py-2.5 rounded-xl text-sm min-h-[44px] active:scale-95 transition-all">
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
          {isLoading && [1,2,3].map(i => (
            <div key={i} className="flex gap-3 p-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2"><div className="h-4 bg-gray-100 rounded animate-pulse w-40" /><div className="h-3 bg-gray-100 rounded animate-pulse w-56" /></div>
            </div>
          ))}

          <div className="divide-y divide-gray-50">
            {data?.map(user => {
              const isMe = user.id === currentUser?.id;
              return (
                <div key={user.id} className={cn("flex items-center gap-3 p-4", !user.isActive && "opacity-50")}>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", user.isActive ? "bg-waku-green-50" : "bg-gray-100")}>
                    <span className={cn("text-sm font-bold", user.isActive ? "text-waku-green" : "text-gray-400")}>
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.firstName} {user.lastName}
                        {isMe && <span className="text-waku-gold text-xs font-normal ml-1">(you)</span>}
                      </p>
                      <span className={cn("flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border",
                        user.role === "SUPER_ADMIN" ? "bg-waku-green-50 text-waku-green border-waku-green/20" : "bg-blue-50 text-blue-700 border-blue-200")}>
                        {user.role === "SUPER_ADMIN" ? <ShieldCheck size={11} /> : <Shield size={11} />}
                        {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                      </span>
                      {!user.isActive && <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactive</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{user._count.assignedLeads} assigned · Joined {formatDate(user.createdAt)}</p>
                  </div>
                  {!isMe && (
                    <button onClick={() => toggleMutation.mutate({ id: user.id, isActive: user.isActive })} disabled={toggleMutation.isPending}
                      className={cn("flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 border transition-colors disabled:opacity-50 flex-shrink-0",
                        user.isActive ? "bg-red-50 border-red-100 text-red-600 active:bg-red-100" : "bg-emerald-50 border-emerald-100 text-emerald-700 active:bg-emerald-100")}>
                      {user.isActive ? <><UserX size={12} /> Disable</> : <><UserCheck size={12} /> Enable</>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {!isLoading && data?.length === 0 && <p className="text-gray-400 text-sm text-center py-10">No staff accounts yet</p>}
        </div>
      </div>

      {showForm && <CreateModal onClose={() => setShowForm(false)} />}
    </>
  );
}
