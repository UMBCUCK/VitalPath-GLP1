"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, Share2, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Props {
  revenueData: Array<{ week: string; revenue: number }>;
  funnelData: Array<{ stage: string; count: number }>;
  metrics: {
    totalRevenue90d: number;
    activeMembers: number;
    newPatientsMonth: number;
    referralConversions: number;
    totalOrders: number;
  };
}

export function AnalyticsClient({ revenueData, funnelData, metrics }: Props) {
  const stats = [
    { title: "Revenue (90d)", value: formatPrice(metrics.totalRevenue90d), icon: DollarSign, color: "text-teal" },
    { title: "Active Members", value: String(metrics.activeMembers), icon: Users, color: "text-atlantic" },
    { title: "New Patients (30d)", value: String(metrics.newPatientsMonth), icon: TrendingUp, color: "text-gold-600" },
    { title: "Orders (90d)", value: String(metrics.totalOrders), icon: ShoppingCart, color: "text-navy" },
    { title: "Referral Conversions", value: String(metrics.referralConversions), icon: Share2, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Analytics</h2>
        <p className="text-sm text-graphite-400">Revenue, funnel, and growth metrics</p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-graphite-400">{s.title}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="mt-1 text-xl font-bold text-navy">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-teal" /> Revenue by Week (Last 90 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F6F78" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1F6F78" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#677A8A" }} />
                <YAxis tick={{ fontSize: 11, fill: "#677A8A" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                <Area type="monotone" dataKey="revenue" stroke="#1F6F78" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Funnel chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold-600" /> Conversion Funnel (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#677A8A" }} />
                <YAxis dataKey="stage" type="category" width={120} tick={{ fontSize: 11, fill: "#677A8A" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                <Bar dataKey="count" fill="#1F6F78" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion rates */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            {funnelData.slice(0, -1).map((stage, i) => {
              const next = funnelData[i + 1];
              const rate = stage.count > 0 ? ((next.count / stage.count) * 100).toFixed(1) : "0";
              return (
                <div key={stage.stage} className="text-center rounded-xl bg-navy-50/30 p-3">
                  <p className="text-[10px] text-graphite-400">{stage.stage} → {next.stage}</p>
                  <p className="text-lg font-bold text-navy">{rate}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
