"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import {
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  Plus,
  Play,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  UserPlus,
  ArrowRight,
  LogOut,
  Target,
  Clock,
  AlertTriangle,
  Gift,
  Loader2,
  Mail,
  Bell,
  MessageSquare,
} from "lucide-react";
import type {
  PlaybookWithStats,
  PlaybookStep,
  TriggerConfig,
  PlaybookMetrics,
  EnrollmentRow,
} from "@/lib/admin-retention-playbooks";

// ── Types ─────────────────────────────────────────────────────

interface Props {
  playbooks: PlaybookWithStats[];
  total: number;
  page: number;
  metrics: PlaybookMetrics;
}

// ── Trigger type display ──────────────────────────────────────

const TRIGGER_BADGE_STYLES: Record<string, { variant: "default" | "warning" | "destructive" | "secondary" | "gold"; label: string }> = {
  ONBOARDING: { variant: "default", label: "Onboarding" },
  INACTIVITY: { variant: "warning", label: "Inactivity" },
  CHURN_RISK: { variant: "destructive", label: "Churn Risk" },
  WIN_BACK: { variant: "secondary", label: "Win Back" },
  MILESTONE: { variant: "gold", label: "Milestone" },
};

const TRIGGER_ICONS: Record<string, typeof UserPlus> = {
  ONBOARDING: UserPlus,
  INACTIVITY: Clock,
  CHURN_RISK: AlertTriangle,
  WIN_BACK: Target,
  MILESTONE: Gift,
};

const STATUS_BADGE_VARIANT: Record<string, "default" | "success" | "warning" | "destructive" | "secondary" | "outline"> = {
  ACTIVE: "default",
  COMPLETED: "success",
  CONVERTED: "gold" as "success",
  EXITED: "secondary",
};

// ── Empty step template ───────────────────────────────────────

function emptyStep(): PlaybookStep {
  return { dayOffset: 0, action: "send_email", channel: "EMAIL", subject: "", body: "" };
}

// ── Main Component ────────────────────────────────────────────

export function PlaybooksClient({ playbooks, total, page, metrics }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [runningTriggers, setRunningTriggers] = useState(false);
  const [triggerResult, setTriggerResult] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formTrigger, setFormTrigger] = useState("ONBOARDING");
  const [formConfig, setFormConfig] = useState<TriggerConfig>({});
  const [formSteps, setFormSteps] = useState<PlaybookStep[]>([emptyStep()]);

  // ── Form actions ─────────────────────────────────────────

  function resetForm() {
    setFormName("");
    setFormTrigger("ONBOARDING");
    setFormConfig({});
    setFormSteps([emptyStep()]);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(playbook: PlaybookWithStats) {
    setFormName(playbook.name);
    setFormTrigger(playbook.triggerType);
    setFormConfig(playbook.triggerConfig);
    setFormSteps(playbook.steps.length > 0 ? playbook.steps : [emptyStep()]);
    setEditingId(playbook.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!formName.trim() || formSteps.length === 0) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: formName,
        triggerType: formTrigger,
        triggerConfig: formConfig,
        steps: formSteps,
      };

      if (editingId) {
        body.id = editingId;
        await fetch("/api/admin/playbooks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/admin/playbooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      resetForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deactivate this playbook?")) return;
    await fetch(`/api/admin/playbooks?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    await fetch("/api/admin/playbooks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !currentActive }),
    });
    router.refresh();
  }

  async function handleRunTriggers() {
    setRunningTriggers(true);
    setTriggerResult(null);
    try {
      const res = await fetch("/api/admin/playbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate" }),
      });
      const data = await res.json();
      setTriggerResult(data.enrolled ?? 0);
      router.refresh();
    } finally {
      setRunningTriggers(false);
    }
  }

  // ── Enrollment expansion ─────────────────────────────────

  const loadEnrollments = useCallback(async (playbookId: string) => {
    if (expandedId === playbookId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(playbookId);
    setLoadingEnrollments(true);
    try {
      const res = await fetch(`/api/admin/playbooks?id=${playbookId}`);
      const data = await res.json();
      setEnrollments(data.enrollments || []);
    } finally {
      setLoadingEnrollments(false);
    }
  }, [expandedId]);

  async function handleEnrollmentAction(enrollmentId: string, action: string, reason?: string) {
    await fetch("/api/admin/playbooks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: enrollmentId, action, reason }),
    });
    // Reload enrollments
    if (expandedId) {
      const res = await fetch(`/api/admin/playbooks?id=${expandedId}`);
      const data = await res.json();
      setEnrollments(data.enrollments || []);
    }
    router.refresh();
  }

  // ── Step helpers ─────────────────────────────────────────

  function updateStep(index: number, field: keyof PlaybookStep, value: string | number) {
    setFormSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addStep() {
    const lastDay = formSteps.length > 0 ? formSteps[formSteps.length - 1].dayOffset : 0;
    setFormSteps((prev) => [...prev, { ...emptyStep(), dayOffset: lastDay + 3 }]);
  }

  function removeStep(index: number) {
    if (formSteps.length <= 1) return;
    setFormSteps((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Retention Playbooks</h1>
          <p className="mt-1 text-sm text-graphite-400">
            Automated sequences to onboard, retain, and win back patients
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRunTriggers}
            disabled={runningTriggers}
            className="border-navy-200 text-navy hover:bg-navy-50"
          >
            {runningTriggers ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run Triggers
          </Button>
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-teal text-white hover:bg-teal/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Playbook
          </Button>
        </div>
      </div>

      {/* Trigger result toast */}
      {triggerResult !== null && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Trigger evaluation complete: <strong>{triggerResult}</strong> users enrolled across all active playbooks.
          <button onClick={() => setTriggerResult(null)} className="ml-2 text-emerald-400 hover:text-emerald-600">
            <X className="inline h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KPICard
          title="Active Playbooks"
          value={String(metrics.activePlaybooks)}
          icon={BookOpen}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Enrolled Patients"
          value={metrics.activeEnrollments.toLocaleString()}
          icon={Users}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Top Performer"
          value={metrics.topPerformer}
          icon={Award}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="border-2 border-teal/30">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">
                {editingId ? "Edit Playbook" : "Create Playbook"}
              </h2>
              <button onClick={resetForm} className="text-graphite-400 hover:text-navy">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-graphite-400">
                  Playbook Name
                </label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., 7-Day Onboarding Sequence"
                  className="max-w-md"
                />
              </div>

              {/* Trigger Type */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-graphite-400">
                  Trigger Type
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {Object.entries(TRIGGER_ICONS).map(([type, Icon]) => {
                    const meta = TRIGGER_BADGE_STYLES[type];
                    const isSelected = formTrigger === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setFormTrigger(type)}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                          isSelected
                            ? "border-teal bg-teal-50/50 shadow-sm"
                            : "border-navy-100/60 hover:border-navy-200"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${isSelected ? "text-teal" : "text-graphite-400"}`} />
                        <span className={`text-xs font-medium ${isSelected ? "text-teal" : "text-graphite-500"}`}>
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trigger Config */}
              {formTrigger === "INACTIVITY" && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-graphite-400">
                    Days Inactive
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={formConfig.daysInactive || 14}
                    onChange={(e) => setFormConfig({ ...formConfig, daysInactive: Number(e.target.value) })}
                    className="max-w-[120px]"
                  />
                </div>
              )}
              {formTrigger === "CHURN_RISK" && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-graphite-400">
                    Health Score Threshold (trigger at or below)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={formConfig.churnRiskThreshold || 70}
                    onChange={(e) => setFormConfig({ ...formConfig, churnRiskThreshold: Number(e.target.value) })}
                    className="max-w-[120px]"
                  />
                </div>
              )}
              {formTrigger === "WIN_BACK" && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-graphite-400">
                    Days Since Cancel
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={formConfig.daysSinceCancel || 30}
                    onChange={(e) => setFormConfig({ ...formConfig, daysSinceCancel: Number(e.target.value) })}
                    className="max-w-[120px]"
                  />
                </div>
              )}

              {/* Steps Builder */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-graphite-400">
                  Steps ({formSteps.length})
                </label>
                <div className="space-y-3">
                  {formSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-navy-100/60 bg-linen/20 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-navy">Step {idx + 1}</span>
                        {formSteps.length > 1 && (
                          <button
                            onClick={() => removeStep(idx)}
                            className="text-graphite-300 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-[10px] text-graphite-400">Day Offset</label>
                          <Input
                            type="number"
                            min={0}
                            value={step.dayOffset}
                            onChange={(e) => updateStep(idx, "dayOffset", Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] text-graphite-400">Action</label>
                          <select
                            value={step.action}
                            onChange={(e) => updateStep(idx, "action", e.target.value)}
                            className="w-full rounded-lg border border-navy-200 px-2.5 py-2 text-sm text-navy"
                          >
                            <option value="send_email">Send Email</option>
                            <option value="send_notification">Send Notification</option>
                            <option value="create_alert">Create Alert</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] text-graphite-400">Channel</label>
                          <select
                            value={step.channel}
                            onChange={(e) => updateStep(idx, "channel", e.target.value)}
                            className="w-full rounded-lg border border-navy-200 px-2.5 py-2 text-sm text-navy"
                          >
                            <option value="EMAIL">Email</option>
                            <option value="APP">App</option>
                            <option value="SMS">SMS</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] text-graphite-400">Subject</label>
                          <Input
                            value={step.subject}
                            onChange={(e) => updateStep(idx, "subject", e.target.value)}
                            placeholder="Subject line"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="mb-1 block text-[10px] text-graphite-400">Body</label>
                        <textarea
                          value={step.body}
                          onChange={(e) => updateStep(idx, "body", e.target.value)}
                          placeholder="Message body..."
                          rows={2}
                          className="w-full rounded-lg border border-navy-200 px-2.5 py-2 text-sm text-navy placeholder:text-graphite-300"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addStep}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-100/60 py-3 text-sm text-graphite-400 transition-colors hover:border-teal hover:text-teal"
                  >
                    <Plus className="h-4 w-4" />
                    Add Step
                  </button>
                </div>
              </div>

              {/* Save buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving || !formName.trim()}
                  className="bg-teal text-white hover:bg-teal/90"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Create Playbook"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Playbook Cards */}
      <div className="space-y-4">
        {playbooks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BookOpen className="mb-3 h-10 w-10 text-graphite-300" />
              <p className="text-sm text-graphite-400">No playbooks yet. Create your first one above.</p>
            </CardContent>
          </Card>
        ) : (
          playbooks.map((pb) => {
            const triggerMeta = TRIGGER_BADGE_STYLES[pb.triggerType] || { variant: "outline" as const, label: pb.triggerType };
            const TriggerIcon = TRIGGER_ICONS[pb.triggerType] || BookOpen;
            const isExpanded = expandedId === pb.id;
            const steps = pb.steps || [];
            const funnelTotal = pb.enrolledCount || 1;
            const completedPct = Math.round((pb.completedCount / funnelTotal) * 100);
            const convertedPct = Math.round((pb.convertedCount / funnelTotal) * 100);

            return (
              <Card key={pb.id} className={`transition-all ${!pb.isActive ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  {/* Card header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50">
                        <TriggerIcon className="h-5 w-5 text-navy" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-navy">{pb.name}</h3>
                          <Badge variant={triggerMeta.variant}>{triggerMeta.label}</Badge>
                          {!pb.isActive && <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-graphite-400">
                          {steps.length} steps &middot; {pb.activeEnrollments} active / {pb.enrolledCount} total enrollments
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Active toggle */}
                      <button
                        onClick={() => handleToggleActive(pb.id, pb.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          pb.isActive ? "bg-teal" : "bg-graphite-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            pb.isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => startEdit(pb)}
                        className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pb.id)}
                        className="rounded-lg p-1.5 text-graphite-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Funnel bar */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-[10px] text-graphite-400">
                      <span>Enrolled ({pb.enrolledCount})</span>
                      <span>Completed ({pb.completedCount})</span>
                      <span>Converted ({pb.convertedCount})</span>
                    </div>
                    <div className="flex h-3 overflow-hidden rounded-full bg-navy-50">
                      <div
                        className="bg-teal transition-all"
                        style={{ width: `${100}%` }}
                      />
                      <div
                        className="bg-emerald-400 transition-all"
                        style={{ width: `${completedPct}%`, marginLeft: `-${100 - completedPct}%` }}
                      />
                      <div
                        className="bg-purple-400 transition-all"
                        style={{ width: `${convertedPct}%`, marginLeft: `-${completedPct - convertedPct}%` }}
                      />
                    </div>
                    <div className="mt-1 flex gap-4 text-[10px]">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-teal" /> Enrolled
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> Completed {completedPct}%
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-purple-400" /> Converted {convertedPct}%
                      </span>
                    </div>
                  </div>

                  {/* Steps preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {steps.map((step, i) => {
                      const ActionIcon = step.action === "send_email" ? Mail : step.action === "send_notification" ? Bell : MessageSquare;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 rounded-lg bg-linen/50 px-2.5 py-1.5 text-xs text-graphite-500"
                        >
                          <ActionIcon className="h-3 w-3" />
                          Day {step.dayOffset}
                          {i < steps.length - 1 && <ArrowRight className="ml-1 h-3 w-3 text-graphite-300" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Expand enrollments */}
                  <button
                    onClick={() => loadEnrollments(pb.id)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-teal hover:text-teal/80"
                  >
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {isExpanded ? "Hide" : "View"} Enrollments
                  </button>

                  {/* Enrollments list */}
                  {isExpanded && (
                    <div className="mt-3 rounded-xl border border-navy-100/40 bg-white">
                      {loadingEnrollments ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-5 w-5 animate-spin text-graphite-300" />
                        </div>
                      ) : enrollments.length === 0 ? (
                        <div className="py-8 text-center text-sm text-graphite-400">
                          No enrollments yet
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-navy-100/40 bg-linen/30">
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-graphite-400">Patient</th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-graphite-400">Status</th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-graphite-400">Step</th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-graphite-400">Enrolled</th>
                                <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-graphite-400">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-100/30">
                              {enrollments.map((e) => (
                                <tr key={e.id} className="hover:bg-linen/20">
                                  <td className="px-4 py-2.5">
                                    <p className="font-medium text-navy">{e.userName}</p>
                                    <p className="text-[10px] text-graphite-400">{e.email}</p>
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <Badge variant={STATUS_BADGE_VARIANT[e.status] || "outline"}>
                                      {e.status}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-2.5 text-graphite-600">
                                    {e.currentStep + 1} / {steps.length}
                                  </td>
                                  <td className="px-4 py-2.5 text-xs text-graphite-400">
                                    {new Date(e.enrolledAt).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    {e.status === "ACTIVE" && (
                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={() => handleEnrollmentAction(e.id, "advance")}
                                          className="rounded-lg p-1 text-graphite-400 hover:bg-teal-50 hover:text-teal"
                                          title="Advance step"
                                        >
                                          <ArrowRight className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleEnrollmentAction(e.id, "convert")}
                                          className="rounded-lg p-1 text-graphite-400 hover:bg-emerald-50 hover:text-emerald-600"
                                          title="Mark converted"
                                        >
                                          <CheckCircle2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleEnrollmentAction(e.id, "exit", "Manual exit")}
                                          className="rounded-lg p-1 text-graphite-400 hover:bg-red-50 hover:text-red-500"
                                          title="Exit enrollment"
                                        >
                                          <LogOut className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Simple pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => router.push(`/admin/playbooks?page=${page - 1}`)}
          >
            Previous
          </Button>
          <span className="text-xs text-graphite-400">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => router.push(`/admin/playbooks?page=${page + 1}`)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
