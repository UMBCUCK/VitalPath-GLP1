"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import {
  DollarSign, Zap, BarChart3, TrendingUp, Plus, X,
  Pencil, Trash2, Calculator, Globe, Clock, Users, Layers,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

interface PricingRule {
  id: string;
  name: string;
  productId: string | null;
  productName: string;
  ruleType: string;
  conditions: { field: string; operator: string; value: string }[];
  adjustment: string;
  adjustmentValue: number;
  priority: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  priceMonthly: number;
  slug: string;
}

interface Analytics {
  totalRules: number;
  activeRules: number;
  totalUsage: number;
  estimatedSavingsCents: number;
  mostUsedRule: { id: string; name: string; usageCount: number } | null;
  revenueByType: Record<string, number>;
}

interface SimulationResult {
  currentRevenue: number;
  projectedRevenue: number;
  affectedSubscribers: number;
  revenueImpact: number;
}

interface Props {
  initialRules: PricingRule[];
  initialTotal: number;
  initialAnalytics: Analytics;
  products: Product[];
}

// ─── Helpers ────────────────────────────────────────────────

const ruleTypeBadge = (type: string) => {
  const map: Record<string, { label: string; className: string }> = {
    GEOGRAPHIC: { label: "Geographic", className: "bg-blue-50 text-blue-700 border-blue-200" },
    TIME_BASED: { label: "Time-Based", className: "bg-amber-50 text-amber-700 border-amber-200" },
    SEGMENT: { label: "Segment", className: "bg-teal-50 text-teal-700 border-teal-200" },
    VOLUME: { label: "Volume", className: "bg-purple-50 text-purple-700 border-purple-200" },
  };
  const cfg = map[type] || { label: type, className: "bg-gray-50 text-gray-700 border-gray-200" };
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
};

const ruleTypeIcon = (type: string) => {
  switch (type) {
    case "GEOGRAPHIC": return <Globe className="h-4 w-4" />;
    case "TIME_BASED": return <Clock className="h-4 w-4" />;
    case "SEGMENT": return <Users className="h-4 w-4" />;
    case "VOLUME": return <Layers className="h-4 w-4" />;
    default: return <Zap className="h-4 w-4" />;
  }
};

function adjustmentDescription(adjustment: string, value: number) {
  switch (adjustment) {
    case "PERCENTAGE_OFF":
      return `${(value / 100).toFixed(value % 100 === 0 ? 0 : 1)}% off`;
    case "FLAT_OFF":
      return `${formatPrice(value)} off`;
    case "OVERRIDE":
      return `Override to ${formatPrice(value)}`;
    default:
      return String(value);
  }
}

function formatDateShort(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

// ─── Default form state ─────────────────────────────────────

const defaultForm = {
  name: "",
  productId: "",
  ruleType: "GEOGRAPHIC" as string,
  conditions: [{ field: "", operator: "equals", value: "" }],
  adjustment: "PERCENTAGE_OFF" as string,
  adjustmentValue: "",
  priority: "0",
  isActive: true,
  startsAt: "",
  endsAt: "",
};

// ─── Component ──────────────────────────────────────────────

export function PricingClient({
  initialRules,
  initialTotal,
  initialAnalytics,
  products,
}: Props) {
  const [rules, setRules] = useState<PricingRule[]>(initialRules);
  const [total, setTotal] = useState(initialTotal);
  const [analytics, setAnalytics] = useState<Analytics>(initialAnalytics);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 50;

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  // Simulator state
  const [simProductId, setSimProductId] = useState("");
  const [simNewPrice, setSimNewPrice] = useState("");
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  // ── Fetch rules ──────────────────────────────────────────

  const fetchRules = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) });
      const res = await fetch(`/api/admin/pricing-rules?${params}`);
      const data = await res.json();
      setRules(data.rules || []);
      setTotal(data.total || 0);
    } catch {
      // keep existing state
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const refreshAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pricing-rules?action=analytics");
      const data = await res.json();
      setAnalytics(data);
    } catch {
      // keep existing
    }
  }, []);

  // ── CRUD actions ─────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        name: form.name,
        productId: form.productId || null,
        ruleType: form.ruleType,
        conditions: form.conditions.filter((c) => c.field),
        adjustment: form.adjustment,
        adjustmentValue: parseInt(form.adjustmentValue, 10) || 0,
        priority: parseInt(form.priority, 10) || 0,
        isActive: form.isActive,
        startsAt: form.startsAt || null,
        endsAt: form.endsAt || null,
      };

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/pricing-rules", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setForm(defaultForm);
        await fetchRules(page);
        await refreshAnalytics();
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pricing rule?")) return;
    try {
      const res = await fetch(`/api/admin/pricing-rules?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchRules(page);
        await refreshAnalytics();
      }
    } catch {
      // silent
    }
  };

  const handleToggleActive = async (rule: PricingRule) => {
    try {
      await fetch("/api/admin/pricing-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rule.id, isActive: !rule.isActive }),
      });
      await fetchRules(page);
      await refreshAnalytics();
    } catch {
      // silent
    }
  };

  const handleEdit = (rule: PricingRule) => {
    setEditingId(rule.id);
    setForm({
      name: rule.name,
      productId: rule.productId || "",
      ruleType: rule.ruleType,
      conditions:
        rule.conditions.length > 0
          ? rule.conditions
          : [{ field: "", operator: "equals", value: "" }],
      adjustment: rule.adjustment,
      adjustmentValue: String(rule.adjustmentValue),
      priority: String(rule.priority),
      isActive: rule.isActive,
      startsAt: rule.startsAt ? rule.startsAt.slice(0, 10) : "",
      endsAt: rule.endsAt ? rule.endsAt.slice(0, 10) : "",
    });
    setShowForm(true);
  };

  // ── Simulator ────────────────────────────────────────────

  const handleSimulate = async () => {
    if (!simProductId || !simNewPrice) return;
    setSimulating(true);
    try {
      const priceCents = Math.round(parseFloat(simNewPrice) * 100);
      const res = await fetch(
        `/api/admin/pricing-rules?action=simulate&productId=${simProductId}&newPrice=${priceCents}`
      );
      const data = await res.json();
      setSimResult(data);
    } catch {
      // silent
    } finally {
      setSimulating(false);
    }
  };

  // ── Conditions builder ───────────────────────────────────

  const addCondition = () => {
    setForm((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { field: "", operator: "equals", value: "" }],
    }));
  };

  const removeCondition = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== idx),
    }));
  };

  const updateCondition = (idx: number, key: string, val: string) => {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c, i) =>
        i === idx ? { ...c, [key]: val } : c
      ),
    }));
  };

  // ── Table columns ────────────────────────────────────────

  const columns: ColumnDef<PricingRule>[] = [
    {
      key: "name",
      header: "Rule Name",
      sortable: true,
      render: (row) => (
        <div className="font-medium text-navy">{row.name}</div>
      ),
    },
    {
      key: "ruleType",
      header: "Type",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {ruleTypeIcon(row.ruleType)}
          {ruleTypeBadge(row.ruleType)}
        </div>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (row) => (
        <span className="text-sm text-graphite-500">{row.productName}</span>
      ),
    },
    {
      key: "adjustment",
      header: "Adjustment",
      render: (row) => (
        <span className="font-medium text-teal-700">
          {adjustmentDescription(row.adjustment, row.adjustmentValue)}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy">
          {row.priority}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Active",
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(row); }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            row.isActive ? "bg-teal" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              row.isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      key: "usageCount",
      header: "Usage",
      sortable: true,
      className: "text-right",
      render: (row) => (
        <span className="text-sm text-graphite-500">{row.usageCount.toLocaleString()}</span>
      ),
    },
    {
      key: "dates",
      header: "Date Range",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {formatDateShort(row.startsAt)} - {formatDateShort(row.endsAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
            className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
            className="rounded-lg p-1.5 text-graphite-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // ── CSV Export ────────────────────────────────────────────

  const handleExportCSV = () => {
    exportToCSV(
      rules,
      [
        { key: "name", header: "Name", getValue: (r) => r.name },
        { key: "ruleType", header: "Type", getValue: (r) => r.ruleType },
        { key: "product", header: "Product", getValue: (r) => r.productName },
        { key: "adjustment", header: "Adjustment", getValue: (r) => adjustmentDescription(r.adjustment, r.adjustmentValue) },
        { key: "priority", header: "Priority", getValue: (r) => String(r.priority) },
        { key: "isActive", header: "Active", getValue: (r) => r.isActive ? "Yes" : "No" },
        { key: "usageCount", header: "Usage", getValue: (r) => String(r.usageCount) },
      ],
      "pricing-rules"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dynamic Pricing Engine</h1>
          <p className="mt-1 text-sm text-graphite-400">
            Create and manage pricing rules with geographic, time-based, segment, and volume adjustments
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setForm(defaultForm);
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> New Rule
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Rules"
          value={String(analytics.totalRules)}
          icon={Zap}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Active Rules"
          value={String(analytics.activeRules)}
          icon={BarChart3}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Total Usage"
          value={analytics.totalUsage.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Est. Revenue Impact"
          value={formatPrice(analytics.estimatedSavingsCents)}
          icon={DollarSign}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Price Simulator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-teal" />
            Price Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[200px] flex-1">
              <label className="mb-1 block text-xs font-medium text-graphite-500">Product</label>
              <select
                value={simProductId}
                onChange={(e) => { setSimProductId(e.target.value); setSimResult(null); }}
                className="flex h-11 w-full rounded-xl border border-navy-200 bg-white px-4 py-2 text-sm text-navy-800 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
              >
                <option value="">Select product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatPrice(p.priceMonthly)}/mo)
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[160px]">
              <label className="mb-1 block text-xs font-medium text-graphite-500">
                New Price ($)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 199.00"
                value={simNewPrice}
                onChange={(e) => { setSimNewPrice(e.target.value); setSimResult(null); }}
              />
            </div>
            <Button onClick={handleSimulate} disabled={simulating || !simProductId || !simNewPrice}>
              {simulating ? "Simulating..." : "Simulate"}
            </Button>
          </div>

          {simResult && (
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl bg-linen/40 p-4 sm:grid-cols-4">
              <div>
                <p className="text-xs font-medium text-graphite-400">Current Revenue</p>
                <p className="mt-0.5 text-lg font-bold text-navy">
                  {formatPrice(simResult.currentRevenue)}
                  <span className="text-xs font-normal text-graphite-400">/mo</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-graphite-400">Projected Revenue</p>
                <p className="mt-0.5 text-lg font-bold text-navy">
                  {formatPrice(simResult.projectedRevenue)}
                  <span className="text-xs font-normal text-graphite-400">/mo</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-graphite-400">Affected Subscribers</p>
                <p className="mt-0.5 text-lg font-bold text-navy">{simResult.affectedSubscribers}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-graphite-400">Revenue Impact</p>
                <p className={`mt-0.5 text-lg font-bold ${simResult.revenueImpact >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {simResult.revenueImpact >= 0 ? "+" : ""}{formatPrice(simResult.revenueImpact)}
                  <span className="text-xs font-normal text-graphite-400">/mo</span>
                  <span className="ml-2 text-sm font-medium">
                    ({simResult.currentRevenue > 0
                      ? ((simResult.revenueImpact / simResult.currentRevenue) * 100).toFixed(1)
                      : "0"
                    }%)
                  </span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New/Edit Rule Form */}
      {showForm && (
        <Card className="border-teal/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {editingId ? "Edit Pricing Rule" : "New Pricing Rule"}
              </CardTitle>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Row 1: Name + Product */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Rule Name</label>
                <Input
                  placeholder="e.g. Texas Holiday Discount"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Product</label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                  className="flex h-11 w-full rounded-xl border border-navy-200 bg-white px-4 py-2 text-sm text-navy-800 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                >
                  <option value="">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Rule Type */}
            <div>
              <label className="mb-2 block text-xs font-medium text-graphite-500">Rule Type</label>
              <div className="flex flex-wrap gap-3">
                {(["GEOGRAPHIC", "TIME_BASED", "SEGMENT", "VOLUME"] as const).map((t) => (
                  <label
                    key={t}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                      form.ruleType === t
                        ? "border-teal bg-teal-50 text-teal-800"
                        : "border-navy-200 text-graphite-500 hover:border-navy-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="ruleType"
                      value={t}
                      checked={form.ruleType === t}
                      onChange={(e) => setForm((f) => ({ ...f, ruleType: e.target.value }))}
                      className="sr-only"
                    />
                    {ruleTypeIcon(t)}
                    {t.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()).replace(" Based", "-Based")}
                  </label>
                ))}
              </div>
            </div>

            {/* Row 3: Conditions */}
            <div>
              <label className="mb-2 block text-xs font-medium text-graphite-500">Conditions</label>
              <div className="space-y-2">
                {form.conditions.map((cond, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={cond.field}
                      onChange={(e) => updateCondition(idx, "field", e.target.value)}
                      className="h-10 rounded-lg border border-navy-200 bg-white px-3 text-sm focus:border-teal focus:outline-none"
                    >
                      <option value="">Field...</option>
                      <option value="state">State</option>
                      <option value="segment">Segment</option>
                      <option value="quantity">Quantity</option>
                      <option value="lifecycleStage">Lifecycle Stage</option>
                    </select>
                    <select
                      value={cond.operator}
                      onChange={(e) => updateCondition(idx, "operator", e.target.value)}
                      className="h-10 rounded-lg border border-navy-200 bg-white px-3 text-sm focus:border-teal focus:outline-none"
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not equals</option>
                      <option value="contains">contains</option>
                      <option value="in">in (comma-sep)</option>
                      <option value="greater_than">greater than</option>
                      <option value="less_than">less than</option>
                      <option value="greater_equal">greater or equal</option>
                      <option value="less_equal">less or equal</option>
                    </select>
                    <Input
                      placeholder="Value"
                      value={cond.value}
                      onChange={(e) => updateCondition(idx, "value", e.target.value)}
                      className="h-10 flex-1"
                    />
                    {form.conditions.length > 1 && (
                      <button
                        onClick={() => removeCondition(idx)}
                        className="rounded-lg p-1.5 text-graphite-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addCondition}
                className="mt-2 text-xs font-medium text-teal hover:text-teal-800 transition-colors"
              >
                + Add condition
              </button>
            </div>

            {/* Row 4: Adjustment */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-graphite-500">Adjustment Type</label>
                <div className="flex flex-wrap gap-3">
                  {([
                    { value: "PERCENTAGE_OFF", label: "% Off" },
                    { value: "FLAT_OFF", label: "$ Off" },
                    { value: "OVERRIDE", label: "Price Override" },
                  ] as const).map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                        form.adjustment === opt.value
                          ? "border-teal bg-teal-50 text-teal-800"
                          : "border-navy-200 text-graphite-500 hover:border-navy-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="adjustment"
                        value={opt.value}
                        checked={form.adjustment === opt.value}
                        onChange={(e) => setForm((f) => ({ ...f, adjustment: e.target.value }))}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  {form.adjustment === "PERCENTAGE_OFF"
                    ? "Percentage (in hundredths, e.g. 1500 = 15%)"
                    : form.adjustment === "FLAT_OFF"
                    ? "Amount Off (cents)"
                    : "Override Price (cents)"}
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder={form.adjustment === "PERCENTAGE_OFF" ? "1500" : "2000"}
                  value={form.adjustmentValue}
                  onChange={(e) => setForm((f) => ({ ...f, adjustmentValue: e.target.value }))}
                />
              </div>
            </div>

            {/* Row 5: Priority + Dates + Active */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Priority</label>
                <Input
                  type="number"
                  min="0"
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Start Date</label>
                <Input
                  type="date"
                  value={form.startsAt}
                  onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">End Date</label>
                <Input
                  type="date"
                  value={form.endsAt}
                  onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 pb-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-navy-200 text-teal accent-teal"
                  />
                  <span className="text-sm font-medium text-graphite-600">Active</span>
                </label>
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving || !form.name}>
                {saving ? "Saving..." : editingId ? "Update Rule" : "Create Rule"}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules DataTable */}
      <DataTable
        data={rules}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        onPageChange={(p) => { setPage(p); fetchRules(p); }}
        onExportCSV={handleExportCSV}
        getRowId={(r) => r.id}
        searchPlaceholder="Search rules..."
        emptyMessage="No pricing rules yet. Create your first rule above."
        loading={loading}
      />
    </div>
  );
}
