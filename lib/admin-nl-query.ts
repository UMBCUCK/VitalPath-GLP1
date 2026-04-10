import { db } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────────

export interface ParsedQuery {
  entity: string;
  filters: Record<string, unknown>;
  description: string;
}

export interface QueryResult {
  results: Record<string, unknown>[];
  count: number;
}

// ─── Helpers ───────────────────────────────────────────────────

function extractNumber(text: string, afterKeyword: string): number | null {
  const regex = new RegExp(`${afterKeyword}\\s+(\\d+\\.?\\d*)`, "i");
  const match = text.match(regex);
  return match ? parseFloat(match[1]) : null;
}

function extractBetween(text: string): { min: number; max: number } | null {
  const match = text.match(/between\s+(\d+\.?\d*)\s+and\s+(\d+\.?\d*)/i);
  if (!match) return null;
  return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
}

function extractDays(text: string): number | null {
  const match = text.match(/(?:last|past)\s+(\d+)\s+days?/i);
  return match ? parseInt(match[1], 10) : null;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── Entity detection ──────────────────────────────────────────

function detectEntity(query: string): string {
  const q = query.toLowerCase();
  if (/\borders?\b/.test(q)) return "orders";
  if (/\bsubscriptions?\b/.test(q)) return "subscriptions";
  // Default to patients for user-focused queries
  return "patients";
}

// ─── Parse natural language query ──────────────────────────────

export function parseNaturalQuery(query: string): ParsedQuery {
  const q = query.toLowerCase().trim();
  const entity = detectEntity(q);
  const filters: Record<string, unknown> = {};
  const descParts: string[] = [];

  if (entity === "patients") {
    // Weight loss: "lost more than X lbs"
    const weightMatch = q.match(/(?:lost|loss)\s+(?:more than|over|above|greater than)\s+(\d+\.?\d*)\s*(?:lbs?|pounds?)?/i);
    if (weightMatch) {
      filters.weightLossGt = parseFloat(weightMatch[1]);
      descParts.push(`weight loss > ${weightMatch[1]} lbs`);
    }

    // Health score filters
    for (const [kw, op] of [
      ["below", "lt"], ["under", "lt"], ["less than", "lt"],
      ["above", "gt"], ["over", "gt"], ["more than", "gt"], ["greater than", "gt"],
    ] as const) {
      const hsMatch = q.match(new RegExp(`health\\s*score\\s+${kw}\\s+(\\d+)`, "i"));
      if (hsMatch) {
        filters[`healthScore_${op}`] = parseInt(hsMatch[1], 10);
        descParts.push(`health score ${op === "lt" ? "<" : ">"} ${hsMatch[1]}`);
      }
    }

    // Health score between
    const hsBetween = q.match(/health\s*score\s+between\s+(\d+)\s+and\s+(\d+)/i);
    if (hsBetween) {
      filters.healthScore_gte = parseInt(hsBetween[1], 10);
      filters.healthScore_lte = parseInt(hsBetween[2], 10);
      descParts.push(`health score between ${hsBetween[1]} and ${hsBetween[2]}`);
    }

    // Churn risk
    for (const [kw, op] of [
      ["below", "lt"], ["under", "lt"], ["less than", "lt"],
      ["above", "gt"], ["over", "gt"], ["more than", "gt"], ["greater than", "gt"],
    ] as const) {
      const crMatch = q.match(new RegExp(`churn\\s*(?:risk)?\\s+${kw}\\s+(\\d+)`, "i"));
      if (crMatch) {
        filters[`churnRisk_${op}`] = parseInt(crMatch[1], 10);
        descParts.push(`churn risk ${op === "lt" ? "<" : ">"} ${crMatch[1]}`);
      }
    }

    // Inactive patients
    const inactiveDays = q.match(/inactive\s+(?:for\s+)?(\d+)\s+days?/i);
    if (inactiveDays) {
      filters.inactiveDays = parseInt(inactiveDays[1], 10);
      descParts.push(`inactive for ${inactiveDays[1]} days`);
    }

    // Subscription status
    if (/\bactive\b/.test(q) && !/inactive/.test(q)) {
      filters.subscriptionStatus = "ACTIVE";
      descParts.push("active subscription");
    }
    if (/\bcanceled\b|\bcancelled\b/.test(q)) {
      filters.subscriptionStatus = "CANCELED";
      descParts.push("canceled subscription");
    }
    if (/\bpast\s*due\b/.test(q)) {
      filters.subscriptionStatus = "PAST_DUE";
      descParts.push("past due subscription");
    }
    if (/\btrialing\b|\btrial\b/.test(q)) {
      filters.subscriptionStatus = "TRIALING";
      descParts.push("trialing subscription");
    }

    // State filter
    const stateMatch = q.match(/\bin\s+([A-Z]{2})\b/);
    if (stateMatch) {
      filters.state = stateMatch[1];
      descParts.push(`in state ${stateMatch[1]}`);
    }
  }

  if (entity === "subscriptions") {
    // Status
    if (/\bactive\b/.test(q)) {
      filters.status = "ACTIVE";
      descParts.push("active");
    }
    if (/\bcanceled\b|\bcancelled\b/.test(q)) {
      filters.status = "CANCELED";
      descParts.push("canceled");
    }
    if (/\bpast\s*due\b/.test(q)) {
      filters.status = "PAST_DUE";
      descParts.push("past due");
    }
    if (/\btrialing\b|\btrial\b/.test(q)) {
      filters.status = "TRIALING";
      descParts.push("trialing");
    }

    // Price filter: "over $X/mo" or "more than $X"
    const priceMatch = q.match(/(?:over|above|more than|greater than)\s+\$?(\d+)/i);
    if (priceMatch) {
      filters.priceGtCents = parseFloat(priceMatch[1]) * 100;
      descParts.push(`price > $${priceMatch[1]}/mo`);
    }

    // Date range
    const days = extractDays(q);
    if (days) {
      filters.createdAfter = daysAgo(days).toISOString();
      descParts.push(`in last ${days} days`);
    }
  }

  if (entity === "orders") {
    // Status
    if (/\bpending\b/.test(q)) {
      filters.status = "PENDING";
      descParts.push("pending");
    }
    if (/\bshipped\b/.test(q)) {
      filters.status = "SHIPPED";
      descParts.push("shipped");
    }
    if (/\bdelivered\b/.test(q)) {
      filters.status = "DELIVERED";
      descParts.push("delivered");
    }
    if (/\brefunded\b/.test(q)) {
      filters.status = "REFUNDED";
      descParts.push("refunded");
    }

    // Revenue / total
    const totalMatch = q.match(/(?:over|above|more than|greater than)\s+\$?(\d+)/i);
    if (totalMatch) {
      filters.totalGtCents = parseFloat(totalMatch[1]) * 100;
      descParts.push(`total > $${totalMatch[1]}`);
    }

    // Date range
    const days = extractDays(q);
    if (days) {
      filters.createdAfter = daysAgo(days).toISOString();
      descParts.push(`in last ${days} days`);
    }
  }

  // If no filters parsed, try generic number-based patterns
  if (descParts.length === 0) {
    const between = extractBetween(q);
    if (between) {
      filters.genericBetween = between;
      descParts.push(`values between ${between.min} and ${between.max}`);
    }
    const days = extractDays(q);
    if (days) {
      filters.createdAfter = daysAgo(days).toISOString();
      descParts.push(`in last ${days} days`);
    }
  }

  const description =
    descParts.length > 0
      ? `${entity.charAt(0).toUpperCase() + entity.slice(1)} where ${descParts.join(", ")}`
      : `All ${entity}`;

  return { entity, filters, description };
}

// ─── Execute parsed query ──────────────────────────────────────

export async function executeNaturalQuery(parsed: ParsedQuery): Promise<QueryResult> {
  const { entity, filters } = parsed;

  if (entity === "patients") {
    return executePatientQuery(filters);
  }
  if (entity === "subscriptions") {
    return executeSubscriptionQuery(filters);
  }
  if (entity === "orders") {
    return executeOrderQuery(filters);
  }

  return { results: [], count: 0 };
}

async function executePatientQuery(filters: Record<string, unknown>): Promise<QueryResult> {
  const where: Record<string, unknown> = { role: "PATIENT" };
  const profileWhere: Record<string, unknown> = {};
  let needsProfileFilter = false;

  // Health score filters
  if (filters.healthScore_lt !== undefined) {
    profileWhere.healthScore = { ...(profileWhere.healthScore as object || {}), lt: filters.healthScore_lt as number };
    needsProfileFilter = true;
  }
  if (filters.healthScore_gt !== undefined) {
    profileWhere.healthScore = { ...(profileWhere.healthScore as object || {}), gt: filters.healthScore_gt as number };
    needsProfileFilter = true;
  }
  if (filters.healthScore_gte !== undefined) {
    profileWhere.healthScore = { ...(profileWhere.healthScore as object || {}), gte: filters.healthScore_gte as number };
    needsProfileFilter = true;
  }
  if (filters.healthScore_lte !== undefined) {
    profileWhere.healthScore = { ...(profileWhere.healthScore as object || {}), lte: filters.healthScore_lte as number };
    needsProfileFilter = true;
  }

  // Churn risk
  if (filters.churnRisk_lt !== undefined) {
    profileWhere.churnRisk = { ...(profileWhere.churnRisk as object || {}), lt: filters.churnRisk_lt as number };
    needsProfileFilter = true;
  }
  if (filters.churnRisk_gt !== undefined) {
    profileWhere.churnRisk = { ...(profileWhere.churnRisk as object || {}), gt: filters.churnRisk_gt as number };
    needsProfileFilter = true;
  }

  // State
  if (filters.state) {
    profileWhere.state = filters.state;
    needsProfileFilter = true;
  }

  if (needsProfileFilter) {
    where.profile = profileWhere;
  }

  // Subscription status filter
  if (filters.subscriptionStatus) {
    where.subscriptions = { some: { status: filters.subscriptionStatus as string } };
  }

  // Inactive patients: no progressEntry in last N days
  if (filters.inactiveDays) {
    const cutoff = daysAgo(filters.inactiveDays as number);
    where.progressEntries = { none: { date: { gte: cutoff } } };
  }

  // Weight loss filter — requires post-query filtering
  const weightLossGt = filters.weightLossGt as number | undefined;

  const users = await db.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      profile: {
        select: {
          healthScore: true,
          churnRisk: true,
          lifecycleStage: true,
          state: true,
          weightLbs: true,
          goalWeightLbs: true,
        },
      },
      subscriptions: {
        select: { status: true },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      progressEntries: {
        select: { weightLbs: true, date: true },
        orderBy: { date: "asc" },
        take: 100,
      },
    },
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  let results = users.map((u) => {
    const entries = u.progressEntries.filter((e) => e.weightLbs !== null);
    const firstWeight = entries.length > 0 ? entries[0].weightLbs : null;
    const lastWeight = entries.length > 0 ? entries[entries.length - 1].weightLbs : null;
    const weightLoss =
      firstWeight !== null && lastWeight !== null ? firstWeight - lastWeight : 0;

    return {
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
      email: u.email,
      healthScore: u.profile?.healthScore ?? null,
      churnRisk: u.profile?.churnRisk ?? null,
      state: u.profile?.state ?? null,
      lifecycleStage: u.profile?.lifecycleStage ?? null,
      subscriptionStatus: u.subscriptions[0]?.status ?? "NONE",
      weightLoss: Math.round(weightLoss * 10) / 10,
      joinedAt: u.createdAt,
    };
  });

  // Post-filter for weight loss
  if (weightLossGt !== undefined) {
    results = results.filter((r) => r.weightLoss > weightLossGt);
  }

  return { results, count: results.length };
}

async function executeSubscriptionQuery(filters: Record<string, unknown>): Promise<QueryResult> {
  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.createdAfter) where.createdAt = { gte: new Date(filters.createdAfter as string) };

  const subs = await db.subscription.findMany({
    where,
    select: {
      id: true,
      status: true,
      interval: true,
      createdAt: true,
      currentPeriodEnd: true,
      user: {
        select: { email: true, firstName: true, lastName: true },
      },
      items: {
        select: { priceInCents: true, quantity: true, product: { select: { name: true } } },
      },
    },
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  let results = subs.map((s) => {
    const monthly = s.items.reduce((sum, i) => sum + i.priceInCents * i.quantity, 0);
    return {
      id: s.id,
      customer: [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") || s.user.email,
      email: s.user.email,
      status: s.status,
      interval: s.interval,
      monthlyAmount: monthly,
      plan: s.items.map((i) => i.product.name).join(", "),
      createdAt: s.createdAt,
      periodEnd: s.currentPeriodEnd,
    };
  });

  // Price filter
  if (filters.priceGtCents) {
    results = results.filter((r) => r.monthlyAmount > (filters.priceGtCents as number));
  }

  return { results, count: results.length };
}

async function executeOrderQuery(filters: Record<string, unknown>): Promise<QueryResult> {
  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.createdAfter) where.createdAt = { gte: new Date(filters.createdAfter as string) };
  if (filters.totalGtCents) where.totalCents = { gt: filters.totalGtCents as number };

  const orders = await db.order.findMany({
    where,
    select: {
      id: true,
      status: true,
      totalCents: true,
      createdAt: true,
      user: {
        select: { email: true, firstName: true, lastName: true },
      },
      items: {
        select: { product: { select: { name: true } }, quantity: true, totalCents: true },
      },
    },
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  const results = orders.map((o) => ({
    id: o.id,
    customer: [o.user.firstName, o.user.lastName].filter(Boolean).join(" ") || o.user.email,
    email: o.user.email,
    status: o.status,
    total: o.totalCents,
    items: o.items.map((i) => `${i.product.name} x${i.quantity}`).join(", "),
    createdAt: o.createdAt,
  }));

  return { results, count: results.length };
}

// ─── Saved queries ─────────────────────────────────────────────

export async function saveQuery(
  query: string,
  parsedFilter: Record<string, unknown>,
  resultCount: number,
  adminId: string
) {
  return db.savedQuery.create({
    data: {
      query,
      parsedFilter: parsedFilter as object,
      resultCount,
      adminId,
    },
  });
}

export async function getRecentQueries(adminId: string, limit = 10) {
  return db.savedQuery.findMany({
    where: { adminId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
