// src/components/admin/InquiryDetailClient.tsx
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Phone, Mail, MessageCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { STATUS_CONFIG, formatDate, formatRelative, cn } from "@/lib/utils";
import type { Inquiry, InquiryStatus } from "@/types";

const STATUSES = ["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

export function InquiryDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const qc     = useQueryClient();
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery<{ inquiry: Inquiry }>({
    queryKey: ["inquiry", id],
    queryFn:  async () => (await api.get("/inquiries/" + id)).data,
  });

  const statusMutation = useMutation({
    mutationFn: (status: InquiryStatus) => api.patch("/inquiries/" + id, { status }),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ["inquiry", id] });
      qc.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Status updated.");
    },
    onError: () => toast.error("Failed to update status."),
  });

  const noteMutation = useMutation({
    mutationFn: () => api.post("/inquiries/" + id + "/notes", { content: note }),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ["inquiry", id] });
      setNote("");
      toast.success("Note added.");
    },
    onError: () => toast.error("Failed to add note."),
  });

  if (isLoading) return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  if (!data?.inquiry) return <div className="p-4 text-center text-gray-500">Inquiry not found.</div>;

  const inq = data.inquiry;
  const cfg = STATUS_CONFIG[inq.status];

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 text-sm mb-5 -ml-1 min-h-[44px]">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 mb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-waku-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-waku-green font-bold text-lg">{inq.customerName[0].toUpperCase()}</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-gray-900 text-xl">{inq.customerName}</h1>
              <p className="text-gray-500 text-xs">{formatDate(inq.createdAt)}</p>
            </div>
          </div>
          <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border flex-shrink-0", cfg.className)}>
            {cfg.label}
          </span>
        </div>

        {/* Contact links */}
        <div className="flex flex-wrap gap-2 mb-4">
          <a href={"tel:" + inq.customerPhone}
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-2 text-sm font-medium text-gray-700 active:bg-gray-100">
            <Phone size={13} className="text-waku-green" /> {inq.customerPhone}
          </a>
          <a href={"mailto:" + inq.customerEmail}
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-2 text-sm font-medium text-gray-700 active:bg-gray-100">
            <Mail size={13} className="text-blue-500" /> Email
          </a>
          <a href={"https://wa.me/" + inq.customerPhone.replace(/\D/g, "")} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-2 text-sm font-medium text-gray-700 active:bg-gray-100">
            <MessageCircle size={13} className="text-green-600" /> WhatsApp
          </a>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {[
            { label: "Product",           value: inq.product?.name ?? "Not specified" },
            { label: "Quantity",          value: inq.quantity ? inq.quantity + " birds" : "Not specified" },
            { label: "Preferred contact", value: inq.preferredContact },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="text-gray-400 w-36 flex-shrink-0">{label}</span>
              <span className="text-gray-900 font-medium capitalize">{value}</span>
            </div>
          ))}
          {inq.message && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Message</p>
              <p className="text-sm text-gray-700 leading-relaxed">{inq.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status update */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-50 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Update Status</p>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map(s => {
            const c = STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => statusMutation.mutate(s)}
                disabled={inq.status === s || statusMutation.isPending}
                className={cn(
                  "py-2.5 px-3 rounded-xl text-sm font-medium border transition-all",
                  inq.status === s ? cn(c.className, "cursor-default") : "bg-white border-gray-200 text-gray-600 active:bg-gray-50 disabled:opacity-50"
                )}>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-50">
        <div className="p-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Notes ({inq.notes?.length ?? 0})</h2>
        </div>

        <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
          {(!inq.notes || inq.notes.length === 0) && (
            <p className="text-gray-400 text-sm text-center py-6">No notes yet</p>
          )}
          {inq.notes?.map(n => (
            <div key={n.id} className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-waku-green">
                  {n.author.firstName} {n.author.lastName}
                </span>
                <span className="text-[11px] text-gray-400">{formatRelative(n.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{n.content}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-50">
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Add an internal note..." rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm
                       outline-none focus:border-waku-green focus:ring-2 focus:ring-waku-green/10 resize-none" />
          <button onClick={() => noteMutation.mutate()} disabled={!note.trim() || noteMutation.isPending}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-waku-green text-white
                       font-medium py-3 rounded-xl text-sm min-h-[44px] active:scale-[0.98] transition-all disabled:opacity-50">
            {noteMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <><Send size={14} /> Add Note</>}
          </button>
        </div>
      </div>
    </div>
  );
}
