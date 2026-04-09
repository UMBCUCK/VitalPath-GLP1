"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Clock, CheckCircle, AlertTriangle, Eye } from "lucide-react";

type TabType = "all" | "intake_review" | "active" | "past_due";

interface Customer {
  id: string;
  name: string;
  email: string;
  state: string;
  plan: string;
  subscriptionStatus: string;
  intakeStatus: string;
  joinDate: Date;
  weightLost: number;
}

export function AdminCustomersClient({ customers }: { customers: Customer[] }) {
  const [tab, setTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === "intake_review") return c.intakeStatus === "SUBMITTED" || c.intakeStatus === "NEEDS_INFO";
    if (tab === "active") return c.subscriptionStatus === "ACTIVE";
    if (tab === "past_due") return c.subscriptionStatus === "PAST_DUE";
    return true;
  });

  const pendingIntakes = customers.filter((c) => c.intakeStatus === "SUBMITTED" || c.intakeStatus === "NEEDS_INFO").length;
  const activeCount = customers.filter((c) => c.subscriptionStatus === "ACTIVE").length;
  const pastDueCount = customers.filter((c) => c.subscriptionStatus === "PAST_DUE").length;

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-navy">Customers</h2><p className="text-sm text-graphite-400">Manage members, review intakes, and track engagement</p></div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Total</p><p className="text-xl font-bold text-navy">{customers.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><CheckCircle className="h-5 w-5 text-emerald-500" /><div><p className="text-xs text-graphite-400">Active</p><p className="text-xl font-bold text-navy">{activeCount}</p></div></CardContent></Card>
        <Card className={pendingIntakes > 0 ? "border-amber-200 bg-amber-50/30" : ""}><CardContent className="flex items-center gap-3 p-4"><Clock className="h-5 w-5 text-amber-500" /><div><p className="text-xs text-graphite-400">Intake Review</p><p className="text-xl font-bold text-navy">{pendingIntakes}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><AlertTriangle className="h-5 w-5 text-red-400" /><div><p className="text-xs text-graphite-400">Past Due</p><p className="text-xl font-bold text-navy">{pastDueCount}</p></div></CardContent></Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {([
            { key: "all" as const, label: "All" },
            { key: "intake_review" as const, label: `Intake Review (${pendingIntakes})` },
            { key: "active" as const, label: "Active" },
            { key: "past_due" as const, label: "Past Due" },
          ]).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${tab === t.key ? "bg-navy text-white" : "bg-white text-graphite-500 hover:bg-navy-50"}`}>{t.label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2 max-w-xs">
          <Search className="h-4 w-4 text-graphite-400" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-sm outline-none text-navy placeholder:text-graphite-300" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-6 py-3 text-left font-medium text-graphite-400">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">State</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Plan</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Intake</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Joined</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Progress</th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-8 text-center text-sm text-graphite-300">No customers match your filters</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-navy-50/20 transition-colors">
                    <td className="px-6 py-3"><p className="font-medium text-navy">{c.name}</p><p className="text-xs text-graphite-400">{c.email}</p></td>
                    <td className="px-4 py-3 text-graphite-500">{c.state}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{c.plan}</Badge></td>
                    <td className="px-4 py-3">
                      <Badge variant={c.intakeStatus === "APPROVED" ? "success" : c.intakeStatus === "SUBMITTED" ? "warning" : c.intakeStatus === "NEEDS_INFO" ? "destructive" : "secondary"}>
                        {c.intakeStatus.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={c.subscriptionStatus === "ACTIVE" ? "success" : c.subscriptionStatus === "PAST_DUE" ? "destructive" : "secondary"}>
                        {c.subscriptionStatus || "none"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-graphite-400">{new Date(c.joinDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{c.weightLost > 0 ? <span className="text-sm font-semibold text-teal">-{c.weightLost} lbs</span> : <span className="text-xs text-graphite-300">—</span>}</td>
                    <td className="px-4 py-3 text-right"><button className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy"><Eye className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
