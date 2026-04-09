"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingDown, AlertTriangle, Activity, BarChart3 } from "lucide-react";

interface Props {
  cohortData: Array<{ month: string; total: number; active: number; churned: number; retentionRate: number }>;
  featureAdoption: Array<{ feature: string; users: number; rate: number }>;
  churnSignals: { inactive14d: number; pastDue: number; totalActive: number };
}

export function RetentionClient({ cohortData, featureAdoption, churnSignals }: Props) {
  const atRiskRate = churnSignals.totalActive > 0
    ? Math.round(((churnSignals.inactive14d + churnSignals.pastDue) / churnSignals.totalActive) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Retention Analytics</h2>
        <p className="text-sm text-graphite-400">Cohort retention, feature adoption, and churn prediction</p>
      </div>

      {/* Churn signals */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Active Members</p><p className="text-xl font-bold text-navy">{churnSignals.totalActive}</p></div></CardContent></Card>
        <Card className={churnSignals.inactive14d > 0 ? "border-amber-200 bg-amber-50/20" : ""}>
          <CardContent className="flex items-center gap-3 p-4"><Activity className="h-5 w-5 text-amber-500" /><div><p className="text-xs text-graphite-400">Inactive 14+ Days</p><p className="text-xl font-bold text-navy">{churnSignals.inactive14d}</p></div></CardContent>
        </Card>
        <Card className={churnSignals.pastDue > 0 ? "border-red-200 bg-red-50/20" : ""}>
          <CardContent className="flex items-center gap-3 p-4"><AlertTriangle className="h-5 w-5 text-red-400" /><div><p className="text-xs text-graphite-400">Past Due</p><p className="text-xl font-bold text-navy">{churnSignals.pastDue}</p></div></CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4"><TrendingDown className="h-5 w-5 text-navy" /><div><p className="text-xs text-graphite-400">At-Risk Rate</p><p className="text-xl font-bold text-navy">{atRiskRate}%</p></div></CardContent>
        </Card>
      </div>

      {/* Cohort retention chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-teal" /> Monthly Cohort Retention
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cohortData.length === 0 ? (
            <p className="py-8 text-center text-sm text-graphite-300">No cohort data yet</p>
          ) : (
            <>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#677A8A" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#677A8A" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                    <Bar dataKey="active" name="Active" stackId="a" radius={[0, 0, 0, 0]}>
                      {cohortData.map((_, i) => <Cell key={i} fill="#1F6F78" />)}
                    </Bar>
                    <Bar dataKey="churned" name="Churned" stackId="a" radius={[4, 4, 0, 0]}>
                      {cohortData.map((_, i) => <Cell key={i} fill="#E8EDF4" />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {cohortData.map((c) => (
                  <div key={c.month} className="rounded-xl bg-navy-50/30 p-3 text-center">
                    <p className="text-[10px] text-graphite-400">{c.month}</p>
                    <p className="text-lg font-bold text-navy">{c.retentionRate}%</p>
                    <p className="text-[10px] text-graphite-300">{c.active}/{c.total} retained</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Feature adoption */}
      <Card>
        <CardHeader><CardTitle className="text-base">Feature Adoption Rates</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {featureAdoption.map((f) => (
            <div key={f.feature} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-navy">{f.feature}</span>
                <span className="text-sm font-bold text-navy">{f.rate}%</span>
              </div>
              <Progress value={f.rate} className="h-2" />
              <p className="text-[10px] text-graphite-300">{f.users} users</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Churn prediction insights */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Churn Risk Indicators</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { signal: "No progress logged in 14+ days", severity: "high", action: "Send re-engagement email with progress prompt" },
              { signal: "Payment method past due", severity: "high", action: "Send payment update reminder, offer save flow" },
              { signal: "Skipped last 2 check-ins", severity: "medium", action: "Care team outreach, ask about barriers" },
              { signal: "Never opened meal plans", severity: "low", action: "Send meal plan highlight email with easy recipes" },
              { signal: "No messages sent in 30+ days", severity: "medium", action: "Provider-initiated check-in message" },
              { signal: "Downgraded plan in last 30 days", severity: "medium", action: "Offer targeted add-on at discount" },
            ].map((s) => (
              <div key={s.signal} className="rounded-xl border border-navy-100/40 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={s.severity === "high" ? "destructive" : s.severity === "medium" ? "warning" : "secondary"} className="text-[9px]">
                    {s.severity}
                  </Badge>
                  <p className="text-sm font-medium text-navy">{s.signal}</p>
                </div>
                <p className="text-xs text-graphite-400">{s.action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
