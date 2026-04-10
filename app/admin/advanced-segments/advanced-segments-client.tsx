"use client";

import { useState, useCallback } from "react";
import {
  Filter,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Users,
  Pencil,
  Eye,
  X,
  Check,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";

// ─── Types ─────────────────────────────────────────────────────

interface Condition {
  field: string;
  op: string;
  value: string | number;
}

interface Rules {
  operator: "AND" | "OR";
  conditions: Condition[];
}

interface Segment {
  id: string;
  name: string;
  description: string | null;
  rules: Rules;
  memberCount: number;
  lastComputedAt: string | null;
  isActive: boolean;
  autoTrigger: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface SampleUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface Props {
  initialSegments: Segment[];
  initialTotal: number;
}

// ─── Constants ─────────────────────────────────────────────────

const FIELD_OPTIONS = [
  { value: "health_score", label: "Health Score", type: "numeric" as const },
  { value: "churn_risk", label: "Churn Risk", type: "numeric" as const },
  { value: "lifecycle_stage", label: "Lifecycle Stage", type: "string" as const },
  { value: "state", label: "State", type: "string" as const },
  { value: "plan", label: "Plan", type: "string" as const },
  { value: "subscription_status", label: "Subscription Status", type: "string" as const },
  { value: "weight_lost", label: "Weight Lost (lbs)", type: "numeric" as const },
  { value: "days_since_signup", label: "Days Since Signup", type: "numeric" as const },
  { value: "days_inactive", label: "Days Inactive", type: "numeric" as const },
  { value: "total_orders", label: "Total Orders", type: "numeric" as const },
  { value: "total_revenue", label: "Total Revenue ($)", type: "numeric" as const },
];

const NUMERIC_OPS = [
  { value: "gt", label: ">" },
  { value: "gte", label: ">=" },
  { value: "lt", label: "<" },
  { value: "lte", label: "<=" },
  { value: "eq", label: "=" },
  { value: "not_equals", label: "!=" },
];

const STRING_OPS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "not equals" },
  { value: "contains", label: "contains" },
];

const SUBSCRIPTION_STATUS_OPTIONS = [
  "ACTIVE",
  "PAUSED",
  "PAST_DUE",
  "CANCELED",
  "EXPIRED",
  "TRIALING",
];

const LIFECYCLE_STAGE_OPTIONS = [
  "LEAD",
  "QUIZ_COMPLETE",
  "INTAKE_PENDING",
  "ACTIVE_NEW",
  "ACTIVE_ESTABLISHED",
  "AT_RISK",
  "CHURNED",
];

function getFieldType(field: string): "numeric" | "string" {
  const f = FIELD_OPTIONS.find((o) => o.value === field);
  return f?.type ?? "string";
}

function getOpsForField(field: string) {
  return getFieldType(field) === "numeric" ? NUMERIC_OPS : STRING_OPS;
}

function hasEnumValues(field: string): string[] | null {
  if (field === "subscription_status") return SUBSCRIPTION_STATUS_OPTIONS;
  if (field === "lifecycle_stage") return LIFECYCLE_STAGE_OPTIONS;
  return null;
}

// ─── Component ─────────────────────────────────────────────────

export function AdvancedSegmentsClient({ initialSegments, initialTotal }: Props) {
  const [segments, setSegments] = useState<Segment[]>(initialSegments);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formOperator, setFormOperator] = useState<"AND" | "OR">("AND");
  const [formConditions, setFormConditions] = useState<Condition[]>([
    { field: "health_score", op: "gt", value: 50 },
  ]);

  // Preview state
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [previewSample, setPreviewSample] = useState<SampleUser[]>([]);
  const [previewing, setPreviewing] = useState(false);

  // ─── Refresh segments ───────────────────────────────────────

  const refreshSegments = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/advanced-segments?page=${page}&limit=20`);
      const data = await res.json();
      if (data.segments) {
        setSegments(data.segments);
        setTotal(data.total);
      }
    } catch {
      // handle error silently
    }
  }, [page]);

  // ─── Create / Update ───────────────────────────────────────

  const handleSave = useCallback(async () => {
    if (!formName.trim()) return;
    setLoading(true);
    try {
      const rules: Rules = { operator: formOperator, conditions: formConditions };

      if (editingId) {
        await fetch("/api/admin/advanced-segments", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: formName,
            description: formDescription,
            rules,
          }),
        });
      } else {
        await fetch("/api/admin/advanced-segments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            description: formDescription,
            rules,
          }),
        });
      }

      resetForm();
      await refreshSegments();
    } catch {
      // handle error silently
    }
    setLoading(false);
  }, [formName, formDescription, formOperator, formConditions, editingId, refreshSegments]);

  // ─── Delete ─────────────────────────────────────────────────

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this segment?")) return;
      try {
        await fetch("/api/admin/advanced-segments", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        await refreshSegments();
      } catch {
        // handle error silently
      }
    },
    [refreshSegments]
  );

  // ─── Compute ────────────────────────────────────────────────

  const handleCompute = useCallback(
    async (id: string) => {
      try {
        await fetch(
          `/api/admin/advanced-segments?action=compute&segmentId=${id}`
        );
        await refreshSegments();
      } catch {
        // handle error silently
      }
    },
    [refreshSegments]
  );

  // ─── Export ─────────────────────────────────────────────────

  const handleExport = useCallback(
    async (id: string, format: "csv" | "json") => {
      try {
        const res = await fetch(
          `/api/admin/advanced-segments?action=export&segmentId=${id}&format=${format}`
        );
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `segment-export.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        // handle error silently
      }
    },
    []
  );

  // ─── Toggle active ─────────────────────────────────────────

  const handleToggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        await fetch("/api/admin/advanced-segments", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, isActive: !isActive }),
        });
        await refreshSegments();
      } catch {
        // handle error silently
      }
    },
    [refreshSegments]
  );

  // ─── Preview ────────────────────────────────────────────────

  const handlePreview = useCallback(async () => {
    setPreviewing(true);
    setPreviewCount(null);
    setPreviewSample([]);
    try {
      const rules: Rules = { operator: formOperator, conditions: formConditions };
      const res = await fetch(
        `/api/admin/advanced-segments?action=preview&rules=${encodeURIComponent(JSON.stringify(rules))}`
      );
      const data = await res.json();
      if (data.preview) {
        setPreviewCount(data.preview.count);
        setPreviewSample(data.preview.sampleUsers || []);
      }
    } catch {
      // handle error silently
    }
    setPreviewing(false);
  }, [formOperator, formConditions]);

  // ─── Edit ───────────────────────────────────────────────────

  const handleEdit = useCallback((segment: Segment) => {
    setEditingId(segment.id);
    setFormName(segment.name);
    setFormDescription(segment.description || "");
    const rules = segment.rules as Rules;
    setFormOperator(rules.operator || "AND");
    setFormConditions(
      rules.conditions && rules.conditions.length > 0
        ? rules.conditions
        : [{ field: "health_score", op: "gt", value: 50 }]
    );
    setPreviewCount(null);
    setPreviewSample([]);
    setShowForm(true);
  }, []);

  // ─── Form helpers ───────────────────────────────────────────

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setFormName("");
    setFormDescription("");
    setFormOperator("AND");
    setFormConditions([{ field: "health_score", op: "gt", value: 50 }]);
    setPreviewCount(null);
    setPreviewSample([]);
  }

  function addCondition() {
    setFormConditions([
      ...formConditions,
      { field: "health_score", op: "gt", value: 50 },
    ]);
  }

  function removeCondition(idx: number) {
    setFormConditions(formConditions.filter((_, i) => i !== idx));
  }

  function updateCondition(idx: number, updates: Partial<Condition>) {
    setFormConditions(
      formConditions.map((c, i) => {
        if (i !== idx) return c;
        const updated = { ...c, ...updates };
        // Reset op/value when field type changes
        if (updates.field) {
          const newType = getFieldType(updates.field);
          const oldType = getFieldType(c.field);
          if (newType !== oldType) {
            updated.op = newType === "numeric" ? "gt" : "equals";
            updated.value = newType === "numeric" ? 0 : "";
          }
        }
        return updated;
      })
    );
  }

  // ─── Table columns ─────────────────────────────────────────

  const columns: ColumnDef<Segment>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.name}</p>
          {row.description && (
            <p className="text-xs text-graphite-400 mt-0.5">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "memberCount",
      header: "Members",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-graphite-400" />
          <span className="text-sm font-medium text-navy">{row.memberCount.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: "conditions",
      header: "Rules",
      render: (row) => {
        const rules = row.rules as Rules;
        return (
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-xs">
              {rules.operator}
            </Badge>
            <span className="text-xs text-graphite-400">
              {rules.conditions?.length || 0} condition
              {(rules.conditions?.length || 0) !== 1 ? "s" : ""}
            </span>
          </div>
        );
      },
    },
    {
      key: "lastComputedAt",
      header: "Last Computed",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.lastComputedAt
            ? new Date(row.lastComputedAt).toLocaleString()
            : "Never"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Active",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive(row.id, row.isActive);
          }}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            row.isActive ? "bg-teal" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              row.isActive ? "translate-x-4" : "translate-x-1"
            }`}
          />
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-48",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleCompute(row.id)}
            className="rounded p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-teal"
            title="Recompute"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="rounded p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-blue-600"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <div className="relative group">
            <button
              className="rounded p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-emerald-600"
              title="Export"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <div className="absolute right-0 top-full z-10 hidden group-hover:block bg-white border border-navy-100 rounded-lg shadow-lg py-1 min-w-[100px]">
              <button
                onClick={() => handleExport(row.id, "csv")}
                className="block w-full text-left px-3 py-1.5 text-xs hover:bg-navy-50"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport(row.id, "json")}
                className="block w-full text-left px-3 py-1.5 text-xs hover:bg-navy-50"
              >
                Export JSON
              </button>
            </div>
          </div>
          <button
            onClick={() => handleDelete(row.id)}
            className="rounded p-1.5 text-graphite-400 hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Advanced Segments</h1>
          <p className="text-sm text-graphite-400 mt-1">
            Build dynamic patient segments with custom rules and conditions
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="border-teal/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {editingId ? "Edit Segment" : "Create Segment"}
              </CardTitle>
              <button
                onClick={resetForm}
                className="rounded p-1 hover:bg-navy-50"
              >
                <X className="h-4 w-4 text-graphite-400" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name + Description */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider mb-1 block">
                  Segment Name
                </label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., High-Value At-Risk"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider mb-1 block">
                  Description
                </label>
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Optional description..."
                />
              </div>
            </div>

            {/* Logic Operator Toggle */}
            <div>
              <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider mb-2 block">
                Match Logic
              </label>
              <div className="inline-flex rounded-lg border border-navy-200 overflow-hidden">
                <button
                  onClick={() => setFormOperator("AND")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    formOperator === "AND"
                      ? "bg-teal text-white"
                      : "bg-white text-graphite-600 hover:bg-navy-50"
                  }`}
                >
                  AND — All conditions
                </button>
                <button
                  onClick={() => setFormOperator("OR")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    formOperator === "OR"
                      ? "bg-teal text-white"
                      : "bg-white text-graphite-600 hover:bg-navy-50"
                  }`}
                >
                  OR — Any condition
                </button>
              </div>
            </div>

            {/* Conditions */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider block">
                Conditions
              </label>

              {formConditions.map((condition, idx) => {
                const ops = getOpsForField(condition.field);
                const enumValues = hasEnumValues(condition.field);
                const isNumeric = getFieldType(condition.field) === "numeric";

                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 sm:flex-row sm:items-center rounded-lg border border-navy-100/60 p-3 bg-white"
                  >
                    {/* Connector label */}
                    {idx > 0 && (
                      <span className="text-xs font-bold text-teal uppercase sm:hidden mb-1">
                        {formOperator}
                      </span>
                    )}

                    {/* Field */}
                    <select
                      value={condition.field}
                      onChange={(e) =>
                        updateCondition(idx, { field: e.target.value })
                      }
                      className="flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal"
                    >
                      {FIELD_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>

                    {/* Operator */}
                    <select
                      value={condition.op}
                      onChange={(e) =>
                        updateCondition(idx, { op: e.target.value })
                      }
                      className="w-28 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal"
                    >
                      {ops.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>

                    {/* Value */}
                    {enumValues ? (
                      <select
                        value={String(condition.value)}
                        onChange={(e) =>
                          updateCondition(idx, { value: e.target.value })
                        }
                        className="flex-1 rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal"
                      >
                        <option value="">Select...</option>
                        {enumValues.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    ) : isNumeric ? (
                      <Input
                        type="number"
                        value={condition.value}
                        onChange={(e) =>
                          updateCondition(idx, {
                            value: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="flex-1"
                        placeholder="Value..."
                      />
                    ) : (
                      <Input
                        type="text"
                        value={String(condition.value)}
                        onChange={(e) =>
                          updateCondition(idx, { value: e.target.value })
                        }
                        className="flex-1"
                        placeholder="Value..."
                      />
                    )}

                    {/* Remove */}
                    {formConditions.length > 1 && (
                      <button
                        onClick={() => removeCondition(idx)}
                        className="rounded p-1.5 text-graphite-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              <button
                onClick={addCondition}
                className="flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-700"
              >
                <Plus className="h-4 w-4" />
                Add Condition
              </button>
            </div>

            {/* Preview */}
            {previewCount !== null && (
              <div className="rounded-lg border border-teal/30 bg-teal-50/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-teal" />
                  <span className="font-semibold text-navy">
                    {previewCount.toLocaleString()} matching user
                    {previewCount !== 1 ? "s" : ""}
                  </span>
                </div>
                {previewSample.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-graphite-400 font-medium uppercase">
                      Sample:
                    </p>
                    {previewSample.map((u) => (
                      <p key={u.id} className="text-sm text-graphite-600">
                        {[u.firstName, u.lastName].filter(Boolean).join(" ") ||
                          u.email}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleSave} disabled={loading || !formName.trim()}>
                <Check className="mr-2 h-4 w-4" />
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Segment"
                    : "Create Segment"}
              </Button>
              <Button variant="outline" onClick={handlePreview} disabled={previewing}>
                <Eye className={`mr-2 h-4 w-4 ${previewing ? "animate-spin" : ""}`} />
                {previewing ? "Previewing..." : "Preview"}
              </Button>
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Segments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="h-5 w-5 text-teal" />
            Segments
            <Badge variant="secondary" className="ml-2">
              {total}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {segments.length === 0 ? (
            <div className="py-12 text-center text-graphite-300">
              <Filter className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p>No segments created yet.</p>
              <p className="text-sm mt-1">
                Click &quot;Create Segment&quot; to build your first dynamic
                patient segment.
              </p>
            </div>
          ) : (
            <DataTable
              data={segments}
              columns={columns}
              total={total}
              page={page}
              limit={20}
              onPageChange={(p) => {
                setPage(p);
                refreshSegments();
              }}
              getRowId={(row) => row.id}
              emptyMessage="No segments found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
