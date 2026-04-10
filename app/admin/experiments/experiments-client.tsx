"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FlaskConical,
  Plus,
  Play,
  Pause,
  StopCircle,
  RotateCw,
  ChevronDown,
  ChevronRight,
  Trash2,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

interface Variant {
  id: string;
  name: string;
  weight: number;
}

interface VariantResult {
  variantId: string;
  variantName: string;
  assignments: number;
  conversions: number;
  conversionRate: number;
  totalRevenue: number;
  confidence: number;
}

interface Experiment {
  id: string;
  name: string;
  description: string | null;
  status: string;
  metric: string;
  variants: Variant[];
  variantCount: number;
  totalAssignments: number;
  results: unknown;
  startedAt: string | Date | null;
  endedAt: string | Date | null;
  createdBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

const STATUS_BADGE: Record<string, "secondary" | "success" | "warning" | "outline"> = {
  DRAFT: "secondary",
  RUNNING: "success",
  PAUSED: "warning",
  COMPLETED: "outline",
};

const METRICS = [
  { value: "conversion_rate", label: "Conversion Rate" },
  { value: "revenue", label: "Revenue" },
  { value: "retention", label: "Retention" },
  { value: "engagement", label: "Engagement" },
];

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Component ──────────────────────────────────────────────

export function ExperimentsClient({
  initialExperiments,
  initialTotal,
}: {
  initialExperiments: Experiment[];
  initialTotal: number;
}) {
  const [experiments, setExperiments] = useState<Experiment[]>(initialExperiments);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, VariantResult[]>>({});
  const [loadingResults, setLoadingResults] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formMetric, setFormMetric] = useState("conversion_rate");
  const [formVariants, setFormVariants] = useState<Variant[]>([
    { id: generateId(), name: "Control", weight: 50 },
    { id: generateId(), name: "Variant A", weight: 50 },
  ]);
  const [creating, setCreating] = useState(false);

  // ── Create experiment ──────────────────────────────────────
  const handleCreate = useCallback(async () => {
    if (!formName.trim() || formVariants.length < 2) return;
    setCreating(true);

    try {
      const res = await fetch("/api/admin/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDesc.trim() || undefined,
          metric: formMetric,
          variants: formVariants,
        }),
      });

      if (res.ok) {
        const { experiment } = await res.json();
        setExperiments((prev) => [
          {
            ...experiment,
            variantCount: formVariants.length,
            totalAssignments: 0,
            variants: formVariants,
          },
          ...prev,
        ]);
        setShowForm(false);
        setFormName("");
        setFormDesc("");
        setFormMetric("conversion_rate");
        setFormVariants([
          { id: generateId(), name: "Control", weight: 50 },
          { id: generateId(), name: "Variant A", weight: 50 },
        ]);
      }
    } finally {
      setCreating(false);
    }
  }, [formName, formDesc, formMetric, formVariants]);

  // ── Update status ──────────────────────────────────────────
  const updateStatus = useCallback(async (id: string, status: string) => {
    const res = await fetch("/api/admin/experiments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) {
      setExperiments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    }
  }, []);

  // ── Fetch results for expanded row ─────────────────────────
  const toggleExpand = useCallback(
    async (id: string) => {
      if (expandedId === id) {
        setExpandedId(null);
        return;
      }

      setExpandedId(id);

      if (!results[id]) {
        setLoadingResults(id);
        try {
          const res = await fetch(
            `/api/admin/experiments?experimentId=${id}`
          );
          if (res.ok) {
            const data = await res.json();
            setResults((prev) => ({ ...prev, [id]: data.results }));
          }
        } finally {
          setLoadingResults(null);
        }
      }
    },
    [expandedId, results]
  );

  // ── Add/remove variant in form ─────────────────────────────
  const addVariant = useCallback(() => {
    const letter = String.fromCharCode(65 + formVariants.length - 1);
    setFormVariants((prev) => [
      ...prev,
      { id: generateId(), name: `Variant ${letter}`, weight: 50 },
    ]);
  }, [formVariants.length]);

  const removeVariant = useCallback((id: string) => {
    setFormVariants((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const updateVariant = useCallback(
    (id: string, field: "name" | "weight", value: string | number) => {
      setFormVariants((prev) =>
        prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
      );
    },
    []
  );

  // ── Confidence badge ───────────────────────────────────────
  function ConfidenceBadge({ confidence }: { confidence: number }) {
    if (confidence === -1) {
      return (
        <Badge variant="outline" className="text-[10px]">
          Control
        </Badge>
      );
    }
    if (confidence >= 95) {
      return (
        <Badge variant="success" className="text-[10px]">
          Significant ({confidence}%)
        </Badge>
      );
    }
    if (confidence >= 90) {
      return (
        <Badge variant="warning" className="text-[10px]">
          Promising ({confidence}%)
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-[10px]">
        Not significant ({confidence}%)
      </Badge>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-teal" />
            Experiments
          </h2>
          <p className="text-sm text-graphite-400">
            A/B tests and multivariate experiments ({initialTotal} total)
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> New Experiment
            </>
          )}
        </Button>
      </div>

      {/* New experiment form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Experiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Name
                </label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Pricing Page CTA Color"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Metric
                </label>
                <select
                  value={formMetric}
                  onChange={(e) => setFormMetric(e.target.value)}
                  className="w-full rounded-lg border border-navy-100/60 bg-white px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/30"
                >
                  {METRICS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">
                Description (optional)
              </label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="What hypothesis are you testing?"
                className="w-full rounded-lg border border-navy-100/60 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
                rows={2}
              />
            </div>

            {/* Variants builder */}
            <div>
              <label className="block text-xs font-semibold text-navy mb-2">
                Variants
              </label>
              <div className="space-y-2">
                {formVariants.map((v, i) => (
                  <div key={v.id} className="flex items-center gap-3">
                    <Input
                      value={v.name}
                      onChange={(e) =>
                        updateVariant(v.id, "name", e.target.value)
                      }
                      placeholder="Variant name"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={v.weight}
                        onChange={(e) =>
                          updateVariant(
                            v.id,
                            "weight",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20 text-center"
                        min={1}
                        max={100}
                      />
                      <span className="text-xs text-graphite-400">%</span>
                    </div>
                    {formVariants.length > 2 && (
                      <button
                        onClick={() => removeVariant(v.id)}
                        className="rounded-lg p-1.5 text-graphite-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="mt-2 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Variant
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-navy-100/40">
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formName.trim() || formVariants.length < 2 || creating}
              >
                {creating ? "Creating..." : "Create Experiment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experiments table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-linen/30">
                  <th className="w-8 px-3 py-3" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Variants
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Assignments
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {experiments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-graphite-300"
                    >
                      No experiments yet. Create your first one!
                    </td>
                  </tr>
                ) : (
                  experiments.map((exp) => (
                    <>
                      {/* Main row */}
                      <tr
                        key={exp.id}
                        className="hover:bg-linen/20 transition-colors cursor-pointer"
                        onClick={() => toggleExpand(exp.id)}
                      >
                        <td className="px-3 py-3 text-graphite-300">
                          {expandedId === exp.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy">{exp.name}</p>
                          {exp.description && (
                            <p className="text-xs text-graphite-400 truncate max-w-xs">
                              {exp.description}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_BADGE[exp.status] || "secondary"}>
                            {exp.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-graphite-500 capitalize">
                          {exp.metric.replace("_", " ")}
                        </td>
                        <td className="px-4 py-3 text-center text-navy font-medium">
                          {exp.variantCount}
                        </td>
                        <td className="px-4 py-3 text-center text-navy font-medium">
                          {exp.totalAssignments}
                        </td>
                        <td className="px-4 py-3 text-xs text-graphite-400">
                          {new Date(exp.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          className="px-4 py-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {exp.status === "DRAFT" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-xs h-7"
                                onClick={() =>
                                  updateStatus(exp.id, "RUNNING")
                                }
                              >
                                <Play className="h-3 w-3" /> Start
                              </Button>
                            )}
                            {exp.status === "RUNNING" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-xs h-7"
                                onClick={() =>
                                  updateStatus(exp.id, "PAUSED")
                                }
                              >
                                <Pause className="h-3 w-3" /> Pause
                              </Button>
                            )}
                            {exp.status === "PAUSED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-xs h-7"
                                onClick={() =>
                                  updateStatus(exp.id, "RUNNING")
                                }
                              >
                                <RotateCw className="h-3 w-3" /> Resume
                              </Button>
                            )}
                            {(exp.status === "RUNNING" ||
                              exp.status === "PAUSED") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-xs h-7"
                                onClick={() =>
                                  updateStatus(exp.id, "COMPLETED")
                                }
                              >
                                <StopCircle className="h-3 w-3" /> Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded results row */}
                      {expandedId === exp.id && (
                        <tr key={`${exp.id}-results`}>
                          <td colSpan={8} className="bg-navy-50/20 px-8 py-4">
                            {loadingResults === exp.id ? (
                              <div className="flex items-center justify-center py-6">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-teal border-t-transparent" />
                                <span className="ml-2 text-sm text-graphite-400">
                                  Computing results...
                                </span>
                              </div>
                            ) : results[exp.id] ? (
                              <div>
                                <h4 className="text-sm font-semibold text-navy mb-3">
                                  Results by Variant
                                </h4>
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-navy-100/40">
                                      <th className="py-2 text-left text-graphite-400 font-medium">
                                        Variant
                                      </th>
                                      <th className="py-2 text-center text-graphite-400 font-medium">
                                        Assignments
                                      </th>
                                      <th className="py-2 text-center text-graphite-400 font-medium">
                                        Conversions
                                      </th>
                                      <th className="py-2 text-center text-graphite-400 font-medium">
                                        Rate
                                      </th>
                                      <th className="py-2 text-center text-graphite-400 font-medium">
                                        Revenue
                                      </th>
                                      <th className="py-2 text-center text-graphite-400 font-medium">
                                        Confidence
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-navy-100/20">
                                    {results[exp.id].map((r) => (
                                      <tr key={r.variantId}>
                                        <td className="py-2 font-medium text-navy">
                                          {r.variantName}
                                        </td>
                                        <td className="py-2 text-center text-graphite-500">
                                          {r.assignments}
                                        </td>
                                        <td className="py-2 text-center text-graphite-500">
                                          {r.conversions}
                                        </td>
                                        <td className="py-2 text-center font-medium text-navy">
                                          {r.conversionRate}%
                                        </td>
                                        <td className="py-2 text-center text-graphite-500">
                                          {formatPrice(r.totalRevenue)}
                                        </td>
                                        <td className="py-2 text-center">
                                          <ConfidenceBadge
                                            confidence={r.confidence}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-graphite-300 text-center py-4">
                                No results available yet
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
