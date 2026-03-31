// src/components/admin/DashboardClient.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MessageSquare, TrendingUp, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import api from "@/lib/api";
import { STATUS_CONFIG, formatRelative } from "@/lib/utils";
import type { DashboardStats, Inquiry } from "@/types";

function StatCard({ label, value, Icon, color }: {
  label: string; value: number | string; Icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-xs font-medium">{label}</p>
        <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
          <Icon size={15} className="text-white" />
        </div>
      </div>
      <p className="font-display font-bold text-2xl text-gray-900">{value}</p>
    </div>
  );
}

export function DashboardClient() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["stats"],
    queryFn:  async () => (await api.get("/inquiries/stats")).data,
    refetchInterval: 30000,
  });

  const { data: recentRes } = useQuery({
    queryKey: ["inquiries", "recent"],
    queryFn:  async () => (await api.get("/inquiries?limit=5")).data,
  });

  const recent: Inquiry[] = recentRes?.inquiries ?? [];

  const chartData = stats
    ? [
        { name: "New",         value: stats.statusBreakdown.NEW         ?? 0, fill: "#1A4D2E" },
        { name: "In Progress", value: stats.statusBreakdown.IN_PROGRESS ?? 0, fill: "#C9A84C" },
        { name: "Completed",   value: stats.statusBreakdown.COMPLETED   ?? 0, fill: "#3B82F6" },
        { name: "Cancelled",   value: stats.statusBreakdown.CANCELLED   ?? 0, fill: "#EF4444" },
      ]
    : [];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Overview of all customer activity</p>
      </div>

      {/* Stats — 2-col on mobile */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Total Inquiries" value={stats?.total        ?? "—"} Icon={MessageSquare} color="bg-waku-green" />
        <StatCard label="New This Week"   value={stats?.newThisWeek  ?? "—"} Icon={TrendingUp}    color="bg-waku-gold"  />
        <StatCard label="In Progress"     value={stats?.statusBreakdown?.IN_PROGRESS ?? 0} Icon={Clock}       color="bg-amber-500" />
        <StatCard label="Completed"       value={stats?.statusBreakdown?.COMPLETED   ?? 0} Icon={CheckCircle} color="bg-blue-500"  />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-50 mb-6">
          <h2 className="font-semibold text-gray-900 text-base mb-4">Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13 }} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent inquiries */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-50">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900 text-base">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-waku-green text-sm font-semibold flex items-center gap-0.5">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-10">No inquiries yet</p>
          )}
          {recent.map((inq) => {
            const cfg = STATUS_CONFIG[inq.status];
            return (
              <Link key={inq.id} href={`/admin/inquiries/${inq.id}`}
                className="flex items-center gap-3 p-4 active:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-waku-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-waku-green text-sm font-bold">{inq.customerName[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{inq.customerName}</p>
                  <p className="text-gray-500 text-xs truncate">
                    {inq.product?.name ?? "No product"} · {formatRelative(inq.createdAt)}
                  </p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full border flex-shrink-0 ${cfg.className}`}>
                  {cfg.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
