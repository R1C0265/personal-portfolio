// src/components/admin/InquiriesClient.tsx
"use client";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Download, ChevronRight, Filter } from "lucide-react";
import api from "@/lib/api";
import { STATUS_CONFIG, formatRelative, cn } from "@/lib/utils";
import type { Inquiry, InquiryStatus, Pagination } from "@/types";

const STATUSES = [
  { value: "" as const,             label: "All"         },
  { value: "NEW" as const,          label: "New"         },
  { value: "IN_PROGRESS" as const,  label: "In Progress" },
  { value: "COMPLETED" as const,    label: "Completed"   },
  { value: "CANCELLED" as const,    label: "Cancelled"   },
];

export function InquiriesClient() {
  const [status, setStatus]       = useState<"" | InquiryStatus>("");
  const [search, setSearch]       = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage]           = useState(1);
  const timer = useRef<NodeJS.Timeout>();

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setDebounced(val); setPage(1); }, 350);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["inquiries", status, debounced, page],
    queryFn:  async () => {
      const p = new URLSearchParams({ page: String(page), limit: "15" });
      if (status)   p.set("status", status);
      if (debounced) p.set("search", debounced);
      return (await api.get("/inquiries?" + p)).data as { inquiries: Inquiry[]; pagination: Pagination };
    },
  });

  const handleExport = () => {
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    window.open(`/api/inquiries/export?${p}`, "_blank");
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-500 text-sm">{data?.pagination.total ?? 0} total</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm
                     font-medium px-3 py-2 rounded-xl shadow-card active:bg-gray-50 min-h-[44px]">
          <Download size={15} /> CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search name, email or phone..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-base
                     outline-none focus:border-waku-green focus:ring-2 focus:ring-waku-green/10 min-h-[52px]" />
      </div>

      {/* Status chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 [scrollbar-width:none]">
        {STATUSES.map(({ value, label }) => (
          <button key={label} onClick={() => { setStatus(value); setPage(1); }}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all",
              status === value
                ? "bg-waku-green text-white border-waku-green"
                : "bg-white text-gray-600 border-gray-200 active:bg-gray-50"
            )}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        {isLoading && (
          <div className="divide-y divide-gray-50">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="p-4 flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && data?.inquiries.length === 0 && (
          <div className="py-16 text-center">
            <Filter size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No inquiries found</p>
          </div>
        )}

        <div className="divide-y divide-gray-50">
          {data?.inquiries.map(inq => {
            const cfg = STATUS_CONFIG[inq.status];
            return (
              <Link key={inq.id} href={"/admin/inquiries/" + inq.id}
                className="flex items-center gap-3 p-4 active:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-waku-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-waku-green text-sm font-bold">{inq.customerName[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm truncate">{inq.customerName}</p>
                    {(inq._count?.notes ?? 0) > 0 && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {inq._count!.notes} note{inq._count!.notes !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs truncate">
                    {inq.product?.name ?? "No product"} · {inq.customerPhone}
                  </p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{formatRelative(inq.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-full border", cfg.className)}>
                    {cfg.label}
                  </span>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </Link>
            );
          })}
        </div>

        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-50">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="text-sm font-medium text-gray-600 disabled:opacity-40 px-3 py-2 rounded-lg active:bg-gray-100">
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {data.pagination.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="text-sm font-medium text-gray-600 disabled:opacity-40 px-3 py-2 rounded-lg active:bg-gray-100">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
