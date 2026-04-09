"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Scale, TrendingDown, Target, Ruler, Plus, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProgressData {
  weightData: Array<{ date: string; weight: number | null }>;
  measurementData: Array<{ date: string; waist: number | null; hips: number | null; chest: number | null }>;
  dailyLogs: Array<{ date: string; weight: number | null; protein: number | null; water: number | null; medication: boolean | null; mood: number | null }>;
  stats: { currentWeight: number; startWeight: number; goalWeight: number; weightLost: number; waistChange: number };
}

export function ProgressClient({ data }: { data: ProgressData }) {
  const { weightData, measurementData, dailyLogs, stats } = data;
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({ weightLbs: "", proteinG: "", waterOz: "", medicationTaken: false, moodRating: 0 });
  const [logSaved, setLogSaved] = useState(false);

  const hasData = weightData.length > 0;

  async function handleLogSubmit() {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weightLbs: logForm.weightLbs ? parseFloat(logForm.weightLbs) : undefined,
        proteinG: logForm.proteinG ? parseInt(logForm.proteinG) : undefined,
        waterOz: logForm.waterOz ? parseInt(logForm.waterOz) : undefined,
        medicationTaken: logForm.medicationTaken,
        moodRating: logForm.moodRating || undefined,
      }),
    });
    if (res.ok) {
      setLogSaved(true);
      setTimeout(() => { setLogSaved(false); setShowLogForm(false); }, 2000);
    }
  }

  // Empty state
  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h2 className="text-2xl font-bold text-navy">Progress</h2><p className="text-sm text-graphite-400">Track your weight, measurements, and daily habits</p></div>
          <Button className="gap-2" onClick={() => setShowLogForm(true)}><Plus className="h-4 w-4" /> Log Your First Entry</Button>
        </div>
        {showLogForm && <LogForm form={logForm} setForm={setLogForm} onSubmit={handleLogSubmit} onCancel={() => setShowLogForm(false)} saved={logSaved} />}
        <Card className="py-16 text-center">
          <CardContent>
            <Scale className="mx-auto h-12 w-12 text-graphite-200" />
            <h3 className="mt-4 text-lg font-bold text-navy">No progress data yet</h3>
            <p className="mt-2 text-sm text-graphite-400 max-w-md mx-auto">Start logging your weight, protein, and water intake to see your progress visualized here. Consistency is key — even a few entries per week helps.</p>
            <Button className="mt-6 gap-2" onClick={() => setShowLogForm(true)}>Log Your First Entry <ArrowRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-navy">Progress</h2><p className="text-sm text-graphite-400">Track your weight, measurements, and daily habits</p></div>
        <Button className="gap-2" onClick={() => setShowLogForm(!showLogForm)}><Plus className="h-4 w-4" /> Log Today</Button>
      </div>

      {showLogForm && <LogForm form={logForm} setForm={setLogForm} onSubmit={handleLogSubmit} onCancel={() => setShowLogForm(false)} saved={logSaved} />}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Current Weight", value: `${Math.round(stats.currentWeight)} lbs`, sub: stats.weightLost > 0 ? `-${Math.round(stats.weightLost)} lbs` : "", icon: Scale, color: "text-teal" },
          { label: "Weight Lost", value: `${Math.round(Math.abs(stats.weightLost))} lbs`, sub: stats.startWeight > 0 ? `${Math.round((stats.weightLost / stats.startWeight) * 100)}%` : "", icon: TrendingDown, color: "text-emerald-600" },
          { label: "Goal Weight", value: stats.goalWeight > 0 ? `${stats.goalWeight} lbs` : "Not set", sub: stats.goalWeight > 0 ? `${Math.round(stats.currentWeight - stats.goalWeight)} lbs to go` : "", icon: Target, color: "text-gold-600" },
          { label: "Waist Change", value: stats.waistChange !== 0 ? `${stats.waistChange > 0 ? "-" : "+"}${Math.abs(Math.round(stats.waistChange * 10) / 10)} in` : "—", sub: "", icon: Ruler, color: "text-atlantic" },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-xs text-graphite-400">{s.label}</span><s.icon className={`h-4 w-4 ${s.color}`} /></div><p className="mt-1 text-2xl font-bold text-navy">{s.value}</p>{s.sub && <p className="text-xs text-graphite-400">{s.sub}</p>}</CardContent></Card>
        ))}
      </div>

      {/* Weight chart */}
      <Card>
        <CardHeader><CardTitle className="text-base">Weight Trend ({weightData.length} entries)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1F6F78" stopOpacity={0.15} /><stop offset="95%" stopColor="#1F6F78" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#677A8A" }} interval="preserveStartEnd" />
                <YAxis domain={["dataMin - 3", "dataMax + 3"]} tick={{ fontSize: 11, fill: "#677A8A" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4", boxShadow: "0 4px 16px rgba(14,34,61,0.08)" }} />
                <Area type="monotone" dataKey="weight" stroke="#1F6F78" strokeWidth={2} fill="url(#wg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Measurements chart */}
      {measurementData.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Body Measurements</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#677A8A" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#677A8A" }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                  <Line type="monotone" dataKey="waist" stroke="#1F6F78" strokeWidth={2} name="Waist" dot={{ fill: "#1F6F78", r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="hips" stroke="#B79B6C" strokeWidth={2} name="Hips" dot={{ fill: "#B79B6C", r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily log table */}
      {dailyLogs.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Daily Logs</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-navy-100/40 text-left"><th className="pb-3 font-medium text-graphite-400">Date</th><th className="pb-3 font-medium text-graphite-400">Weight</th><th className="pb-3 font-medium text-graphite-400">Protein</th><th className="pb-3 font-medium text-graphite-400">Water</th><th className="pb-3 font-medium text-graphite-400">Medication</th><th className="pb-3 font-medium text-graphite-400">Mood</th></tr></thead>
                <tbody className="divide-y divide-navy-100/30">
                  {dailyLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-navy-50/30 transition-colors">
                      <td className="py-3 font-medium text-navy">{log.date}</td>
                      <td className="py-3 text-graphite-500">{log.weight ? `${Math.round(log.weight * 10) / 10} lbs` : "—"}</td>
                      <td className="py-3"><span className={log.protein && log.protein >= 130 ? "text-teal font-medium" : "text-graphite-500"}>{log.protein ? `${log.protein}g` : "—"}</span></td>
                      <td className="py-3"><span className={log.water && log.water >= 80 ? "text-teal font-medium" : "text-graphite-500"}>{log.water ? `${log.water}oz` : "—"}</span></td>
                      <td className="py-3">{log.medication !== null ? <Badge variant={log.medication ? "success" : "warning"}>{log.medication ? "Yes" : "Missed"}</Badge> : "—"}</td>
                      <td className="py-3">{log.mood ? <div className="flex gap-0.5">{[1,2,3,4,5].map((n) => <div key={n} className={`h-2.5 w-2.5 rounded-full ${n <= log.mood! ? "bg-teal" : "bg-navy-200"}`} />)}</div> : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LogForm({ form, setForm, onSubmit, onCancel, saved }: {
  form: { weightLbs: string; proteinG: string; waterOz: string; medicationTaken: boolean; moodRating: number };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  onSubmit: () => void;
  onCancel: () => void;
  saved: boolean;
}) {
  if (saved) {
    return (
      <Card className="border-teal/30 bg-teal-50/30">
        <CardContent className="flex items-center gap-3 justify-center p-6">
          <Check className="h-6 w-6 text-teal" />
          <p className="text-lg font-semibold text-navy">Logged successfully!</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-teal/30 bg-teal-50/30">
      <CardContent className="p-6">
        <h3 className="text-base font-bold text-navy mb-4">Quick Daily Log</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="block text-xs font-semibold text-navy mb-1">Weight (lbs)</label><Input type="number" value={form.weightLbs} onChange={(e) => setForm((p) => ({ ...p, weightLbs: e.target.value }))} placeholder="198" /></div>
          <div><label className="block text-xs font-semibold text-navy mb-1">Protein (g)</label><Input type="number" value={form.proteinG} onChange={(e) => setForm((p) => ({ ...p, proteinG: e.target.value }))} placeholder="140" /></div>
          <div><label className="block text-xs font-semibold text-navy mb-1">Water (oz)</label><Input type="number" value={form.waterOz} onChange={(e) => setForm((p) => ({ ...p, waterOz: e.target.value }))} placeholder="100" /></div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.medicationTaken} onChange={(e) => setForm((p) => ({ ...p, medicationTaken: e.target.checked }))} className="h-4 w-4 rounded border-navy-300 text-teal" /><span className="text-navy">Medication taken</span></label>
          <div className="flex items-center gap-1"><span className="text-xs text-graphite-400 mr-1">Mood:</span>{[1,2,3,4,5].map((n) => <button key={n} onClick={() => setForm((p) => ({ ...p, moodRating: n }))} className={`h-7 w-7 rounded-full text-xs font-bold transition-all ${form.moodRating >= n ? "bg-teal text-white" : "bg-navy-100 text-graphite-400"}`}>{n}</button>)}</div>
        </div>
        <div className="mt-4 flex gap-3"><Button onClick={onSubmit}>Save Log</Button><Button variant="ghost" onClick={onCancel}>Cancel</Button></div>
      </CardContent>
    </Card>
  );
}
