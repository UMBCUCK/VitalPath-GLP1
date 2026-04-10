"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Pill,
  Target,
  AlertTriangle,
  Calendar,
  Activity,
  Scale,
  ShieldAlert,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  BarChart3,
  BookOpen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type {
  DosageOverview,
  DosageScheduleRow,
  DosageAnalytics,
  AdherenceCorrelation,
} from "@/lib/admin-medication";

// ── Types ──────────────────────────────────────────────────────

interface CatalogMed {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  type: string;
  form: string;
  isActive: boolean;
  sortOrder: number;
}

interface Props {
  overview: DosageOverview;
  initialSchedules: DosageScheduleRow[];
  initialTotal: number;
  analytics: DosageAnalytics;
  correlation: AdherenceCorrelation;
  initialCatalog: CatalogMed[];
}

// ── Status badges ──────────────────────────────────────────────

const statusVariant = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "success" as const;
    case "PAUSED":
      return "warning" as const;
    case "COMPLETED":
      return "outline" as const;
    case "DISCONTINUED":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

// ── Severity colors for side effects ───────────────────────────

const SEVERITY_COLORS = {
  mild: "#22c55e",
  moderate: "#f59e0b",
  severe: "#ef4444",
};

const DOSE_COLORS = [
  "#0d9488",
  "#0891b2",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#65a30d",
  "#2563eb",
  "#c026d3",
];

// ── Component ──────────────────────────────────────────────────

const EMPTY_FORM: Omit<CatalogMed, "id" | "createdAt" | "updatedAt"> = {
  name: "", slug: "", description: "", imageUrl: "", type: "branded", form: "pen", isActive: true, sortOrder: 0,
};

export function MedicationClient({
  overview,
  initialSchedules,
  initialTotal,
  analytics,
  correlation,
  initialCatalog,
}: Props) {
  const [activeTab, setActiveTab] = useState<"analytics" | "catalog">("analytics");
  const [schedules] = useState(initialSchedules);
  const [total] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // ── Catalog state ──────────────────────────────────────────
  const [catalog, setCatalog] = useState<CatalogMed[]>(initialCatalog);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [formError, setFormError] = useState("");

  async function refreshCatalog() {
    const res = await fetch("/api/admin/medication-catalog");
    const data = await res.json();
    if (data.medications) setCatalog(data.medications);
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setShowForm(true);
  }

  function openEdit(med: CatalogMed) {
    setEditingId(med.id);
    setForm({
      name: med.name, slug: med.slug, description: med.description ?? "",
      imageUrl: med.imageUrl ?? "", type: med.type as CatalogMed["type"],
      form: med.form as CatalogMed["form"], isActive: med.isActive, sortOrder: med.sortOrder,
    });
    setFormError("");
    setShowForm(true);
  }

  async function saveForm() {
    setCatalogLoading(true);
    setFormError("");
    try {
      const url = "/api/admin/medication-catalog";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Save failed"); return; }
      await refreshCatalog();
      setShowForm(false);
    } finally {
      setCatalogLoading(false);
    }
  }

  async function deleteMed(id: string) {
    if (!confirm("Delete this medication?")) return;
    await fetch(`/api/admin/medication-catalog?id=${id}`, { method: "DELETE" });
    await refreshCatalog();
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // ── Column definitions ─────────────────────────────────────

  const columns: ColumnDef<DosageScheduleRow>[] = [
    {
      key: "patientName",
      header: "Patient",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.patientName}</p>
          <p className="text-xs text-graphite-400">{row.patientEmail}</p>
        </div>
      ),
    },
    {
      key: "medicationName",
      header: "Medication",
      render: (row) => (
        <span className="font-medium">{row.medicationName}</span>
      ),
    },
    {
      key: "currentDose",
      header: "Current Dose",
      render: (row) => (
        <span className="font-mono text-sm">{row.currentDose}</span>
      ),
    },
    {
      key: "targetDose",
      header: "Target Dose",
      render: (row) => (
        <span className="font-mono text-sm text-graphite-400">
          {row.targetDose}
        </span>
      ),
    },
    {
      key: "currentWeek",
      header: "Week",
      sortable: true,
      render: (row) => (
        <span className="font-semibold">{row.currentWeek}</span>
      ),
    },
    {
      key: "adherenceRate",
      header: "Adherence",
      sortable: true,
      render: (row) => {
        if (row.adherenceRate === null)
          return <span className="text-graphite-300">--</span>;
        const color =
          row.adherenceRate >= 80
            ? "text-emerald-600"
            : row.adherenceRate >= 60
            ? "text-amber-600"
            : "text-red-600";
        return (
          <span className={`font-semibold ${color}`}>
            {row.adherenceRate}%
          </span>
        );
      },
    },
    {
      key: "sideEffectsCount",
      header: "Side Effects",
      render: (row) =>
        row.sideEffectsCount > 0 ? (
          <Badge variant="warning">{row.sideEffectsCount}</Badge>
        ) : (
          <span className="text-graphite-300">0</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "nextDoseDate",
      header: "Next Dose",
      render: (row) =>
        row.nextDoseDate ? (
          <span className="text-xs">
            {new Date(row.nextDoseDate).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-graphite-300">--</span>
        ),
    },
    {
      key: "expand",
      header: "",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setExpandedRow(expandedRow === row.id ? null : row.id);
          }}
        >
          {expandedRow === row.id ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      ),
    },
  ];

  // ── Side effect chart data ─────────────────────────────────

  const sideEffectData = analytics.sideEffectFrequency
    .slice(0, 10)
    .map((s) => ({
      name: s.symptom,
      mild: s.severityBreakdown.mild,
      moderate: s.severityBreakdown.moderate,
      severe: s.severityBreakdown.severe,
      total: s.count,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Medication Management</h1>
          <p className="mt-1 text-sm text-graphite-400">
            GLP-1 titration analytics, adherence insights, and patient-facing medication catalog
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-navy-100/60">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
            activeTab === "analytics"
              ? "border-teal text-teal"
              : "border-transparent text-graphite-400 hover:text-navy"
          }`}
        >
          <BarChart3 className="h-4 w-4" /> Intelligence
        </button>
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
            activeTab === "catalog"
              ? "border-teal text-teal"
              : "border-transparent text-graphite-400 hover:text-navy"
          }`}
        >
          <BookOpen className="h-4 w-4" /> Medication Catalog
          {catalog.length > 0 && (
            <span className="rounded-full bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy">{catalog.length}</span>
          )}
        </button>
      </div>

      {/* ─── CATALOG TAB ─────────────────────────────────────── */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-navy">Medication Catalog</h2>
              <p className="text-xs text-graphite-400 mt-0.5">
                Medications shown to patients during the intake flow. Add images via URL (S3, CDN, or any hosted image).
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> Add Medication
            </Button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <Card className="border-teal/30 bg-teal-50/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-navy">
                    {editingId ? "Edit Medication" : "Add New Medication"}
                  </CardTitle>
                  <button onClick={() => setShowForm(false)}>
                    <X className="h-4 w-4 text-graphite-400 hover:text-navy" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Name *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => {
                        setForm((f) => ({
                          ...f,
                          name: e.target.value,
                          slug: editingId ? f.slug : autoSlug(e.target.value),
                        }));
                      }}
                      placeholder="e.g. Wegovy® Pen"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Slug * (URL-safe ID)</label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="e.g. wegovy-pen"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Image URL</label>
                  <Input
                    value={form.imageUrl ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.png (leave blank for icon placeholder)"
                  />
                  {form.imageUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="h-14 w-14 rounded-lg object-contain border border-navy-100"
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
                      />
                      <p className="text-xs text-graphite-400">Image preview</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Description (shown to patient)</label>
                  <Input
                    value={form.description ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="e.g. Once-weekly semaglutide injection"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                      className="calculator-input text-sm"
                    >
                      <option value="branded">Branded</option>
                      <option value="generic">Generic</option>
                      <option value="compounded">Compounded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Form</label>
                    <select
                      value={form.form}
                      onChange={(e) => setForm((f) => ({ ...f, form: e.target.value }))}
                      className="calculator-input text-sm"
                    >
                      <option value="pen">Pen</option>
                      <option value="pill">Pill / Oral</option>
                      <option value="injection">Injection</option>
                      <option value="oral">Oral Tablet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1">Sort Order</label>
                    <Input
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                        className="h-4 w-4 rounded border-navy-300 text-teal"
                      />
                      <span className="text-xs font-semibold text-navy">Active</span>
                    </label>
                  </div>
                </div>

                {formError && <p className="text-xs text-red-500 font-medium">{formError}</p>}

                <div className="flex gap-2 pt-1">
                  <Button onClick={saveForm} disabled={catalogLoading} className="gap-2">
                    <Check className="h-4 w-4" />
                    {catalogLoading ? "Saving..." : editingId ? "Save Changes" : "Add Medication"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Two-column medication grid */}
          {catalog.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Pill className="h-12 w-12 text-graphite-300 mb-4" />
                <p className="text-sm font-medium text-graphite-500">No medications in catalog yet</p>
                <p className="text-xs text-graphite-400 mt-1 mb-4">
                  Run <code className="bg-navy-50 px-1 rounded">npx prisma db push</code> then add medications above
                </p>
                <Button onClick={openCreate} size="sm" className="gap-2">
                  <Plus className="h-3.5 w-3.5" /> Add First Medication
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {catalog.map((med) => (
                <Card key={med.id} className={`relative overflow-hidden transition-all ${!med.isActive ? "opacity-50" : ""}`}>
                  <CardContent className="p-4">
                    {/* Image */}
                    <div className="flex justify-center mb-3">
                      {med.imageUrl ? (
                        <img
                          src={med.imageUrl}
                          alt={med.name}
                          className="h-20 w-20 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "";
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-navy-50">
                          <Pill className="h-10 w-10 text-navy-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <p className="text-sm font-bold text-navy text-center leading-tight mb-1">{med.name}</p>
                    {med.description && (
                      <p className="text-[11px] text-graphite-400 text-center mb-2 leading-tight">{med.description}</p>
                    )}
                    <div className="flex items-center justify-center gap-1.5 mb-3">
                      <Badge variant="secondary" className="text-[10px] capitalize">{med.type}</Badge>
                      <Badge variant="outline" className="text-[10px] capitalize">{med.form}</Badge>
                      {!med.isActive && <Badge variant="destructive" className="text-[10px]">Hidden</Badge>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs gap-1" onClick={() => openEdit(med)}>
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => deleteMed(med.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── ANALYTICS TAB ───────────────────────────────────── */}
      {activeTab === "analytics" && (
      <>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Active Schedules"
          value={overview.totalActive.toLocaleString()}
          icon={Pill}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Avg Adherence"
          value={`${overview.avgAdherence}%`}
          icon={Activity}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="At Target Dose"
          value={overview.atTargetDose.toLocaleString()}
          icon={Target}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Avg Weeks to Target"
          value={overview.avgWeeksToTarget.toString()}
          icon={Calendar}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Side Effect Reports"
          value={overview.patientsWithSideEffects.toLocaleString()}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Charts Row 1: Dose Distribution + Adherence Trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Dose Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy">
              Dose Distribution
            </CardTitle>
            <p className="text-xs text-graphite-400">
              Patient count at each dose level
            </p>
          </CardHeader>
          <CardContent>
            {analytics.doseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.doseDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="dose"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]}>
                    {analytics.doseDistribution.map((_, i) => (
                      <Cell
                        key={i}
                        fill={DOSE_COLORS[i % DOSE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-graphite-300">
                No dosage data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adherence Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy">
              Adherence Trend by Week
            </CardTitle>
            <p className="text-xs text-graphite-400">
              Average adherence rate at each week of titration
            </p>
          </CardHeader>
          <CardContent>
            {analytics.adherenceByWeek.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={analytics.adherenceByWeek}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    label={{
                      value: "Week",
                      position: "insideBottom",
                      offset: -5,
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    label={{
                      value: "Adherence %",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value}%`,
                      "Avg Adherence",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgAdherence"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#0d9488" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[280px] items-center justify-center text-graphite-300">
                No adherence data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Side Effects + Weight Loss by Dose */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Side Effect Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy">
              Side Effect Analysis
            </CardTitle>
            <p className="text-xs text-graphite-400">
              Frequency by symptom, colored by severity
            </p>
          </CardHeader>
          <CardContent>
            {sideEffectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={sideEffectData}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="#94a3b8"
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="mild"
                    name="Mild"
                    stackId="severity"
                    fill={SEVERITY_COLORS.mild}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="moderate"
                    name="Moderate"
                    stackId="severity"
                    fill={SEVERITY_COLORS.moderate}
                  />
                  <Bar
                    dataKey="severe"
                    name="Severe"
                    stackId="severity"
                    fill={SEVERITY_COLORS.severe}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[320px] items-center justify-center text-graphite-300">
                No side effect data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weight Loss by Dose */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy">
              Weight Loss by Dose Level
            </CardTitle>
            <p className="text-xs text-graphite-400">
              Average weight loss (lbs) at each dose level
            </p>
          </CardHeader>
          <CardContent>
            {analytics.weightLossByDose.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={analytics.weightLossByDose}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="dose"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "avgWeightLoss"
                        ? `${value} lbs`
                        : `${value} patients`,
                      name === "avgWeightLoss"
                        ? "Avg Weight Loss"
                        : "Patient Count",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey="avgWeightLoss"
                    name="avgWeightLoss"
                    fill="#0d9488"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[320px] items-center justify-center text-graphite-300">
                No weight loss data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Correlation Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Scale className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-graphite-400">
                  Adherence vs Weight Loss
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-emerald-50/50 p-3 text-center">
                <p className="text-xs text-graphite-400">High Adherence</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {correlation.weightLoss.highAdherence} lbs
                </p>
              </div>
              <div className="rounded-lg bg-red-50/50 p-3 text-center">
                <p className="text-xs text-graphite-400">Low Adherence</p>
                <p className="mt-1 text-xl font-bold text-red-600">
                  {correlation.weightLoss.lowAdherence} lbs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-graphite-400">
                  Adherence vs Churn Risk
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-emerald-50/50 p-3 text-center">
                <p className="text-xs text-graphite-400">High Adherence</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {correlation.churnRisk.highAdherence}%
                </p>
              </div>
              <div className="rounded-lg bg-red-50/50 p-3 text-center">
                <p className="text-xs text-graphite-400">Low Adherence</p>
                <p className="mt-1 text-xl font-bold text-red-600">
                  {correlation.churnRisk.lowAdherence}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-graphite-400">
                  Adherence vs Retention
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-emerald-50/50 p-3 text-center">
                <p className="text-xs text-graphite-400">High Adherence</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {correlation.retention.highAdherence}%
                </p>
              </div>
              <div className="rounded-lg bg-red-50/50 p-3 text-center">
                <p className="text-xs text-graphite-400">Low Adherence</p>
                <p className="mt-1 text-xl font-bold text-red-600">
                  {correlation.retention.lowAdherence}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time to Target Distribution */}
      {analytics.timeToTarget.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy">
              Time to Target Dose Distribution
            </CardTitle>
            <p className="text-xs text-graphite-400">
              Number of patients reaching target dose by week
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.timeToTarget}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="weeks"
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  label={{
                    value: "Weeks",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 11,
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Patients"
                  fill="#7c3aed"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Dosage Schedules Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-navy">
            Dosage Schedules
          </CardTitle>
          <p className="text-xs text-graphite-400">
            All patient titration schedules with escalation plans
          </p>
        </CardHeader>
        <CardContent>
          <DataTable
            data={schedules}
            columns={columns}
            total={total}
            page={page}
            limit={25}
            onPageChange={setPage}
            getRowId={(row) => row.id}
            searchPlaceholder="Search patients..."
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "All", value: "all" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Paused", value: "PAUSED" },
                  { label: "Completed", value: "COMPLETED" },
                  { label: "Discontinued", value: "DISCONTINUED" },
                ],
              },
            ]}
            emptyMessage="No dosage schedules found"
          />

          {/* Expanded Row - Escalation Plan Timeline */}
          {expandedRow && (
            <div className="mt-4 rounded-xl border border-navy-100/60 bg-linen/20 p-5">
              {(() => {
                const row = schedules.find((s) => s.id === expandedRow);
                if (!row) return null;
                return (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-navy">
                        Escalation Plan: {row.patientName}
                      </h3>
                      <Badge variant={statusVariant(row.status)}>
                        {row.status}
                      </Badge>
                    </div>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 h-full w-0.5 bg-navy-100/40" />

                      {row.escalationPlan.map(
                        (
                          step: {
                            week: number;
                            dose: string;
                            notes?: string;
                          },
                          i: number
                        ) => {
                          const isCurrentWeek = step.week === row.currentWeek;
                          const isPast = step.week < row.currentWeek;
                          const isFuture = step.week > row.currentWeek;

                          return (
                            <div
                              key={i}
                              className="relative mb-4 ml-10 last:mb-0"
                            >
                              {/* Timeline dot */}
                              <div
                                className={`absolute -left-[34px] top-1 h-3 w-3 rounded-full border-2 ${
                                  isCurrentWeek
                                    ? "border-teal bg-teal"
                                    : isPast
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-navy-200 bg-white"
                                }`}
                              />
                              <div
                                className={`rounded-lg p-3 ${
                                  isCurrentWeek
                                    ? "border border-teal/30 bg-teal-50/50"
                                    : isPast
                                    ? "bg-emerald-50/30"
                                    : "bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-medium text-graphite-400">
                                    Week {step.week}
                                  </span>
                                  <span className="font-mono text-sm font-semibold text-navy">
                                    {step.dose}
                                  </span>
                                  {isCurrentWeek && (
                                    <Badge
                                      variant="success"
                                      className="text-[10px]"
                                    >
                                      Current
                                    </Badge>
                                  )}
                                  {isPast && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px]"
                                    >
                                      Completed
                                    </Badge>
                                  )}
                                  {isFuture && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px]"
                                    >
                                      Upcoming
                                    </Badge>
                                  )}
                                </div>
                                {step.notes && (
                                  <p className="mt-1 text-xs text-graphite-400">
                                    {step.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {row.providerNotes && (
                      <div className="mt-4 rounded-lg bg-amber-50/50 p-3">
                        <p className="text-xs font-medium text-amber-800">
                          Provider Notes
                        </p>
                        <p className="mt-1 text-sm text-amber-700">
                          {row.providerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>
      </>
      )}

    </div>
  );
}
