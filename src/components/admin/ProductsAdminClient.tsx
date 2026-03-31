// src/components/admin/ProductsAdminClient.tsx
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Plus, Pencil, Trash2, ImageOff, Loader2, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

const schema = z.object({
  name:        z.string().min(2, "Required"),
  description: z.string().max(500).optional(),
  price:       z.coerce.number().int().min(1, "Enter a price"),
  category:    z.string().min(1, "Required"),
  isAvailable: z.boolean().optional(),
  sortOrder:   z.coerce.number().int().optional(),
});
type F = z.infer<typeof schema>;

const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 outline-none focus:border-waku-green focus:ring-2 focus:ring-waku-green/10 transition-all min-h-[52px]";

function ProductForm({ product, onClose }: { product?: Product; onClose: () => void }) {
  const qc = useQueryClient();
  const [imgFile, setImgFile]       = useState<File | null>(null);
  const [preview, setPreview]       = useState<string | null>(product?.imageUrl ?? null);
  const isEdit = !!product;

  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:        product?.name        ?? "",
      description: product?.description ?? "",
      price:       product?.price       ?? 0,
      category:    product?.category    ?? "",
      isAvailable: product?.isAvailable ?? true,
      sortOrder:   product?.sortOrder   ?? 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: F) => {
      // Use FormData so multer can receive the image file
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined) fd.append(k, String(v)); });
      if (imgFile) fd.append("image", imgFile);
      return isEdit
        ? api.patch("/products/" + product.id, fd)
        : api.post("/products", fd);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success(isEdit ? "Updated." : "Created."); onClose(); },
    onError:   () => toast.error("Failed to save product."),
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-display font-bold text-gray-900 text-lg">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="p-5 flex flex-col gap-5">
          {/* Image upload */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Product Image</label>
            <label className="block cursor-pointer">
              <div className={cn("w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors",
                preview ? "border-transparent" : "border-gray-200 hover:border-waku-green/50")}>
                {preview
                  ? <div className="relative w-full h-full"><Image src={preview} alt="Preview" fill className="object-cover" /></div>
                  : <div className="text-center text-gray-400"><ImageOff size={28} className="mx-auto mb-2 opacity-40" /><p className="text-sm">Tap to upload</p><p className="text-xs">JPG, PNG, WebP · max 5MB</p></div>
                }
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setImgFile(f);
                  setPreview(URL.createObjectURL(f));
                }} />
            </label>
            {preview && <button type="button" onClick={() => { setImgFile(null); setPreview(null); }} className="mt-2 text-xs text-red-500 font-medium">Remove image</button>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Product Name</label>
            <input {...register("name")} placeholder="e.g. 1 Day Old Chicks" className={cn(inp, errors.name && "border-red-300")} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <input {...register("category")} placeholder="e.g. Chicks" className={cn(inp, errors.category && "border-red-300")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Price (MWK)</label>
              <input {...register("price")} type="number" min={1} inputMode="numeric" className={cn(inp, errors.price && "border-red-300")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea {...register("description")} rows={3} className={cn(inp, "resize-none h-auto")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Display order</label>
              <input {...register("sortOrder")} type="number" min={0} className={inp} />
              <p className="text-xs text-gray-400">Lower = first</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Visibility</label>
              <label className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer min-h-[52px]">
                <input type="checkbox" {...register("isAvailable")} className="w-5 h-5 accent-waku-green" />
                <span className="text-sm text-gray-700">Show on site</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={mutation.isPending}
            className="w-full bg-waku-green text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 min-h-[52px] active:scale-[0.98] transition-all disabled:opacity-60 mt-1">
            {mutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function ProductsAdminClient() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProd, setEdit]     = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products", "admin"],
    queryFn:  async () => (await api.get("/products")).data.products,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      api.patch("/products/" + id, { isAvailable: String(!isAvailable) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
    onError:   () => toast.error("Failed to update."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete("/products/" + id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Deleted."); },
    onError:    () => toast.error("Failed to delete."),
  });

  return (
    <>
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 text-sm">Manage what appears on the public site</p>
          </div>
          <button onClick={() => { setEdit(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-waku-green text-white font-semibold px-4 py-2.5 rounded-xl text-sm min-h-[44px] active:scale-95 transition-all">
            <Plus size={16} /> Add
          </button>
        </div>

        {isLoading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse shadow-card" />)}</div>}

        <div className="space-y-3">
          {products?.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-card border border-gray-50 flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                {p.imageUrl
                  ? <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><ImageOff size={20} className="text-gray-300" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div><p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p><p className="text-xs text-gray-400">{p.category}</p></div>
                  <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                    p.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                    {p.isAvailable ? "Live" : "Hidden"}
                  </span>
                </div>
                <p className="font-display font-bold text-waku-green text-lg mt-1">{formatPrice(p.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => toggleMutation.mutate({ id: p.id, isAvailable: p.isAvailable })} disabled={toggleMutation.isPending}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 active:bg-gray-100 disabled:opacity-50">
                    {p.isAvailable ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
                  </button>
                  <button onClick={() => { setEdit(p); setShowForm(true); }}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 active:bg-gray-100">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => window.confirm("Delete \"" + p.name + "\"?") && deleteMutation.mutate(p.id)} disabled={deleteMutation.isPending}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5 active:bg-red-100 disabled:opacity-50">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && products?.length === 0 && (
          <div className="text-center py-16"><p className="text-gray-500 font-medium">No products yet</p></div>
        )}
      </div>

      {showForm && <ProductForm product={editProd ?? undefined} onClose={() => { setShowForm(false); setEdit(null); }} />}
    </>
  );
}
