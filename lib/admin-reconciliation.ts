import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────────

export interface ReconciliationSummary {
  totalReconciliations: number;
  pendingCount: number;
  totalDiscrepancyCents: number;
  lastRunDate: Date | null;
}

export interface ReconciliationRow {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  stripeRevenue: number;
  internalRevenue: number;
  discrepancy: number;
  discrepancyPct: number;
  matchedCount: number;
  unmatchedStripe: number;
  unmatchedInternal: number;
  details: unknown;
  status: string;
  resolvedBy: string | null;
  resolvedAt: Date | null;
  notes: string | null;
  createdAt: Date;
}

// ─── Run a reconciliation ──────────────────────────────────────

export async function runReconciliation(
  periodStart: Date,
  periodEnd: Date
): Promise<ReconciliationRow> {
  // Fetch all orders in the period
  const orders = await db.order.findMany({
    where: {
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    select: {
      id: true,
      totalCents: true,
      stripePaymentId: true,
      status: true,
      createdAt: true,
    },
  });

  // Separate matched (has Stripe payment) vs unmatched
  const matchedOrders = orders.filter((o) => o.stripePaymentId !== null);
  const unmatchedOrders = orders.filter((o) => o.stripePaymentId === null);

  // Internal revenue = sum of all order totalCents
  const internalRevenue = orders.reduce((sum, o) => sum + o.totalCents, 0);

  // Stripe revenue estimate = sum of orders WITH stripePaymentId
  // In production this would call stripe.charges.list() for the period
  const stripeRevenue = matchedOrders.reduce((sum, o) => sum + o.totalCents, 0);

  // Discrepancy
  const discrepancy = Math.abs(stripeRevenue - internalRevenue);
  const discrepancyPct =
    internalRevenue > 0 ? (discrepancy / internalRevenue) * 100 : 0;

  // Collect unmatched details for drill-down
  const unmatchedDetails = unmatchedOrders.map((o) => ({
    orderId: o.id,
    totalCents: o.totalCents,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    reason: "No Stripe payment ID",
  }));

  const record = await db.reconciliationRecord.create({
    data: {
      periodStart,
      periodEnd,
      stripeRevenue,
      internalRevenue,
      discrepancy,
      discrepancyPct: Math.round(discrepancyPct * 100) / 100,
      matchedCount: matchedOrders.length,
      unmatchedStripe: 0, // Would be populated from Stripe API in production
      unmatchedInternal: unmatchedOrders.length,
      details: unmatchedDetails.length > 0 ? unmatchedDetails : undefined,
      status: "PENDING",
    },
  });

  return record as ReconciliationRow;
}

// ─── Paginated list ────────────────────────────────────────────

export async function getReconciliations(page = 1, limit = 25) {
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    db.reconciliationRecord.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.reconciliationRecord.count(),
  ]);

  return { records: records as ReconciliationRow[], total, page, limit };
}

// ─── Resolve ───────────────────────────────────────────────────

export async function resolveReconciliation(
  id: string,
  notes: string,
  resolvedBy: string
) {
  return db.reconciliationRecord.update({
    where: { id },
    data: {
      status: "RESOLVED",
      notes,
      resolvedBy,
      resolvedAt: new Date(),
    },
  });
}

// ─── Summary KPIs ──────────────────────────────────────────────

export async function getReconciliationSummary(): Promise<ReconciliationSummary> {
  const [totalReconciliations, pendingCount, allRecords, lastRecord] =
    await Promise.all([
      db.reconciliationRecord.count(),
      db.reconciliationRecord.count({ where: { status: "PENDING" } }),
      db.reconciliationRecord.findMany({
        select: { discrepancy: true },
      }),
      db.reconciliationRecord.findFirst({
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

  const totalDiscrepancyCents = allRecords.reduce(
    (sum, r) => sum + r.discrepancy,
    0
  );

  return {
    totalReconciliations,
    pendingCount,
    totalDiscrepancyCents,
    lastRunDate: lastRecord?.createdAt ?? null,
  };
}

// ─── Trend data for chart ──────────────────────────────────────

export async function getReconciliationTrend() {
  const records = await db.reconciliationRecord.findMany({
    orderBy: { periodEnd: "asc" },
    take: 20,
    select: {
      periodEnd: true,
      discrepancy: true,
      discrepancyPct: true,
    },
  });

  return records.map((r) => ({
    date: r.periodEnd.toISOString().slice(0, 10),
    discrepancy: r.discrepancy,
    discrepancyPct: r.discrepancyPct,
  }));
}
