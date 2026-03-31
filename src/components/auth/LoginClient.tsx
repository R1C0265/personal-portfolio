// src/components/auth/LoginClient.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const schema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type F = z.infer<typeof schema>;

const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900 outline-none focus:border-waku-green focus:ring-2 focus:ring-waku-green/10 transition-all min-h-[52px]";

export function LoginClient() {
  const router      = useRouter();
  const params      = useSearchParams();
  const setUser     = useAuthStore((s) => s.setUser);
  const [show, setShow] = useState(false);

  const redirect = params.get("redirect") || "/admin";

  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (d: F) => api.post("/auth/login", d),
    onSuccess: (res) => {
      setUser(res.data.user);
      router.push(redirect);
      router.refresh(); // clears Next.js server-side cache so middleware re-reads cookie
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Invalid email or password.");
    },
  });

  return (
    <div className="min-h-screen bg-waku-cream flex flex-col">
      <div className="bg-waku-green pt-16 pb-10 px-6 text-center">
        <p className="font-display text-waku-gold text-2xl font-bold tracking-wide">WAKU</p>
        <p className="text-white/60 text-xs tracking-[0.2em] uppercase mt-0.5">Limited · Staff Portal</p>
      </div>

      <div className="flex-1 px-4 -mt-6">
        <div className="bg-white rounded-3xl shadow-card-lg p-6 max-w-sm mx-auto">
          <h1 className="font-display text-2xl font-bold text-waku-green mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm mb-6">Access the Waku CRM dashboard</p>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Email address</label>
              <input {...register("email")} type="email" inputMode="email" autoCapitalize="none"
                placeholder="you@example.com"
                className={cn(inp, errors.email && "border-red-300")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input {...register("password")} type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(inp, "pr-12", errors.password && "border-red-300")} />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={mutation.isPending}
              className="w-full bg-waku-green text-white font-semibold py-4 rounded-2xl
                         flex items-center justify-center gap-2 min-h-[52px]
                         active:scale-[0.98] transition-all disabled:opacity-60 mt-2">
              {mutation.isPending
                ? <><Loader2 size={18} className="animate-spin" /> Signing in...</>
                : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">Don&apos;t have an account?{" "}<a href="/auth/register" className="text-waku-green font-semibold">Create one</a></p>
        <p className="text-center text-xs text-gray-400 mt-3">
          Public site →{" "}
          <a href="/" className="text-waku-green font-semibold">wakulimited.com</a>
        </p>
      </div>
    </div>
  );
}
