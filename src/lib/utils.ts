// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InquiryStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(n: number) {
  return `K${n.toLocaleString("en-MW")}`;
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function formatRelative(d: string) {
  const diff  = Date.now() - new Date(d).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return formatDate(d);
}

export const STATUS_CONFIG: Record<InquiryStatus, { label: string; className: string }> = {
  NEW:         { label: "New",         className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  IN_PROGRESS: { label: "In Progress", className: "bg-amber-50   text-amber-700   border-amber-200"   },
  COMPLETED:   { label: "Completed",   className: "bg-blue-50    text-blue-700    border-blue-200"    },
  CANCELLED:   { label: "Cancelled",   className: "bg-red-50     text-red-700     border-red-200"     },
};

export function fullName(u: { firstName: string; lastName: string }) {
  return `${u.firstName} ${u.lastName}`;
}
