"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Scale, TrendingDown, TrendingUp, Target, Ruler, Plus, Check,
  ArrowRight, Minus, ChevronDown, ChevronUp, Trophy, Zap, Calendar,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProgressData {
  weightData: Array<{ date: string; weight: number | null }>;
  measurementData: Array<{ date: string; waist: number | null; hips: number | null; chest: number | null }>;
  dailyLogs: Array<{
    date: string; weight: number | null; protein: number | null;
    water: number | null; medication: boolean | null; mood: number | null;
  }>;
  stats: { currentWeight: number; startWeight: number; goalWeight: number; weightLost: number; waistChange: number };
}

const TIME_RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

const MILESTONES_LBS = [5, 10, 15, 20, 25, 30, 40, 50];

function getPacePerWeek(weightData: Array<{ date: string; weight: number | null }>): number | null {
  const valid = weightData.filter((d) => d.weight !== null);
  if (valid.length < 4) return null;
  // Use first and last valid entries, treat each entry as roughly 1 day
  const first = valid[0].weight!;
  const last = valid[valid.length - 1].weight!;
  const weeksBetween = (valid.length - 1) / 7;
  if (weeksBetween < 0.5) return null;
  return (first - last) / weeksBetween;
}

function MilestoneBanner({ weightLost, pacePerWeek }: { weightLost: number; pacePerWeek: number | null }) {
  const reached = MILESTONES_LBS.filter((m) => weightLost >= m);
  const nextMilestone = MILESTONES_LBS.find((m) => weightLost < m);
  const lbsToNext = nextMilestone ? nextMilestone - weightLost : null;
  const weeksToNext = pacePerWeek && pacePerWeek > 0 && lbsToNext ? Math.ceil(lbsToNext / pacePerWeek) : null;

  if (weightLost <= 0 && !nextMilestone) return null;

  // Just hit a milestone?
  const justHit = reached.length > 0 && weightLost < (MILESTONES_LBS[reached.length] || Infinity);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* Milestones achieved */}
      {reached.length > 0 && (
        <div className="rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-linen p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-gold-600" />
            <p className="text-xs font-bold text-navy">Milestones reached</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {reached.map((m) => (
              <span key={m} className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                <Check className="h-3 w-3" /> {m} lbs
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next milestone + pace */}
      {nextMilestone && (
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/60 to-sage/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-teal" />
            <p className="text-xs font-bold text-navy">Next milestone: {nextMilestone} lbs lost</p>
          </div>
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-navy-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-700"
              style={{ width: `${Math.min(100, (weightLost / nextMilestone) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-graphite-500">
            <span className="font-semibold text-teal">{lbsToNext?.toFixed(1)} lbs to go</span>
            {weeksToNext && weeksToNext <= 52 && (
              <span className="ml-1 text-graphite-400">· ~{weeksToNext} {weeksToNext === 1 ? "week" : "weeks"} at your current pace</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export function ProgressClient({ data }: { data: ProgressData }) {
  const { weightData, measurementData, dailyLogs, stats } = data;
  const [showLogForm, setShowLogForm] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [logForm, setLogForm] = useState({
    weightLbs: "", proteinG: "", waterOz: "",
    waistInches: "", hipsInches: "", chestInches: "",
    medicationTaken: false, moodRating: 0,
  });
  const [logSaved, setLogSaved] = useState(false);
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(90);

  const hasData = weightData.length > 0;

  // Filter chart data based on time range
  const filteredWeightData = weightData.slice(-timeRange);

  // Pace calculation (memoized)
  const pacePerWeek = useMemo(() => getPacePerWeek(weightData), [weightData]);

  // Trend: compare last 7 days vs prior 7 days
  const last7 = weightData.slice(-7).map((d) => d.weight).filter(Boolean) as number[];
  const prior7 = weightData.slice(-14, -7).map((d) => d.weight).filter(Boolean) as number[];
  const avgLast = last7.length ? last7.reduce((a, b) => a + b, 0) / last7.length : null;
  const avgPrior = prior7.length ? prior7.reduce((a, b) => a + b, 0) / prior7.length : null;
  const weeklyTrend = avgLast && avgPrior ? avgLast - avgPrior : null;

  const weightPct = stats.goalWeight > 0 && stats.startWeight > stats.goalWeight
    ? Math.min(100, Math.max(0, (stats.weightLost / (stats.startWeight - stats.goalWeight)) * 100))
    : 0;

  async function handleLogSubmit() {
    setLogSubmitting(true);
    setLogError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weightLbs: logForm.weightLbs ? parseFloat(logForm.weightLbs) : undefined,
          proteinG: logForm.proteinG ? parseInt(logForm.proteinG) : undefined,
          waterOz: logForm.waterOz ? parseInt(logForm.waterOz) : undefined,
          waistInches: logForm.waistInches ? parseFloat(logForm.waistInches) : undefined,
          hipsInches: logForm.hipsInches ? parseFloat(logForm.hipsInches) : undefined,
          chestInches: logForm.chestInches ? parseFloat(logForm.chestInches) : undefined,
          medicationTaken: logForm.medicationTaken,
          moodRating: logForm.moodRating || undefined,
        }),
      });
      if (res.ok) {
        setLogSaved(true);
        setTimeout(() => { setLogSaved(false); setShowLogForm(false); }, 2500);
      } else {
        const data = await res.json().catch(() => ({}));
        setLogError(data.error || "Failed to save. Please try again.");
      }
    } catch {
      setLogError("Couldn't connect. Check your connection and try again.");
    } finally {
      setLogSubmitting(false);
    }
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy">Progress</h2>
            <p className="text-sm text-graphite-400">Track your weight, measurements, and daily habits</p>
          </div>
          <Button className="gap-2" onClick={() => setShowLogForm(true)}>
            <Plus className="h-4 w-4" /> Log Your First Entry
          </Button>
        </div>
        {showLogForm && (
          <LogForm
            form={logForm}
            setForm={setLogForm}
            onSubmit={handleLogSubmit}
            onCancel={() => setShowLogForm(false)}
            saved={logSaved}
            showMeasurements={showMeasurements}
            onToggleMeasurements={() => setShowMeasurements(!showMeasurements)}
          />
        )}
        <Card className="py-16 text-center">
          <CardContent>
            <Scale className="mx-auto h-12 w-12 text-graphite-200" />
            <h3 className="mt-4 text-lg font-bold text-navy">No progress data yet</h3>
            <p className="mt-2 text-sm text-graphite-400 max-w-md mx-auto">
              Start logging your weight, protein, and water to see your progress here.
              Even a few entries per week makes a big difference.
            </p>
            <Button className="mt-6 gap-2" onClick={() => setShowLogForm(true)}>
              Log Your First Entry <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-navy">Progress</h2>
          <p className="text-sm text-graphite-400">
            {weightData.length} entries · tracking weight, habits &amp; measurements
          </p>
        </div>
        <Button className="w-full sm:w-auto gap-2" onClick={() => setShowLogForm(!showLogForm)}>
          <Plus className="h-4 w-4" /> Log Today
        </Button>
      </div>

      {showLogForm && (
        <LogForm
          form={logForm}
          setForm={setLogForm}
          onSubmit={handleLogSubmit}
          onCancel={() => { setShowLogForm(false); setLogError(null); }}
          saved={logSaved}
          submitting={logSubmitting}
          error={logError}
          showMeasurements={showMeasurements}
          onToggleMeasurements={() => setShowMeasurements(!showMeasurements)}
        />
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Current Weight"
          value={stats.currentWeight > 0 ? `${Math.round(stats.currentWeight)} lbs` : "—"}
          sub={weeklyTrend !== null
            ? weeklyTrend < -0.1
              ? `↓ ${Math.abs(weeklyTrend).toFixed(1)} lbs this week`
              : weeklyTrend > 0.1
              ? `↑ ${weeklyTrend.toFixed(1)} lbs this week`
              : "Stable this week"
            : undefined}
          icon={Scale}
          trend={weeklyTrend !== null ? (weeklyTrend < -0.1 ? "good" : weeklyTrend > 0.1 ? "bad" : "neutral") : undefined}
          iconColor="text-teal"
        />
        <StatCard
          label="Weight Lost"
          value={`${Math.round(Math.abs(stats.weightLost))} lbs`}
          sub={stats.startWeight > 0 && stats.weightLost > 0
            ? `${Math.round((stats.weightLost / stats.startWeight) * 100)}% of start weight`
            : undefined}
          icon={TrendingDown}
          trend={stats.weightLost > 0 ? "good" : stats.weightLost < 0 ? "bad" : "neutral"}
          iconColor="text-emerald-600"
          progressPct={weightPct > 0 ? weightPct : undefined}
        />
        <StatCard
          label="Goal Weight"
          value={stats.goalWeight > 0 ? `${stats.goalWeight} lbs` : "Not set"}
          sub={stats.goalWeight > 0 && stats.currentWeight > stats.goalWeight
            ? `${Math.round(stats.currentWeight - stats.goalWeight)} lbs to go`
            : stats.goalWeight > 0 && stats.currentWeight <= stats.goalWeight
            ? "Goal reached!"
            : undefined}
          icon={Target}
          trend={stats.goalWeight > 0 && stats.currentWeight <= stats.goalWeight ? "good" : undefined}
          iconColor="text-gold-600"
        />
        <StatCard
          label="Waist Change"
          value={stats.waistChange !== 0 ? `${stats.waistChange > 0 ? "−" : "+"}${Math.abs(Math.round(stats.waistChange * 10) / 10)} in` : "—"}
          sub={stats.waistChange !== 0 ? (stats.waistChange > 0 ? "reduced" : "increased") : "No data yet"}
          icon={Ruler}
          trend={stats.waistChange > 0 ? "good" : stats.waistChange < 0 ? "bad" : undefined}
          iconColor="text-atlantic"
        />
      </div>

      {/* Milestone + pace banner */}
      {stats.weightLost > 0 && (
        <MilestoneBanner weightLost={stats.weightLost} pacePerWeek={pacePerWeek} />
      )}

      {/* Weight chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Weight Trend</CardTitle>
            <div className="flex items-center gap-1">
              {TIME_RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setTimeRange(r.days)}
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-semibold transition-colors",
                    timeRange === r.days ? "bg-navy text-white" : "text-graphite-400 hover:bg-navy-50"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredWeightData}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F6F78" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1F6F78" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#677A8A" }} interval="preserveStartEnd" />
                <YAxis domain={["dataMin - 3", "dataMax + 3"]} tick={{ fontSize: 11, fill: "#677A8A" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4", boxShadow: "0 4px 16px rgba(14,34,61,0.08)" }}
                  formatter={(v: number) => [`${v} lbs`, "Weight"]}
                />
                {stats.goalWeight > 0 && (
                  <ReferenceLine
                    y={stats.goalWeight}
                    stroke="#B79B6C"
                    strokeDasharray="4 4"
                    label={{ value: "Goal", position: "right", fontSize: 10, fill: "#B79B6C" }}
                  />
                )}
                <Area type="monotone" dataKey="weight" stroke="#1F6F78" strokeWidth={2} fill="url(#wg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {filteredWeightData.length > 0 && (
            <p className="mt-2 text-center text-xs text-graphite-300">
              Showing {filteredWeightData.length} entries · last {timeRange} days
              {stats.goalWeight > 0 && <span> · dashed line = goal ({stats.goalWeight} lbs)</span>}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Measurements chart */}
      {measurementData.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Body Measurements</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#677A8A" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#677A8A" }} unit='"' />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }}
                    formatter={(v: number, name: string) => [`${v}"`, name]}
                  />
                  <Line type="monotone" dataKey="waist" stroke="#1F6F78" strokeWidth={2} name="Waist" dot={{ fill: "#1F6F78", r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="hips" stroke="#B79B6C" strokeWidth={2} name="Hips" dot={{ fill: "#B79B6C", r: 3 }} connectNulls />
                  {measurementData.some((d) => d.chest) && (
                    <Line type="monotone" dataKey="chest" stroke="#2D5A8E" strokeWidth={2} name="Chest" dot={{ fill: "#2D5A8E", r: 3 }} connectNulls />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal inline-block" />Waist</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gold inline-block" />Hips</span>
              {measurementData.some((d) => d.chest) && (
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-atlantic inline-block" />Chest</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily log table */}
      {dailyLogs.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Logs</CardTitle>
              <Link href="/dashboard/check-in">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Weekly Check-In <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 text-left">
                    {["Date", "Weight", "Protein", "Water", "Meds", "Mood"].map((h) => (
                      <th key={h} className="pb-3 font-medium text-graphite-400 text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {dailyLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-navy-50/30 transition-colors">
                      <td className="py-3 font-medium text-navy text-xs">{log.date}</td>
                      <td className="py-3 text-graphite-500 text-xs">
                        {log.weight ? `${Math.round(log.weight * 10) / 10} lbs` : "—"}
                      </td>
                      <td className="py-3 text-xs">
                        <span className={log.protein && log.protein >= 130 ? "text-teal font-medium" : "text-graphite-500"}>
                          {log.protein ? `${log.protein}g` : "—"}
                        </span>
                      </td>
                      <td className="py-3 text-xs">
                        <span className={log.water && log.water >= 80 ? "text-teal font-medium" : "text-graphite-500"}>
                          {log.water ? `${log.water}oz` : "—"}
                        </span>
                      </td>
                      <td className="py-3">
                        {log.medication !== null ? (
                          <Badge variant={log.medication ? "success" : "warning"} className="text-[10px]">
                            {log.medication ? "Yes" : "Missed"}
                          </Badge>
                        ) : "—"}
                      </td>
                      <td className="py-3">
                        {log.mood ? (
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <div key={n} className={`h-2.5 w-2.5 rounded-full ${n <= log.mood! ? "bg-teal" : "bg-navy-200"}`} />
                            ))}
                          </div>
                        ) : "—"}
                      </td>
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

// ---- Stat Card ----
function StatCard({
  label, value, sub, icon: Icon, trend, iconColor, progressPct,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: "good" | "bad" | "neutral";
  iconColor: string;
  progressPct?: number;
}) {
  const trendIcon = trend === "good"
    ? <TrendingDown className="h-3 w-3 text-emerald-600" />
    : trend === "bad"
    ? <TrendingUp className="h-3 w-3 text-amber-500" />
    : trend === "neutral"
    ? <Minus className="h-3 w-3 text-graphite-400" />
    : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-graphite-400">{label}</span>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <p className="text-2xl font-bold text-navy">{value}</p>
        {sub && (
          <div className="flex items-center gap-1 mt-0.5">
            {trendIcon}
            <p className="text-xs text-graphite-400">{sub}</p>
          </div>
        )}
        {progressPct !== undefined && (
          <div className="mt-2 h-1.5 w-full rounded-full bg-navy-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Log Form ----
function LogForm({
  form, setForm, onSubmit, onCancel, saved, submitting, error, showMeasurements, onToggleMeasurements,
}: {
  form: {
    weightLbs: string; proteinG: string; waterOz: string;
    waistInches: string; hipsInches: string; chestInches: string;
    medicationTaken: boolean; moodRating: number;
  };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  onSubmit: () => void;
  onCancel: () => void;
  saved: boolean;
  submitting?: boolean;
  error?: string | null;
  showMeasurements: boolean;
  onToggleMeasurements: () => void;
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
      <CardContent className="p-6 space-y-4">
        <h3 className="text-base font-bold text-navy">Quick Daily Log</h3>

        {/* Main fields */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Weight (lbs)</label>
            <Input type="number" value={form.weightLbs} onChange={(e) => setForm((p) => ({ ...p, weightLbs: e.target.value }))} placeholder="198" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Protein (g)</label>
            <Input type="number" value={form.proteinG} onChange={(e) => setForm((p) => ({ ...p, proteinG: e.target.value }))} placeholder="140" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Water (oz)</label>
            <Input type="number" value={form.waterOz} onChange={(e) => setForm((p) => ({ ...p, waterOz: e.target.value }))} placeholder="100" />
          </div>
        </div>

        {/* Medication + mood */}
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.medicationTaken}
              onChange={(e) => setForm((p) => ({ ...p, medicationTaken: e.target.checked }))}
              className="h-4 w-4 rounded border-navy-300 text-teal"
            />
            <span className="text-navy">Medication taken</span>
          </label>
          <div className="flex items-center gap-1">
            <span className="text-xs text-graphite-400 mr-1">Mood:</span>
            {["😞", "😕", "😐", "🙂", "😄"].map((emoji, i) => (
              <button
                key={i}
                onClick={() => setForm((p) => ({ ...p, moodRating: i + 1 }))}
                className={cn(
                  "text-lg transition-all",
                  form.moodRating === i + 1 ? "scale-125" : "opacity-40 hover:opacity-70"
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Measurements toggle */}
        <button
          onClick={onToggleMeasurements}
          className="flex items-center gap-2 text-xs font-semibold text-teal hover:text-teal-700 transition-colors"
        >
          {showMeasurements ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {showMeasurements ? "Hide" : "Add"} body measurements (optional)
        </button>

        {showMeasurements && (
          <div className="grid gap-3 sm:grid-cols-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Waist (in)</label>
              <Input type="number" step="0.1" value={form.waistInches} onChange={(e) => setForm((p) => ({ ...p, waistInches: e.target.value }))} placeholder="32" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Hips (in)</label>
              <Input type="number" step="0.1" value={form.hipsInches} onChange={(e) => setForm((p) => ({ ...p, hipsInches: e.target.value }))} placeholder="40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Chest (in)</label>
              <Input type="number" step="0.1" value={form.chestInches} onChange={(e) => setForm((p) => ({ ...p, chestInches: e.target.value }))} placeholder="36" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
            <Minus className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
        <div className="flex gap-3 pt-1">
          <Button onClick={onSubmit} disabled={submitting} className="gap-1.5">
            {submitting && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {submitting ? "Saving…" : "Save Log"}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}
