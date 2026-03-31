// src/components/public/OrderClient.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const schema = z.object({
  customerName:     z.string().min(2, "Enter your full name"),
  customerEmail:    z.string().email("Enter a valid email"),
  customerPhone:    z.string().regex(/^(\+265|0)[0-9]{9}$/, "Enter a valid Malawi number e.g. 0999 123 456"),
  productId:        z.string().optional(),
  quantity:         z.coerce.number().int().min(1).optional(),
  preferredContact: z.enum(["phone", "email", "whatsapp"]),
  message:          z.string().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900 outline-none focus:border-waku-green focus:ring-2 focus:ring-waku-green/10 transition-all min-h-[52px] appearance-none";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function OrderClient() {
  const [done, setDone] = useState(false);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products", "public"],
    queryFn:  async () => (await api.get("/products/public")).data.products,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { preferredContact: "phone" },
  });

  const mutation = useMutation({
    mutationFn: (d: FormData) => api.post("/inquiries", d),
    onSuccess:  () => { setDone(true); reset(); },
    onError:    () => toast.error("Something went wrong. Please call us directly."),
  });

  if (done) return (
    <div className="px-4 py-16 flex flex-col items-center text-center gap-5">
      <div className="w-20 h-20 bg-waku-green-50 rounded-full flex items-center justify-center">
        <CheckCircle size={40} className="text-waku-green" />
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold text-waku-green mb-2">Inquiry Sent!</h2>
        <p className="text-gray-600 text-base leading-relaxed max-w-xs">
          We&apos;ve received your request and will contact you shortly via your preferred method.
        </p>
      </div>
      <button onClick={() => setDone(false)}
        className="mt-2 bg-waku-green text-white font-semibold px-8 py-4 rounded-2xl min-h-[52px] active:scale-[0.98] transition-all w-full max-w-xs">
        Submit Another
      </button>
    </div>
  );

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <p className="text-waku-gold text-xs font-semibold uppercase tracking-widest mb-1">Get in touch</p>
        <h1 className="font-display text-3xl font-bold text-waku-green">Place an Order</h1>
        <p className="text-gray-500 text-sm mt-2">Fill in the form and we&apos;ll confirm with you directly.</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5">

        <Field label="Your full name" error={errors.customerName?.message}>
          <input {...register("customerName")} placeholder="e.g. John Banda"
            className={cn(inp, errors.customerName && "border-red-300")} />
        </Field>

        <Field label="Phone number" error={errors.customerPhone?.message}>
          <input {...register("customerPhone")} type="tel" inputMode="tel" placeholder="e.g. 0999 123 456"
            className={cn(inp, errors.customerPhone && "border-red-300")} />
        </Field>

        <Field label="Email address" error={errors.customerEmail?.message}>
          <input {...register("customerEmail")} type="email" inputMode="email" autoCapitalize="none"
            placeholder="you@example.com" className={cn(inp, errors.customerEmail && "border-red-300")} />
        </Field>

        <Field label="What are you interested in?">
          <div className="relative">
            <select {...register("productId")} className={cn(inp, "pr-10 bg-white")}>
              <option value="">— Select a product —</option>
              {products?.map(p => (
                <option key={p.id} value={p.id}>{p.name} — K{p.price.toLocaleString()}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </Field>

        <Field label="Quantity (birds)" error={errors.quantity?.message}>
          <input {...register("quantity")} type="number" min={1} inputMode="numeric" placeholder="e.g. 50"
            className={cn(inp, errors.quantity && "border-red-300")} />
        </Field>

        <Field label="How should we reach you?" error={errors.preferredContact?.message}>
          <div className="grid grid-cols-3 gap-2">
            {(["phone", "whatsapp", "email"] as const).map(m => (
              <label key={m}
                className="flex flex-col items-center justify-center gap-1.5 bg-white border border-gray-200
                           rounded-xl p-3 cursor-pointer has-[:checked]:border-waku-green has-[:checked]:bg-waku-green-50
                           transition-all min-h-[56px]">
                <input type="radio" {...register("preferredContact")} value={m} className="sr-only" />
                <span className="text-sm font-semibold text-gray-700 capitalize">{m}</span>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Message (optional)" error={errors.message?.message}>
          <textarea {...register("message")} rows={3} placeholder="Any special requests..."
            className={cn(inp, "resize-none h-auto")} />
        </Field>

        <button type="submit" disabled={mutation.isPending}
          className="w-full bg-waku-green text-white font-semibold py-4 rounded-2xl min-h-[56px]
                     flex items-center justify-center gap-2 active:scale-[0.98] transition-all
                     disabled:opacity-60 shadow-card-lg mt-2">
          {mutation.isPending
            ? <><Loader2 size={18} className="animate-spin" /> Submitting...</>
            : "Submit Order Request"}
        </button>

        <p className="text-center text-xs text-gray-400">
          Or call us: <a href="tel:+265999793842" className="text-waku-green font-semibold">+265 999 793 842</a>
        </p>
      </form>
    </div>
  );
}
