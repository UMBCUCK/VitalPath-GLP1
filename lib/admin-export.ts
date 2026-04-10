import { db } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────

interface ExportFilters {
  from?: string;
  to?: string;
  status?: string;
}

const MAX_ROWS = 10000;

// ── CSV helper ─────────────────────────────────────────────────

function escapeCSVField(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCSV(headers: string[], rows: Record<string, unknown>[]): string {
  const headerLine = headers.map(escapeCSVField).join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCSVField(row[h])).join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}

// ── Date filter builder ────────────────────────────────────────

function buildDateFilter(filters?: ExportFilters) {
  const dateFilter: Record<string, Date> = {};
  if (filters?.from) dateFilter.gte = new Date(filters.from);
  if (filters?.to) dateFilter.lte = new Date(filters.to);
  return Object.keys(dateFilter).length > 0 ? dateFilter : undefined;
}

// ── Entity exporters ───────────────────────────────────────────

async function exportCustomers(filters?: ExportFilters) {
  const dateFilter = buildDateFilter(filters);
  const where: Record<string, unknown> = { role: "PATIENT" };
  if (dateFilter) where.createdAt = dateFilter;

  const customers = await db.user.findMany({
    where,
    take: MAX_ROWS,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      profile: {
        select: {
          state: true,
          weightLbs: true,
          goalWeightLbs: true,
          healthScore: true,
          lifecycleStage: true,
        },
      },
      subscriptions: {
        where: { status: { in: ["ACTIVE", "TRIALING", "PAST_DUE", "CANCELED"] } },
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { status: true },
      },
    },
  });

  return customers.map((c) => ({
    id: c.id,
    firstName: c.firstName || "",
    lastName: c.lastName || "",
    email: c.email,
    state: c.profile?.state || "",
    weightLbs: c.profile?.weightLbs || "",
    goalWeightLbs: c.profile?.goalWeightLbs || "",
    healthScore: c.profile?.healthScore || "",
    lifecycleStage: c.profile?.lifecycleStage || "",
    subscriptionStatus: c.subscriptions[0]?.status || "none",
    createdAt: c.createdAt.toISOString(),
  }));
}

async function exportOrders(filters?: ExportFilters) {
  const dateFilter = buildDateFilter(filters);
  const where: Record<string, unknown> = {};
  if (dateFilter) where.createdAt = dateFilter;
  if (filters?.status && filters.status !== "all") where.status = filters.status;

  const orders = await db.order.findMany({
    where,
    take: MAX_ROWS,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return orders.map((o) => ({
    id: o.id,
    customerEmail: o.user?.email || "",
    customerName: [o.user?.firstName, o.user?.lastName].filter(Boolean).join(" ") || "",
    status: o.status,
    totalCents: o.totalCents,
    totalFormatted: `$${(o.totalCents / 100).toFixed(2)}`,
    items: o.items.map((i) => `${i.product?.name || "Product"} x${i.quantity}`).join("; "),
    pharmacyVendor: o.pharmacyVendor || "",
    trackingNumber: o.trackingNumber || "",
    createdAt: o.createdAt.toISOString(),
    shippedAt: o.shippedAt?.toISOString() || "",
    deliveredAt: o.deliveredAt?.toISOString() || "",
  }));
}

async function exportSubscriptions(filters?: ExportFilters) {
  const dateFilter = buildDateFilter(filters);
  const where: Record<string, unknown> = {};
  if (dateFilter) where.createdAt = dateFilter;
  if (filters?.status && filters.status !== "all") where.status = filters.status;

  const subscriptions = await db.subscription.findMany({
    where,
    take: MAX_ROWS,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return subscriptions.map((s) => ({
    id: s.id,
    customerEmail: s.user?.email || "",
    customerName: [s.user?.firstName, s.user?.lastName].filter(Boolean).join(" ") || "",
    plan: s.items[0]?.product?.name || "Unknown",
    status: s.status,
    billingInterval: s.interval,
    mrr: s.items.reduce((sum, item) => sum + item.priceInCents, 0),
    mrrFormatted: `$${(s.items.reduce((sum, item) => sum + item.priceInCents, 0) / 100).toFixed(2)}`,
    stripeSubscriptionId: s.stripeSubscriptionId || "",
    createdAt: s.createdAt.toISOString(),
    canceledAt: s.canceledAt?.toISOString() || "",
  }));
}

async function exportAnalytics(filters?: ExportFilters) {
  const dateFilter = buildDateFilter(filters);
  const where: Record<string, unknown> = {};
  if (dateFilter) where.timestamp = dateFilter;

  const events = await db.analyticsEvent.findMany({
    where,
    take: MAX_ROWS,
    orderBy: { timestamp: "desc" },
    select: {
      id: true,
      eventName: true,
      properties: true,
      sessionId: true,
      userId: true,
      timestamp: true,
    },
  });

  return events.map((e) => ({
    id: e.id,
    eventName: e.eventName,
    properties: e.properties ? JSON.stringify(e.properties) : "",
    sessionId: e.sessionId || "",
    userId: e.userId || "",
    timestamp: e.timestamp.toISOString(),
  }));
}

async function exportConsultations(filters?: ExportFilters) {
  const dateFilter = buildDateFilter(filters);
  const where: Record<string, unknown> = {};
  if (dateFilter) where.createdAt = dateFilter;
  if (filters?.status && filters.status !== "all") where.status = filters.status;

  const consultations = await db.consultationTracker.findMany({
    where,
    take: MAX_ROWS,
    orderBy: { createdAt: "desc" },
  });

  // Enrich with user info
  const userIds = [...new Set(consultations.map((c) => c.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return consultations.map((c) => {
    const user = userMap.get(c.userId);
    return {
      id: c.id,
      patientEmail: user?.email || "",
      patientName: user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
        : "",
      consultationId: c.consultationId || "",
      status: c.status,
      providerName: c.providerName || "",
      eligibilityResult: c.eligibilityResult || "",
      scheduledAt: c.scheduledAt?.toISOString() || "",
      completedAt: c.completedAt?.toISOString() || "",
      lastSyncAt: c.lastSyncAt?.toISOString() || "",
      createdAt: c.createdAt.toISOString(),
    };
  });
}

// ── Main export function ───────────────────────────────────────

type ExportEntity = "customers" | "orders" | "subscriptions" | "analytics" | "consultations";

const exporters: Record<ExportEntity, (filters?: ExportFilters) => Promise<Record<string, unknown>[]>> = {
  customers: exportCustomers,
  orders: exportOrders,
  subscriptions: exportSubscriptions,
  analytics: exportAnalytics,
  consultations: exportConsultations,
};

export async function exportEntity(
  entity: string,
  filters?: ExportFilters,
  format: "csv" | "json" = "csv"
): Promise<{ data: string; contentType: string; filename: string }> {
  const exporter = exporters[entity as ExportEntity];
  if (!exporter) {
    throw new Error(`Unknown entity: ${entity}`);
  }

  const rows = await exporter(filters);
  const timestamp = new Date().toISOString().slice(0, 10);

  if (format === "json") {
    return {
      data: JSON.stringify(rows, null, 2),
      contentType: "application/json",
      filename: `${entity}-export-${timestamp}.json`,
    };
  }

  // CSV
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  return {
    data: toCSV(headers, rows),
    contentType: "text/csv; charset=utf-8",
    filename: `${entity}-export-${timestamp}.csv`,
  };
}
