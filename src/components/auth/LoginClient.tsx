"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { loginSchema } from "@/lib/validations";

type F = z.infer<typeof loginSchema>;

export function LoginClient() {
  const router   = useRouter();
  const params   = useSearchParams();
  const setUser  = useAuthStore((s) => s.setUser);
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);

  const redirect = params.get("redirect") || "/admin";

  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: F) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Invalid email or password.");
      setUser(json.user);
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inp = "w-full bg-white border border-gray-700 rounded-xl px-4 py-3.5 text-base text-white bg-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[52px]";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white font-display">
            Dev<span className="text-blue-400">Folio</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">Admin access only</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Email</label>
            <input {...register("email")} type="email" inputMode="email" autoCapitalize="none"
              placeholder="you@example.com"
              className={`${inp} ${errors.email ? "border-red-500" : ""}`} />
            {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Password</label>
            <div className="relative">
              <input {...register("password")} type={show ? "text" : "password"}
                placeholder="••••••••"
                className={`${inp} pr-12 ${errors.password ? "border-red-500" : ""}`} />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white/70">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3.5 rounded-xl
                       flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
