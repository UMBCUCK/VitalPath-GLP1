import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// ─── Types ─────────────────────────────────────────────────────

export interface SegmentCondition {
  field: string;
  op: string;
  value: string | number;
}

export interface SegmentRules {
  operator: "AND" | "OR";
  conditions: SegmentCondition[];
}

export interface SegmentData {
  name: string;
  description?: string;
  rules: SegmentRules;
  isActive?: boolean;
  autoTrigger?: string | null;
  createdBy: string;
}

interface SampleUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

// ─── Available fields and their types ──────────────────────────

const NUMERIC_FIELDS = [
  "health_score",
  "churn_risk",
  "weight_lost",
  "days_since_signup",
  "days_inactive",
  "total_orders",
  "total_revenue",
];

const STRING_FIELDS = ["lifecycle_stage", "state", "plan", "subscription_status"];

export function getFieldType(field: string): "numeric" | "string" {
  if (NUMERIC_FIELDS.includes(field)) return "numeric";
  return "string";
}

// ─── Build Prisma where clause from a single condition ─────────

function buildConditionWhere(condition: SegmentCondition): Prisma.UserWhereInput | null {
  const { field, op, value } = condition;

  switch (field) {
    case "health_score": {
      const num = Number(value);
      return { profile: { healthScore: numericComparison(op, num) } };
    }
    case "churn_risk": {
      const num = Number(value);
      return { profile: { churnRisk: numericComparison(op, num) } };
    }
    case "lifecycle_stage": {
      return { profile: { lifecycleStage: stringComparison(op, String(value)) } };
    }
    case "state": {
      return { profile: { state: stringComparison(op, String(value)) } };
    }
    case "plan": {
      return {
        subscriptions: {
          some: {
            items: {
              some: {
                product: { name: stringComparison(op, String(value)) },
              },
            },
          },
        },
      };
    }
    case "subscription_status": {
      const statusMap: Record<string, string> = {
        active: "ACTIVE",
        paused: "PAUSED",
        past_due: "PAST_DUE",
        canceled: "CANCELED",
        expired: "EXPIRED",
        trialing: "TRIALING",
      };
      const mapped = statusMap[String(value).toLowerCase()] || String(value).toUpperCase();
      return {
        subscriptions: {
          some: { status: mapped as Prisma.EnumSubscriptionStatusFilter },
        },
      };
    }
    case "days_since_signup": {
      const days = Number(value);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      // gt days means createdAt is before cutoff, lt means after
      if (op === "gt" || op === "gte") {
        return { createdAt: { lte: cutoff } };
      } else if (op === "lt" || op === "lte") {
        return { createdAt: { gte: cutoff } };
      } else {
        // eq: approximately that many days ago (within 1 day)
        const dayBefore = new Date(cutoff);
        dayBefore.setDate(dayBefore.getDate() - 1);
        return { createdAt: { gte: dayBefore, lte: cutoff } };
      }
    }
    // Complex fields that require post-filtering
    case "weight_lost":
    case "days_inactive":
    case "total_orders":
    case "total_revenue":
      return null; // Handle post-filter
    default:
      return null;
  }
}

function numericComparison(
  op: string,
  value: number
): Prisma.IntNullableFilter | Prisma.FloatNullableFilter {
  switch (op) {
    case "gt": return { gt: value };
    case "gte": return { gte: value };
    case "lt": return { lt: value };
    case "lte": return { lte: value };
    case "eq": return { equals: value };
    case "not_equals": return { not: value };
    default: return { equals: value };
  }
}

function stringComparison(op: string, value: string): Record<string, unknown> {
  switch (op) {
    case "equals": return { equals: value };
    case "not_equals": return { not: value };
    case "contains": return { contains: value };
    default: return { equals: value };
  }
}

// ─── Post-filter functions for computed fields ─────────────────

async function postFilterUsers(
  userIds: string[],
  conditions: SegmentCondition[],
  operator: "AND" | "OR"
): Promise<string[]> {
  const computedFields = conditions.filter((c) =>
    ["weight_lost", "days_inactive", "total_orders", "total_revenue"].includes(c.field)
  );

  if (computedFields.length === 0) return userIds;
  if (userIds.length === 0) return [];

  // Fetch all data we might need
  const [progressEntries, orders] = await Promise.all([
    computedFields.some((c) => c.field === "weight_lost" || c.field === "days_inactive")
      ? db.progressEntry.findMany({
          where: { userId: { in: userIds } },
          select: { userId: true, weightLbs: true, date: true },
          orderBy: { date: "asc" },
        })
      : Promise.resolve([]),
    computedFields.some((c) => c.field === "total_orders" || c.field === "total_revenue")
      ? db.order.findMany({
          where: { userId: { in: userIds } },
          select: { userId: true, totalCents: true },
        })
      : Promise.resolve([]),
  ]);

  // Group by user
  const progressByUser = new Map<string, typeof progressEntries>();
  for (const entry of progressEntries) {
    const existing = progressByUser.get(entry.userId) || [];
    existing.push(entry);
    progressByUser.set(entry.userId, existing);
  }

  const ordersByUser = new Map<string, typeof orders>();
  for (const order of orders) {
    const existing = ordersByUser.get(order.userId) || [];
    existing.push(order);
    ordersByUser.set(order.userId, existing);
  }

  return userIds.filter((userId) => {
    const results = computedFields.map((condition) => {
      const { field, op, value } = condition;
      const numValue = Number(value);

      switch (field) {
        case "weight_lost": {
          const entries = (progressByUser.get(userId) || []).filter(
            (e) => e.weightLbs != null
          );
          if (entries.length < 2) return false;
          const weightLost =
            (entries[0].weightLbs ?? 0) - (entries[entries.length - 1].weightLbs ?? 0);
          return compareNumeric(weightLost, op, numValue);
        }
        case "days_inactive": {
          const entries = progressByUser.get(userId) || [];
          if (entries.length === 0) return op === "gt" || op === "gte"; // No entries = infinitely inactive
          const lastDate = new Date(entries[entries.length - 1].date);
          const daysSince = Math.floor(
            (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return compareNumeric(daysSince, op, numValue);
        }
        case "total_orders": {
          const userOrders = ordersByUser.get(userId) || [];
          return compareNumeric(userOrders.length, op, numValue);
        }
        case "total_revenue": {
          const userOrders = ordersByUser.get(userId) || [];
          const totalRevenue = userOrders.reduce((sum, o) => sum + o.totalCents, 0);
          return compareNumeric(totalRevenue / 100, op, numValue); // Compare in dollars
        }
        default:
          return false;
      }
    });

    return operator === "AND" ? results.every(Boolean) : results.some(Boolean);
  });
}

function compareNumeric(actual: number, op: string, target: number): boolean {
  switch (op) {
    case "gt": return actual > target;
    case "gte": return actual >= target;
    case "lt": return actual < target;
    case "lte": return actual <= target;
    case "eq": return actual === target;
    case "not_equals": return actual !== target;
    default: return actual === target;
  }
}

// ─── Execute segment rules ─────────────────────────────────────

async function executeSegmentRules(
  rules: SegmentRules
): Promise<{ count: number; sampleUsers: SampleUser[] }> {
  const { operator, conditions } = rules;

  if (!conditions || conditions.length === 0) {
    return { count: 0, sampleUsers: [] };
  }

  // Separate Prisma-filterable conditions from post-filter conditions
  const prismaConditions: Prisma.UserWhereInput[] = [];
  const postFilterConditions: SegmentCondition[] = [];

  for (const condition of conditions) {
    const where = buildConditionWhere(condition);
    if (where) {
      prismaConditions.push(where);
    } else {
      postFilterConditions.push(condition);
    }
  }

  // Build the base where clause
  let baseWhere: Prisma.UserWhereInput = { role: "PATIENT" };

  if (prismaConditions.length > 0) {
    if (operator === "AND") {
      baseWhere = { ...baseWhere, AND: prismaConditions };
    } else {
      baseWhere = { ...baseWhere, OR: prismaConditions };
    }
  }

  // Fetch matching users
  const users = await db.user.findMany({
    where: baseWhere,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
    take: postFilterConditions.length > 0 ? undefined : 10000,
  });

  let matchingUserIds = users.map((u) => u.id);

  // Apply post-filters
  if (postFilterConditions.length > 0) {
    matchingUserIds = await postFilterUsers(matchingUserIds, postFilterConditions, operator);
  }

  const matchingUsers = users.filter((u) => matchingUserIds.includes(u.id));
  const count = matchingUsers.length;
  const sampleUsers = matchingUsers.slice(0, 5);

  return { count, sampleUsers };
}

// ─── CRUD Operations ───────────────────────────────────────────

export async function getSegments(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [segments, total] = await Promise.all([
    db.advancedSegment.findMany({
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    db.advancedSegment.count(),
  ]);

  return {
    segments: segments.map((s) => ({
      ...s,
      lastComputedAt: s.lastComputedAt?.toISOString() || null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    total,
    page,
    limit,
  };
}

export async function createSegment(data: SegmentData) {
  const segment = await db.advancedSegment.create({
    data: {
      name: data.name,
      description: data.description || null,
      rules: data.rules as unknown as Prisma.JsonObject,
      isActive: data.isActive ?? true,
      autoTrigger: data.autoTrigger || null,
      createdBy: data.createdBy,
    },
  });

  return {
    ...segment,
    lastComputedAt: segment.lastComputedAt?.toISOString() || null,
    createdAt: segment.createdAt.toISOString(),
    updatedAt: segment.updatedAt.toISOString(),
  };
}

export async function updateSegment(id: string, data: Partial<SegmentData>) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.rules !== undefined) updateData.rules = data.rules as unknown as Prisma.JsonObject;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.autoTrigger !== undefined) updateData.autoTrigger = data.autoTrigger;

  const segment = await db.advancedSegment.update({
    where: { id },
    data: updateData,
  });

  return {
    ...segment,
    lastComputedAt: segment.lastComputedAt?.toISOString() || null,
    createdAt: segment.createdAt.toISOString(),
    updatedAt: segment.updatedAt.toISOString(),
  };
}

export async function deleteSegment(id: string) {
  await db.advancedSegment.delete({ where: { id } });
  return { ok: true };
}

// ─── Compute segment members ───────────────────────────────────

export async function computeSegmentMembers(segmentId: string) {
  const segment = await db.advancedSegment.findUnique({
    where: { id: segmentId },
  });
  if (!segment) throw new Error("Segment not found");

  const rules = segment.rules as unknown as SegmentRules;
  const result = await executeSegmentRules(rules);

  // Update the segment with computed results
  await db.advancedSegment.update({
    where: { id: segmentId },
    data: {
      memberCount: result.count,
      lastComputedAt: new Date(),
    },
  });

  return result;
}

// ─── Preview without saving ────────────────────────────────────

export async function previewSegment(rules: SegmentRules) {
  return executeSegmentRules(rules);
}

// ─── Export segment members ────────────────────────────────────

export async function exportSegment(
  segmentId: string,
  format: "csv" | "json"
): Promise<{ data: string; filename: string; contentType: string }> {
  const segment = await db.advancedSegment.findUnique({
    where: { id: segmentId },
  });
  if (!segment) throw new Error("Segment not found");

  const rules = segment.rules as unknown as SegmentRules;
  const { conditions, operator } = rules;

  if (!conditions || conditions.length === 0) {
    if (format === "csv") {
      return {
        data: "id,email,firstName,lastName\n",
        filename: `${segment.name.replace(/\s+/g, "-")}-export.csv`,
        contentType: "text/csv",
      };
    }
    return {
      data: JSON.stringify([], null, 2),
      filename: `${segment.name.replace(/\s+/g, "-")}-export.json`,
      contentType: "application/json",
    };
  }

  // Build where clause from Prisma-filterable conditions
  const prismaConditions: Prisma.UserWhereInput[] = [];
  const postFilterConditions: SegmentCondition[] = [];

  for (const condition of conditions) {
    const where = buildConditionWhere(condition);
    if (where) {
      prismaConditions.push(where);
    } else {
      postFilterConditions.push(condition);
    }
  }

  let baseWhere: Prisma.UserWhereInput = { role: "PATIENT" };
  if (prismaConditions.length > 0) {
    if (operator === "AND") {
      baseWhere = { ...baseWhere, AND: prismaConditions };
    } else {
      baseWhere = { ...baseWhere, OR: prismaConditions };
    }
  }

  const users = await db.user.findMany({
    where: baseWhere,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      profile: {
        select: {
          state: true,
          healthScore: true,
          churnRisk: true,
          lifecycleStage: true,
        },
      },
    },
  });

  let filteredUsers = users;
  if (postFilterConditions.length > 0) {
    const matchingIds = await postFilterUsers(
      users.map((u) => u.id),
      postFilterConditions,
      operator
    );
    filteredUsers = users.filter((u) => matchingIds.includes(u.id));
  }

  const safeName = segment.name.replace(/\s+/g, "-").toLowerCase();

  if (format === "csv") {
    const header = "id,email,firstName,lastName,state,healthScore,churnRisk,lifecycleStage,createdAt";
    const rows = filteredUsers.map((u) =>
      [
        u.id,
        u.email,
        u.firstName || "",
        u.lastName || "",
        u.profile?.state || "",
        u.profile?.healthScore ?? "",
        u.profile?.churnRisk ?? "",
        u.profile?.lifecycleStage || "",
        u.createdAt.toISOString(),
      ]
        .map((v) => {
          const s = String(v);
          return s.includes(",") || s.includes('"')
            ? `"${s.replace(/"/g, '""')}"`
            : s;
        })
        .join(",")
    );
    return {
      data: [header, ...rows].join("\n"),
      filename: `${safeName}-export.csv`,
      contentType: "text/csv",
    };
  }

  return {
    data: JSON.stringify(
      filteredUsers.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        state: u.profile?.state,
        healthScore: u.profile?.healthScore,
        churnRisk: u.profile?.churnRisk,
        lifecycleStage: u.profile?.lifecycleStage,
        createdAt: u.createdAt.toISOString(),
      })),
      null,
      2
    ),
    filename: `${safeName}-export.json`,
    contentType: "application/json",
  };
}
