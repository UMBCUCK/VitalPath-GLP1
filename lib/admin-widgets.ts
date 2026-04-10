import { db } from "@/lib/db";

// ── Widget type definitions ────────────────────────────────────

export interface WidgetType {
  type: string;
  label: string;
  defaultSize: { w: number; h: number };
  category: "kpi" | "chart" | "feed" | "table";
}

export interface WidgetPosition {
  row: number;
  col: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  id: string;
  type: string;
  position: WidgetPosition;
  config?: Record<string, unknown>;
}

export const WIDGET_TYPES: WidgetType[] = [
  { type: "kpi_mrr", label: "MRR", defaultSize: { w: 1, h: 1 }, category: "kpi" },
  { type: "kpi_active_members", label: "Active Members", defaultSize: { w: 1, h: 1 }, category: "kpi" },
  { type: "kpi_churn_rate", label: "Churn Rate", defaultSize: { w: 1, h: 1 }, category: "kpi" },
  { type: "kpi_revenue", label: "Revenue (90d)", defaultSize: { w: 1, h: 1 }, category: "kpi" },
  { type: "kpi_new_patients", label: "New Patients", defaultSize: { w: 1, h: 1 }, category: "kpi" },
  { type: "kpi_arpu", label: "ARPU", defaultSize: { w: 1, h: 1 }, category: "kpi" },
  { type: "kpi_pending_intakes", label: "Pending Intakes", defaultSize: { w: 1, h: 1 }, category: "kpi" },
  { type: "kpi_at_risk", label: "At-Risk", defaultSize: { w: 1, h: 1 }, category: "kpi" },
  { type: "chart_revenue_trend", label: "Revenue Trend", defaultSize: { w: 2, h: 2 }, category: "chart" },
  { type: "chart_funnel", label: "Conversion Funnel", defaultSize: { w: 2, h: 2 }, category: "chart" },
  { type: "feed_activity", label: "Activity Feed", defaultSize: { w: 1, h: 2 }, category: "feed" },
  { type: "feed_insights", label: "AI Insights", defaultSize: { w: 1, h: 2 }, category: "feed" },
  { type: "table_subscriptions", label: "Recent Subscriptions", defaultSize: { w: 2, h: 2 }, category: "table" },
  { type: "table_at_risk", label: "At-Risk Patients", defaultSize: { w: 2, h: 1 }, category: "table" },
];

// ── Default layout ─────────────────────────────────────────────

export function getDefaultLayout(): WidgetConfig[] {
  return [
    { id: "default-1", type: "kpi_mrr", position: { row: 0, col: 0, w: 1, h: 1 } },
    { id: "default-2", type: "kpi_active_members", position: { row: 0, col: 1, w: 1, h: 1 } },
    { id: "default-3", type: "kpi_new_patients", position: { row: 0, col: 2, w: 1, h: 1 } },
    { id: "default-4", type: "kpi_churn_rate", position: { row: 0, col: 3, w: 1, h: 1 } },
    { id: "default-5", type: "kpi_arpu", position: { row: 1, col: 0, w: 1, h: 1 } },
    { id: "default-6", type: "kpi_revenue", position: { row: 1, col: 1, w: 1, h: 1 } },
    { id: "default-7", type: "kpi_pending_intakes", position: { row: 1, col: 2, w: 1, h: 1 } },
    { id: "default-8", type: "kpi_at_risk", position: { row: 1, col: 3, w: 1, h: 1 } },
  ];
}

// ── DB helpers ──────────────────────────────────────────────────

export async function getWidgetLayout(adminId: string): Promise<WidgetConfig[]> {
  try {
    const layout = await db.widgetLayout.findUnique({
      where: { adminId },
    });

    if (!layout) return getDefaultLayout();

    const widgets = layout.widgets as unknown;
    if (Array.isArray(widgets) && widgets.length > 0) {
      return widgets as WidgetConfig[];
    }

    return getDefaultLayout();
  } catch {
    return getDefaultLayout();
  }
}

export async function saveWidgetLayout(
  adminId: string,
  widgets: WidgetConfig[]
): Promise<void> {
  // Prisma Json fields accept plain JS arrays/objects
  const widgetsJson = JSON.parse(JSON.stringify(widgets));
  await db.widgetLayout.upsert({
    where: { adminId },
    create: {
      adminId,
      widgets: widgetsJson,
    },
    update: {
      widgets: widgetsJson,
    },
  });
}
