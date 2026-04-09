"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, Tag, Share2, Target } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Props {
  planData: Array<{ name: string; mrr: number; subscribers: number }>;
  metrics: { totalMRR: number; arpu: number; avgLTV: number; totalActive: number; totalReferralRevenue: number; totalReferrals: number; couponUsage: number };
  coupons: Array<{ code: string; type: string; valuePct: number | null; valueCents: number | null; usedCount: number }>;
}

const COLORS = ["#1F6F78", "#163A63", "#B79B6C", "#0E223D", "#DDE9E3"];

export function RevenueClient({ planData, metrics, coupons }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Revenue Analytics</h2>
        <p className="text-sm text-graphite-400">LTV, ARPU, plan performance, and revenue attribution</p>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-teal" /><span className="text-xs text-graphite-400">MRR</span></div><p className="mt-1 text-xl font-bold text-navy">{formatPrice(metrics.totalMRR)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Target className="h-4 w-4 text-gold-600" /><span className="text-xs text-graphite-400">ARPU</span></div><p className="mt-1 text-xl font-bold text-navy">{formatPrice(metrics.arpu)}/mo</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-atlantic" /><span className="text-xs text-graphite-400">Avg LTV</span></div><p className="mt-1 text-xl font-bold text-navy">{formatPrice(metrics.avgLTV)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-navy" /><span className="text-xs text-graphite-400">Active Subs</span></div><p className="mt-1 text-xl font-bold text-navy">{metrics.totalActive}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Share2 className="h-4 w-4 text-teal" /><span className="text-xs text-graphite-400">Referral Rev</span></div><p className="mt-1 text-xl font-bold text-navy">{formatPrice(metrics.totalReferralRevenue)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Tag className="h-4 w-4 text-gold-600" /><span className="text-xs text-graphite-400">Coupon Uses</span></div><p className="mt-1 text-xl font-bold text-navy">{metrics.couponUsage}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by plan */}
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Plan</CardTitle></CardHeader>
          <CardContent>
            {planData.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No subscription data</p>
            ) : (
              <>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={planData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                      <XAxis type="number" tickFormatter={(v) => `$${Math.round(v / 100)}`} tick={{ fontSize: 11, fill: "#677A8A" }} />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: "#677A8A" }} />
                      <Tooltip formatter={(v: number) => [formatPrice(v), "MRR"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                      <Bar dataKey="mrr" radius={[0, 6, 6, 0]}>
                        {planData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {planData.map((p, i) => (
                    <div key={p.name} className="flex items-center justify-between rounded-lg bg-navy-50/30 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm font-medium text-navy">{p.name}</span>
                        <Badge variant="secondary" className="text-[9px]">{p.subscribers} subs</Badge>
                      </div>
                      <span className="text-sm font-bold text-navy">{formatPrice(p.mrr)}/mo</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Subscriber mix pie chart */}
        <Card>
          <CardHeader><CardTitle className="text-base">Subscriber Mix</CardTitle></CardHeader>
          <CardContent>
            {planData.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No data</p>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={planData} dataKey="subscribers" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {planData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v, "Subscribers"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Coupon ROI */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4 text-gold-600" /> Coupon Performance</CardTitle></CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="py-4 text-center text-sm text-graphite-300">No coupons used yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-navy-100/40 text-left"><th className="pb-3 font-medium text-graphite-400">Code</th><th className="pb-3 font-medium text-graphite-400">Type</th><th className="pb-3 font-medium text-graphite-400">Discount</th><th className="pb-3 font-medium text-graphite-400">Uses</th></tr></thead>
                <tbody className="divide-y divide-navy-100/30">
                  {coupons.map((c) => (
                    <tr key={c.code}>
                      <td className="py-2 font-mono font-bold text-navy">{c.code}</td>
                      <td className="py-2"><Badge variant="secondary" className="text-[9px]">{c.type}</Badge></td>
                      <td className="py-2 text-graphite-500">{c.valuePct ? `${c.valuePct}%` : c.valueCents ? formatPrice(c.valueCents) : "Free"}</td>
                      <td className="py-2 font-medium text-navy">{c.usedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
