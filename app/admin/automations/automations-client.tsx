"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import {
  Zap,
  Plus,
  Play,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  AlertTriangle,
  Loader2,
  Check,
  X,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────

interface Condition {
  field: string;
  operator: string;
  value: string;
}

interface ActionDef {
  type: string;
  params: Record<string, string>;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string | null;
  triggerType: string;
  conditions: Condition[];
  actions: ActionDef[];
  isActive: boolean;
  cooldownMinutes: number;
  lastTriggeredAt: string | null;
  triggerCount: number;
  executionCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Execution {
  id: string;
  ruleId: string;
  status: string;
  details: Record<string, unknown> | null;
  createdAt: string;
}

interface Props {
  rules: AutomationRule[];
  total: number;
  page: number;
  limit: number;
}

// ── Constants ────────────────────────────────────────────────

const TRIGGER_LABELS: Record<string, string> = {
  SCHEDULE: "Schedule",
  EVENT: "Event",
  THRESHOLD: "Threshold",
};

const TRIGGER_BADGE: Record<string, "default" | "secondary" | "gold"> = {
  SCHEDULE: "secondary",
  EVENT: "default",
  THRESHOLD: "gold",
};

const FIELD_OPTIONS = [
  { value: "health_score", label: "Health Score" },
  { value: "days_inactive", label: "Days Inactive" },
  { value: "subscription_status", label: "Subscription Status" },
  { value: "churn_risk", label: "Churn Risk" },
];

const OPERATOR_OPTIONS = [
  { value: "gt", label: ">" },
  { value: "lt", label: "<" },
  { value: "eq", label: "=" },
  { value: "gte", label: ">=" },
  { value: "lte", label: "<=" },
];

const ACTION_TYPE_OPTIONS = [
  { value: "create_alert", label: "Create Alert" },
  { value: "send_notification", label: "Send Notification" },
];

// ── Helpers ──────────────────────────────────────────────────

function summarizeConditions(conditions: Condition[]): string {
  if (!conditions || conditions.length === 0) return "No conditions";
  return conditions
    .map((c) => {
      const fieldLabel = FIELD_OPTIONS.find((f) => f.value === c.field)?.label || c.field;
      const opLabel = OPERATOR_OPTIONS.find((o) => o.value === c.operator)?.label || c.operator;
      return `${fieldLabel} ${opLabel} ${c.value}`;
    })
    .join(", ");
}

function summarizeActions(actions: ActionDef[]): string {
  if (!actions || actions.length === 0) return "No actions";
  return actions
    .map((a) => {
      const label = ACTION_TYPE_OPTIONS.find((t) => t.value === a.type)?.label || a.type;
      return label;
    })
    .join(", ");
}

// ── Component ────────────────────────────────────────────────

export function AutomationsClient({ rules, total, page, limit }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [executions, setExecutions] = useState<Record<string, Execution[]>>({});
  const [executingId, setExecutingId] = useState<string | null>(null);

  // ── Form state ───────────────────────────────────────────
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTriggerType, setFormTriggerType] = useState("THRESHOLD");
  const [formConditions, setFormConditions] = useState<Condition[]>([
    { field: "health_score", operator: "lt", value: "50" },
  ]);
  const [formActions, setFormActions] = useState<ActionDef[]>([
    { type: "create_alert", params: { severity: "WARNING", title: "" } },
  ]);
  const [formCooldown, setFormCooldown] = useState("60");

  // ── Handlers ─────────────────────────────────────────────

  const handlePageChange = useCallback(
    (newPage: number) => {
      router.push(`/admin/automations?page=${newPage}`);
    },
    [router]
  );

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormTriggerType("THRESHOLD");
    setFormConditions([{ field: "health_score", operator: "lt", value: "50" }]);
    setFormActions([{ type: "create_alert", params: { severity: "WARNING", title: "" } }]);
    setFormCooldown("60");
  };

  const handleCreate = async () => {
    if (!formName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          description: formDescription || undefined,
          triggerType: formTriggerType,
          conditions: formConditions,
          actions: formActions,
          cooldownMinutes: Number(formCooldown) || 60,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        resetForm();
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (rule: AutomationRule) => {
    await fetch("/api/admin/automations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rule.id, isActive: !rule.isActive }),
    });
    router.refresh();
  };

  const handleDelete = async (ruleId: string) => {
    await fetch(`/api/admin/automations?id=${ruleId}`, { method: "DELETE" });
    router.refresh();
  };

  const handleExecute = async (ruleId: string) => {
    setExecutingId(ruleId);
    try {
      const res = await fetch("/api/admin/automations/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId }),
      });
      if (res.ok) {
        router.refresh();
        // Refresh executions if expanded
        if (expandedRuleId === ruleId) {
          fetchExecutions(ruleId);
        }
      }
    } finally {
      setExecutingId(null);
    }
  };

  const fetchExecutions = async (ruleId: string) => {
    const res = await fetch(`/api/admin/automations?ruleId=${ruleId}&limit=10`);
    if (res.ok) {
      const data = await res.json();
      setExecutions((prev) => ({ ...prev, [ruleId]: data.executions }));
    }
  };

  const toggleExpand = (ruleId: string) => {
    if (expandedRuleId === ruleId) {
      setExpandedRuleId(null);
    } else {
      setExpandedRuleId(ruleId);
      if (!executions[ruleId]) {
        fetchExecutions(ruleId);
      }
    }
  };

  // ── Condition builder helpers ────────────────────────────

  const updateCondition = (idx: number, key: keyof Condition, value: string) => {
    setFormConditions((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c))
    );
  };

  const addCondition = () => {
    setFormConditions((prev) => [
      ...prev,
      { field: "health_score", operator: "lt", value: "" },
    ]);
  };

  const removeCondition = (idx: number) => {
    setFormConditions((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Action builder helpers ───────────────────────────────

  const updateActionType = (idx: number, type: string) => {
    setFormActions((prev) =>
      prev.map((a, i): ActionDef => {
        if (i !== idx) return a;
        const defaultParams: Record<string, string> =
          type === "create_alert"
            ? { severity: "WARNING", title: "" }
            : { title: "", body: "" };
        return { type, params: defaultParams };
      })
    );
  };

  const updateActionParam = (idx: number, key: string, value: string) => {
    setFormActions((prev) =>
      prev.map((a, i) =>
        i === idx ? { ...a, params: { ...a.params, [key]: value } } : a
      )
    );
  };

  const addAction = () => {
    setFormActions((prev) => [
      ...prev,
      { type: "create_alert", params: { severity: "WARNING", title: "" } },
    ]);
  };

  const removeAction = (idx: number) => {
    setFormActions((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Table columns ────────────────────────────────────────

  const columns: ColumnDef<AutomationRule>[] = [
    {
      key: "name",
      header: "Rule",
      sortable: true,
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="font-medium text-navy truncate">{row.name}</p>
          {row.description && (
            <p className="text-[10px] text-graphite-400 truncate">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "triggerType",
      header: "Trigger",
      render: (row) => (
        <Badge variant={TRIGGER_BADGE[row.triggerType] || "outline"}>
          {TRIGGER_LABELS[row.triggerType] || row.triggerType}
        </Badge>
      ),
    },
    {
      key: "conditions",
      header: "Conditions",
      render: (row) => (
        <span className="text-xs text-graphite-500 max-w-[200px] truncate block">
          {summarizeConditions(row.conditions)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <span className="text-xs text-graphite-500">{summarizeActions(row.actions)}</span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive(row);
          }}
          className="cursor-pointer"
        >
          <Badge variant={row.isActive ? "success" : "outline"}>
            {row.isActive ? "Active" : "Inactive"}
          </Badge>
        </button>
      ),
    },
    {
      key: "triggerCount",
      header: "Triggers",
      sortable: true,
      render: (row) => (
        <span className="text-sm font-mono text-navy">{row.triggerCount}</span>
      ),
    },
    {
      key: "lastTriggeredAt",
      header: "Last Triggered",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.lastTriggeredAt
            ? new Date(row.lastTriggeredAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Never"}
        </span>
      ),
    },
    {
      key: "actions_col",
      header: "",
      className: "w-[140px]",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExecute(row.id)}
            disabled={executingId === row.id}
            className="h-7 px-2"
            title="Execute now"
          >
            {executingId === row.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 text-teal" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpand(row.id)}
            className="h-7 px-2"
            title="View executions"
          >
            {expandedRuleId === row.id ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="h-7 px-2"
            title="Deactivate"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  // ── Execution status icon ────────────────────────────────

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "SUCCESS":
        return <Check className="h-3.5 w-3.5 text-emerald-500" />;
      case "FAILED":
        return <X className="h-3.5 w-3.5 text-red-500" />;
      case "SKIPPED":
        return <SkipForward className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Automation Rules</h1>
          <p className="mt-1 text-sm text-graphite-400">
            Create rules to automate alerts and notifications based on patient data
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Rule
        </Button>
      </div>

      {/* New Rule Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-teal" />
              Create Automation Rule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name + Description */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                  Name
                </label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Low Health Score Alert"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                  Description
                </label>
                <Input
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Optional description..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Trigger Type */}
            <div>
              <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                Trigger Type
              </label>
              <div className="mt-2 flex gap-3">
                {[
                  { value: "SCHEDULE", label: "Schedule", icon: Calendar },
                  { value: "EVENT", label: "Event", icon: Zap },
                  { value: "THRESHOLD", label: "Threshold", icon: AlertTriangle },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setFormTriggerType(value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                      formTriggerType === value
                        ? "border-teal bg-teal-50 text-teal-800"
                        : "border-navy-100 text-graphite-500 hover:bg-navy-50/30"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditions Builder */}
            <div>
              <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                Conditions
              </label>
              <div className="mt-2 space-y-2">
                {formConditions.map((cond, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={cond.field}
                      onChange={(e) => updateCondition(idx, "field", e.target.value)}
                      className="h-9 rounded-md border border-navy-200 bg-white px-3 text-sm text-navy"
                    >
                      {FIELD_OPTIONS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={cond.operator}
                      onChange={(e) => updateCondition(idx, "operator", e.target.value)}
                      className="h-9 w-20 rounded-md border border-navy-200 bg-white px-3 text-sm text-navy"
                    >
                      {OPERATOR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={cond.value}
                      onChange={(e) => updateCondition(idx, "value", e.target.value)}
                      placeholder="Value..."
                      className="w-32"
                    />
                    {formConditions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCondition(idx)}
                        className="h-8 px-2 text-red-400 hover:text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCondition}
                  className="mt-1 gap-1 text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Add Condition
                </Button>
              </div>
            </div>

            {/* Actions Builder */}
            <div>
              <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                Actions
              </label>
              <div className="mt-2 space-y-3">
                {formActions.map((action, idx) => (
                  <div key={idx} className="rounded-lg border border-navy-100/60 p-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={action.type}
                        onChange={(e) => updateActionType(idx, e.target.value)}
                        className="h-9 rounded-md border border-navy-200 bg-white px-3 text-sm text-navy"
                      >
                        {ACTION_TYPE_OPTIONS.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      {formActions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAction(idx)}
                          className="ml-auto h-8 px-2 text-red-400 hover:text-red-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    {/* Action-specific params */}
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {action.type === "create_alert" && (
                        <>
                          <div>
                            <label className="text-[10px] text-graphite-400">Severity</label>
                            <select
                              value={action.params.severity || "WARNING"}
                              onChange={(e) =>
                                updateActionParam(idx, "severity", e.target.value)
                              }
                              className="mt-0.5 h-8 w-full rounded-md border border-navy-200 bg-white px-2 text-sm"
                            >
                              <option value="INFO">Info</option>
                              <option value="WARNING">Warning</option>
                              <option value="CRITICAL">Critical</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-graphite-400">Title</label>
                            <Input
                              value={action.params.title || ""}
                              onChange={(e) =>
                                updateActionParam(idx, "title", e.target.value)
                              }
                              placeholder="Alert title..."
                              className="mt-0.5 h-8"
                            />
                          </div>
                        </>
                      )}
                      {action.type === "send_notification" && (
                        <>
                          <div>
                            <label className="text-[10px] text-graphite-400">Title</label>
                            <Input
                              value={action.params.title || ""}
                              onChange={(e) =>
                                updateActionParam(idx, "title", e.target.value)
                              }
                              placeholder="Notification title..."
                              className="mt-0.5 h-8"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-graphite-400">Body</label>
                            <Input
                              value={action.params.body || ""}
                              onChange={(e) =>
                                updateActionParam(idx, "body", e.target.value)
                              }
                              placeholder="Notification body..."
                              className="mt-0.5 h-8"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addAction}
                  className="gap-1 text-xs"
                >
                  <Plus className="h-3 w-3" />
                  Add Action
                </Button>
              </div>
            </div>

            {/* Cooldown */}
            <div className="max-w-xs">
              <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                Cooldown (minutes)
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-graphite-300" />
                <Input
                  type="number"
                  value={formCooldown}
                  onChange={(e) => setFormCooldown(e.target.value)}
                  min={0}
                  className="w-24"
                />
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-2 pt-2">
              <Button onClick={handleCreate} disabled={loading || !formName.trim()}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Save Rule
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules Table */}
      <DataTable
        data={rules}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        getRowId={(row) => row.id}
        onRowClick={(row) => toggleExpand(row.id)}
        emptyMessage="No automation rules yet. Create one to get started."
      />

      {/* Expanded Execution History */}
      {expandedRuleId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-graphite-500">
              Execution History &mdash;{" "}
              {rules.find((r) => r.id === expandedRuleId)?.name || "Rule"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!executions[expandedRuleId] ? (
              <div className="flex items-center gap-2 py-4 text-sm text-graphite-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading executions...
              </div>
            ) : executions[expandedRuleId].length === 0 ? (
              <p className="py-4 text-sm text-graphite-300">
                No executions yet for this rule.
              </p>
            ) : (
              <div className="space-y-2">
                {executions[expandedRuleId].map((exec) => (
                  <div
                    key={exec.id}
                    className="flex items-center gap-3 rounded-lg border border-navy-100/40 px-3 py-2"
                  >
                    <StatusIcon status={exec.status} />
                    <Badge
                      variant={
                        exec.status === "SUCCESS"
                          ? "success"
                          : exec.status === "FAILED"
                          ? "destructive"
                          : "warning"
                      }
                      className="text-[10px]"
                    >
                      {exec.status}
                    </Badge>
                    <span className="flex-1 text-xs text-graphite-400 truncate">
                      {exec.details
                        ? (exec.details as Record<string, unknown>).reason
                          ? String((exec.details as Record<string, unknown>).reason)
                          : `${
                              (
                                (exec.details as Record<string, unknown>)
                                  .actionsExecuted as unknown[]
                              )?.length || 0
                            } action(s) executed`
                        : "No details"}
                    </span>
                    <span className="text-[10px] text-graphite-300">
                      {new Date(exec.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
