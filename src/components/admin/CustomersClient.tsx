// src/components/admin/CustomersClient.tsx
"use client";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, Phone, Mail, MessageSquare } from "lucide-react";
import api from "@/lib/api";
import { STATUS_CONFIG, formatDate, cn } from "@/lib/utils";
import type { User, Inquiry } from "@/types";

function CustomerRow({ customer }: { customer: User & { _count: { inquiries: number } } }) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["customer-inquiries", customer.id],
    queryFn:  async () => (await api.get("/inquiries?search=" + encodeURIComponent(customer.email) + "&limit=50")).data,
    enabled:  open,
  });

  const inquiries: Inquiry[] = data?.inquiries ?? [];

  return (
    <div className="border-b border-gray-50 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 active:bg-gray-50 transition-colors text-left">
        <div className="w-10 h-10 bg-waku-green-50 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-waku-green text-sm font-bold">{customer.firstName[0]}{customer.lastName[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{customer.firstName} {customer.lastName}</p>
          <p className="text-gray-500 text-xs truncate">{customer.email}</p>
          {customer.phone && <p className="text-gray-400 text-xs">{customer.phone}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs bg-waku-green-50 text-waku-green font-semibold px-2 py-1 rounded-full">
            {customer._count.inquiries} {customer._count.inquiries === 1 ? "inquiry" : "inquiries"}
          </span>
          {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 bg-gray-50/50">
          <div className="flex gap-2 mb-3 pt-1">
            {customer.phone && (
              <a href={"tel:" + customer.phone}
                className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 active:bg-gray-100">
                <Phone size={12} className="text-waku-green" /> Call
              </a>
            )}
            <a href={"mailto:" + customer.email}
              className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 active:bg-gray-100">
              <Mail size={12} className="text-blue-500" /> Email
            </a>
            {customer.phone && (
              <a href={"https://wa.me/" + customer.phone.replace(/\D/g, "")} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 active:bg-gray-100">
                <MessageSquare size={12} className="text-green-600" /> WhatsApp
              </a>
            )}
          </div>

          {isLoading && <div className="h-14 bg-white rounded-xl animate-pulse" />}
          {!isLoading && inquiries.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-3">No inquiry history</p>
          )}
          <div className="space-y-2">
            {inquiries.map(inq => {
              const cfg = STATUS_CONFIG[inq.status];
              return (
                <Link key={inq.id} href={"/admin/inquiries/" + inq.id}
                  className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 active:bg-gray-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{inq.product?.name ?? "General inquiry"}</p>
                    <p className="text-xs text-gray-400">{formatDate(inq.createdAt)}</p>
                  </div>
                  <span className={cn("text-[11px] font-semibold px-2 py-1 rounded-full border flex-shrink-0 ml-2", cfg.className)}>
                    {cfg.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CustomersClient() {
  const [search, setSearch]       = useState("");
  const [debounced, setDebounced] = useState("");
  const timer = useRef<NodeJS.Timeout>();

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(val), 350);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["customers", debounced],
    queryFn:  async () => {
      const p = new URLSearchParams({ role: "CUSTOMER", limit: "50" });
      if (debounced) p.set("search", debounced);
      return (await api.get("/admin/users?" + p)).data.users as (User & { _count: { inquiries: number } })[];
    },
  });

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 text-sm">{data?.length ?? 0} registered</p>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => handleSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-base
                     outline-none focus:border-waku-green focus:ring-2 focus:ring-waku-green/10 min-h-[52px]" />
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-50 overflow-hidden">
        {isLoading && [1,2,3,4].map(i => (
          <div key={i} className="flex gap-3 p-4 border-b border-gray-50">
            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded animate-pulse w-40" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-56" />
            </div>
          </div>
        ))}
        {!isLoading && data?.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-16">No customers yet</p>
        )}
        {data?.map(c => <CustomerRow key={c.id} customer={c} />)}
      </div>
    </div>
  );
}
