"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Clock, CheckCircle, AlertTriangle, Eye, ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";

type TabType = "all" | "intake_review" | "active" | "past_due";
type SortKey = "name" | "state" | "plan" | "status" | "joined" | "progress";
type SortDir = "asc" | "desc";

interface Customer {
  id: string;
  name: string;
  email: string;
  state: string;
  plan: string;
  subscriptionStatus: string;
  intakeStatus: string;
  joinDate: Date | string;
  weightLost: number;
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="ml-1 inline h-3 w-3 text-graphite-300" />;
  return sortDir === "asc"
    ? <ChevronUp className="ml-1 inline h-3 w-3 text-navy" />
    : <ChevronDown className="ml-1 inline h-3 w-3 text-navy" />;
}

export function AdminCustomersClient({ customers, total }: { customers: Customer[]; total?: number }) {
  const [tab, setTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = customers
    .filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (tab === "intake_review") return c.intakeStatus === "SUBMITTED" || c.intakeStatus === "NEEDS_INFO";
      if (tab === "active") return c.subscriptionStatus === "ACTIVE";
      if (tab === "past_due") return c.subscriptionStatus === "PAST_DUE";
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "state": cmp = a.state.localeCompare(b.state); break;
        case "plan": cmp = a.plan.localeCompare(b.plan); break;
        case "status": cmp = a.subscriptionStatus.localeCompare(b.subscriptionStatus); break;
        case "joined": cmp = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(); break;
        case "progress": cmp = a.weightLost - b.weightLost; break;
      }
      return sortDir === "asc" ? cmp : -cmp;
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
                  {([
                    { key: "name" as SortKey, label: "Customer", cls: "px-6 py-3 text-left" },
                    { key: "state" as SortKey, label: "State", cls: "px-4 py-3 text-left" },
                    { key: "plan" as SortKey, label: "Plan", cls: "px-4 py-3 text-left" },
                    { key: null, label: "Intake", cls: "px-4 py-3 text-left" },
                    { key: "status" as SortKey, label: "Status", cls: "px-4 py-3 text-left" },
                    { key: "joined" as SortKey, label: "Joined", cls: "px-4 py-3 text-left" },
                    { key: "progress" as SortKey, label: "Progress (lbs)", cls: "px-4 py-3 text-left" },
                  ]).map(({ key, label, cls }) => (
                    <th
                      key={label}
                      className={`${cls} font-medium text-graphite-400 ${key ? "cursor-pointer select-none hover:text-navy" : ""}`}
                      onClick={key ? () => handleSort(key) : undefined}
                    >
                      {label}
                      {key && <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="py-8 text-center text-sm text-graphite-300">No customers match your filters</td></tr>
                ) : filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-navy-50/20 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/customers/${c.id}`}
                  >
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
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex rounded-lg p-1.5 text-graphite-400 hover:bg-teal-50 hover:text-teal transition-colors"
                        title="View customer profile"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
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
