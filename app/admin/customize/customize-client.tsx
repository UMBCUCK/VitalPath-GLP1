"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  DollarSign,
  Users,
  UserPlus,
  RefreshCw,
  TrendingUp,
  ShoppingCart,
  ClipboardCheck,
  AlertTriangle,
  BarChart3,
  Activity,
  Lightbulb,
  Table,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type WidgetConfig,
  type WidgetType,
  getDefaultLayout,
} from "@/lib/admin-widgets";
import { cn } from "@/lib/utils";

interface CustomizeClientProps {
  currentLayout: WidgetConfig[];
  availableWidgets: WidgetType[];
}

const widgetIcons: Record<string, typeof DollarSign> = {
  kpi_mrr: DollarSign,
  kpi_active_members: Users,
  kpi_new_patients: UserPlus,
  kpi_churn_rate: RefreshCw,
  kpi_arpu: TrendingUp,
  kpi_revenue: ShoppingCart,
  kpi_pending_intakes: ClipboardCheck,
  kpi_at_risk: AlertTriangle,
  chart_revenue_trend: BarChart3,
  chart_funnel: BarChart3,
  feed_activity: Activity,
  feed_insights: Lightbulb,
  table_subscriptions: Table,
  table_at_risk: AlertTriangle,
};

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  kpi: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
  chart: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
  feed: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  table: { bg: "bg-navy-50", border: "border-navy-200", text: "text-navy-700" },
};

export function CustomizeClient({
  currentLayout,
  availableWidgets,
}: CustomizeClientProps) {
  const router = useRouter();
  const [widgets, setWidgets] = useState<WidgetConfig[]>(currentLayout);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usedTypes = new Set(widgets.map((w) => w.type));

  const addWidget = useCallback(
    (widgetType: WidgetType) => {
      const id = `widget-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      // Find next available position
      const maxRow = widgets.length > 0
        ? Math.max(...widgets.map((w) => w.position.row + w.position.h))
        : 0;

      // Try to fit in current rows first, otherwise add new row
      let col = 0;
      let row = maxRow;

      // Simple placement: fill rows of 4 columns
      const lastWidget = widgets[widgets.length - 1];
      if (lastWidget) {
        const nextCol = lastWidget.position.col + lastWidget.position.w;
        if (nextCol + widgetType.defaultSize.w <= 4) {
          col = nextCol;
          row = lastWidget.position.row;
        } else {
          col = 0;
          row = maxRow;
        }
      }

      setWidgets((prev) => [
        ...prev,
        {
          id,
          type: widgetType.type,
          position: {
            row,
            col,
            w: widgetType.defaultSize.w,
            h: widgetType.defaultSize.h,
          },
        },
      ]);
      setSaved(false);
    },
    [widgets]
  );

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setSaved(false);
  }, []);

  const moveWidget = useCallback(
    (id: string, direction: "up" | "down" | "left" | "right") => {
      setWidgets((prev) => {
        const idx = prev.findIndex((w) => w.id === id);
        if (idx === -1) return prev;

        const updated = [...prev];
        const widget = { ...updated[idx], position: { ...updated[idx].position } };

        switch (direction) {
          case "up":
            if (idx > 0) {
              updated.splice(idx, 1);
              updated.splice(idx - 1, 0, widget);
            }
            break;
          case "down":
            if (idx < updated.length - 1) {
              updated.splice(idx, 1);
              updated.splice(idx + 1, 0, widget);
            }
            break;
          case "left":
            widget.position.col = Math.max(0, widget.position.col - 1);
            updated[idx] = widget;
            break;
          case "right":
            widget.position.col = Math.min(4 - widget.position.w, widget.position.col + 1);
            updated[idx] = widget;
            break;
        }

        return updated;
      });
      setSaved(false);
    },
    []
  );

  const resetToDefault = useCallback(() => {
    setWidgets(getDefaultLayout());
    setSaved(false);
  }, []);

  const saveLayout = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/widgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widgets }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save layout");
    } finally {
      setSaving(false);
    }
  }, [widgets]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-navy">Customize Dashboard</h2>
            <p className="text-sm text-graphite-400">
              Add, remove, and reorder your dashboard widgets
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset to Default
          </Button>
          <Button size="sm" onClick={saveLayout} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            {saved ? "Saved!" : "Save Layout"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Widget Palette */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Available Widgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(["kpi", "chart", "feed", "table"] as const).map((category) => {
                  const catWidgets = availableWidgets.filter(
                    (w) => w.category === category
                  );
                  const colors = categoryColors[category];

                  return (
                    <div key={category}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-graphite-400">
                        {category === "kpi"
                          ? "KPI Cards"
                          : category === "chart"
                            ? "Charts"
                            : category === "feed"
                              ? "Feeds"
                              : "Tables"}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {catWidgets.map((wt) => {
                          const isUsed = usedTypes.has(wt.type);
                          const Icon = widgetIcons[wt.type] || Activity;

                          return (
                            <button
                              key={wt.type}
                              onClick={() => !isUsed && addWidget(wt)}
                              disabled={isUsed}
                              className={cn(
                                "flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all",
                                isUsed
                                  ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-50"
                                  : cn(
                                      colors.border,
                                      colors.bg,
                                      "hover:shadow-md hover:scale-[1.02]"
                                    )
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-4 w-4 shrink-0",
                                  isUsed ? "text-gray-400" : colors.text
                                )}
                              />
                              <div className="min-w-0">
                                <p
                                  className={cn(
                                    "text-xs font-medium truncate",
                                    isUsed ? "text-gray-400" : "text-navy"
                                  )}
                                >
                                  {wt.label}
                                </p>
                                <p className="text-[10px] text-graphite-300">
                                  {wt.defaultSize.w}x{wt.defaultSize.h}
                                </p>
                              </div>
                              {!isUsed && (
                                <Plus className="ml-auto h-3.5 w-3.5 shrink-0 text-graphite-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Layout */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">
                Current Layout ({widgets.length} widget{widgets.length !== 1 ? "s" : ""})
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                4-column grid
              </Badge>
            </CardHeader>
            <CardContent>
              {widgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Activity className="h-10 w-10 text-graphite-200" />
                  <p className="mt-3 text-sm font-medium text-graphite-400">
                    No widgets added
                  </p>
                  <p className="text-xs text-graphite-300">
                    Click a widget from the palette to add it
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {widgets.map((widget, idx) => {
                    const wType = availableWidgets.find(
                      (t) => t.type === widget.type
                    );
                    const Icon = widgetIcons[widget.type] || Activity;
                    const category = wType?.category || "kpi";
                    const colors = categoryColors[category];

                    return (
                      <div
                        key={widget.id}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                          colors.border,
                          "bg-white hover:bg-linen/20"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            colors.bg
                          )}
                        >
                          <Icon className={cn("h-4 w-4", colors.text)} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-navy">
                            {wType?.label || widget.type}
                          </p>
                          <p className="text-[10px] text-graphite-300">
                            Position: row {widget.position.row}, col{" "}
                            {widget.position.col} | Size: {widget.position.w}x
                            {widget.position.h}
                          </p>
                        </div>

                        {/* Reorder buttons */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => moveWidget(widget.id, "up")}
                            disabled={idx === 0}
                            className="rounded p-1 transition-colors hover:bg-gray-100 disabled:opacity-30"
                            title="Move up"
                          >
                            <ChevronUp className="h-3.5 w-3.5 text-graphite-400" />
                          </button>
                          <button
                            onClick={() => moveWidget(widget.id, "down")}
                            disabled={idx === widgets.length - 1}
                            className="rounded p-1 transition-colors hover:bg-gray-100 disabled:opacity-30"
                            title="Move down"
                          >
                            <ChevronDown className="h-3.5 w-3.5 text-graphite-400" />
                          </button>
                          <button
                            onClick={() => moveWidget(widget.id, "left")}
                            disabled={widget.position.col === 0}
                            className="rounded p-1 transition-colors hover:bg-gray-100 disabled:opacity-30"
                            title="Move left"
                          >
                            <ChevronLeft className="h-3.5 w-3.5 text-graphite-400" />
                          </button>
                          <button
                            onClick={() => moveWidget(widget.id, "right")}
                            disabled={
                              widget.position.col + widget.position.w >= 4
                            }
                            className="rounded p-1 transition-colors hover:bg-gray-100 disabled:opacity-30"
                            title="Move right"
                          >
                            <ChevronRight className="h-3.5 w-3.5 text-graphite-400" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeWidget(widget.id)}
                          className="rounded-lg p-1.5 transition-colors hover:bg-red-50"
                          title="Remove widget"
                        >
                          <X className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Preview grid */}
              {widgets.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-graphite-400">
                    Preview
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {widgets.map((widget) => {
                      const wType = availableWidgets.find(
                        (t) => t.type === widget.type
                      );
                      const category = wType?.category || "kpi";
                      const colors = categoryColors[category];

                      return (
                        <div
                          key={widget.id}
                          className={cn(
                            "rounded-lg border p-2 text-center",
                            colors.border,
                            colors.bg
                          )}
                          style={{
                            gridColumn: `span ${Math.min(widget.position.w, 4)}`,
                          }}
                        >
                          <p
                            className={cn(
                              "text-[10px] font-medium truncate",
                              colors.text
                            )}
                          >
                            {wType?.label || widget.type}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
