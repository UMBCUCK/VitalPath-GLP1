"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Users, TrendingUp, DollarSign, Play, Pause, BarChart3 } from "lucide-react";

const campaigns = [
  {
    id: "1", name: "Win-Back: 30-90 Day Churned", type: "reactivation",
    status: "active", trigger: "30-90 days post-cancel",
    offer: "30% off first month (COMEBACK30)", sent: 47, opened: 31, converted: 8,
    revenue: 23760,
  },
  {
    id: "2", name: "Quiz Abandonment Recovery", type: "recovery",
    status: "active", trigger: "24hr after quiz start, no completion",
    offer: "No discount — encouragement only", sent: 234, opened: 89, converted: 23,
    revenue: 0,
  },
  {
    id: "3", name: "Checkout Abandonment — 1hr", type: "recovery",
    status: "active", trigger: "1hr after checkout visit, no purchase",
    offer: "No discount — urgency + social proof", sent: 156, opened: 78, converted: 19,
    revenue: 75430,
  },
  {
    id: "4", name: "Checkout Abandonment — 72hr", type: "recovery",
    status: "draft", trigger: "72hr after checkout, still no purchase",
    offer: "SAVE15 — 15% off first month", sent: 0, opened: 0, converted: 0,
    revenue: 0,
  },
  {
    id: "5", name: "Annual Upgrade Push", type: "upgrade",
    status: "active", trigger: "Month 3 of monthly subscription",
    offer: "Switch to annual, save 20%", sent: 89, opened: 52, converted: 12,
    revenue: 57120,
  },
];

export default function CampaignsPage() {
  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalConverted = campaigns.reduce((s, c) => s + c.converted, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Campaigns</h2>
          <p className="text-sm text-graphite-400">Automated email campaigns for recovery, retention, and growth</p>
        </div>
        <Button className="gap-2"><Send className="h-4 w-4" /> New Campaign</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><Send className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Emails Sent</p><p className="text-xl font-bold text-navy">{totalSent}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-5 w-5 text-atlantic" /><div><p className="text-xs text-graphite-400">Conversions</p><p className="text-xl font-bold text-navy">{totalConverted}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><TrendingUp className="h-5 w-5 text-gold-600" /><div><p className="text-xs text-graphite-400">Avg Conv. Rate</p><p className="text-xl font-bold text-navy">{totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(1) : 0}%</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><DollarSign className="h-5 w-5 text-emerald-500" /><div><p className="text-xs text-graphite-400">Attributed Revenue</p><p className="text-xl font-bold text-navy">${(totalRevenue / 100).toLocaleString()}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100/40 bg-navy-50/30">
                <th className="px-6 py-3 text-left font-medium text-graphite-400">Campaign</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Trigger</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Offer</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Sent</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Conv.</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Revenue</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100/30">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-navy-50/20 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-navy">{c.name}</p>
                    <Badge variant="secondary" className="text-[9px] mt-0.5">{c.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-graphite-500">{c.trigger}</td>
                  <td className="px-4 py-3 text-xs text-graphite-500 max-w-[180px]">{c.offer}</td>
                  <td className="px-4 py-3 text-navy font-medium">{c.sent}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-navy">{c.converted}</span>
                    {c.sent > 0 && <span className="text-xs text-graphite-400 ml-1">({((c.converted / c.sent) * 100).toFixed(0)}%)</span>}
                  </td>
                  <td className="px-4 py-3 font-medium text-navy">{c.revenue > 0 ? `$${(c.revenue / 100).toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "active" ? "success" : "secondary"}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
