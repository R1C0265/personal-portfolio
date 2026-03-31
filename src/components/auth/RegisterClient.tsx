// src/components/auth/RegisterClient.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const schema = z.object({
  firstName: z.string().min(2, "Enter your first name"),
  lastName:  z.string().min(2, "Enter your last name"),
  email:     z.string().email("Enter a valid email"),
  phone:     z.string().regex(/^(\+265|0)[0-9]{9}$/, "Enter a valid Malawi number").optional().or(z.literal("")),
  password:  z.string().min(8, "At least 8 characters")
               .regex(/[A-Z]/, "Need one uppercase letter")
               .regex(/[0-9]/, "Need one number"),
});
type F = z.infer<typeof schema>;

const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900 outline-none focus:border-waku-green focus:ring-2 focus:ring-waku-green/10 transition-all min-h-[52px]";

export function RegisterClient() {
  const router  = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (d: F) => api.post("/auth/register", d),
    onSuccess: (res) => {
      setUser(res.data.user);
      toast.success("Account created!");
      router.push("/");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Registration failed.");
    },
  });

  return (
    <div className="min-h-screen bg-waku-cream flex flex-col">
      <div className="bg-waku-green pt-16 pb-10 px-6 text-center">
        <p className="font-display text-waku-gold text-2xl font-bold tracking-wide">WAKU</p>
        <p className="text-white/60 text-xs tracking-[0.2em] uppercase mt-0.5">Limited · Create Account</p>
      </div>

      <div className="flex-1 px-4 -mt-6">
        <div className="bg-white rounded-3xl shadow-card-lg p-6 max-w-sm mx-auto">
          <h1 className="font-display text-2xl font-bold text-waku-green mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-6">Track your orders and inquiry history</p>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {(["firstName", "lastName"] as const).map((f) => (
                <div key={f} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    {f === "firstName" ? "First name" : "Last name"}
                  </label>
                  <input {...register(f)} className={cn(inp, errors[f] && "border-red-300")} />
                  {errors[f] && <p className="text-red-500 text-xs">{errors[f]?.message}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Email address</label>
              <input {...register("email")} type="email" inputMode="email" autoCapitalize="none"
                placeholder="you@example.com"
                className={cn(inp, errors.email && "border-red-300")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input {...register("phone")} type="tel" inputMode="tel"
                placeholder="e.g. 0999 123 456" className={inp} />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input {...register("password")} type="password" placeholder="Min 8 chars, 1 uppercase, 1 number"
                className={cn(inp, errors.password && "border-red-300")} />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={mutation.isPending}
              className="w-full bg-waku-green text-white font-semibold py-4 rounded-2xl
                         flex items-center justify-center gap-2 min-h-[52px]
                         active:scale-[0.98] transition-all disabled:opacity-60 mt-2">
              {mutation.isPending
                ? <><Loader2 size={18} className="animate-spin" /> Creating account...</>
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-waku-green font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
