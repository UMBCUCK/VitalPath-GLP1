import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────

interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  adminId?: string;
  entity?: string;
  action?: string;
  from?: Date;
  to?: Date;
}

// ─── Search audit trail ──────────────────────────────────────

export async function searchAuditTrail(params: SearchParams) {
  const {
    page = 1,
    limit = 25,
    search,
    adminId,
    entity,
    action,
    from,
    to,
  } = params;
  const where: any = {};

  if (adminId) where.userId = adminId;
  if (entity) where.entity = entity;
  if (action) where.action = action;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) where.createdAt.lte = to;
  }
  if (search) {
    where.OR = [
      { action: { contains: search } },
      { entity: { contains: search } },
      { entityId: { contains: search } },
      { user: { firstName: { contains: search } } },
      { user: { lastName: { contains: search } } },
      { user: { email: { contains: search } } },
    ];
  }

  const [entries, total] = await Promise.all([
    db.adminAuditLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.adminAuditLog.count({ where }),
  ]);

  return { entries, total, page, limit };
}

// ─── Entity timeline ────────────────────────────────────────

export async function getEntityTimeline(entity: string, entityId: string) {
  return db.adminAuditLog.findMany({
    where: { entity, entityId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

// ─── Audit stats ────────────────────────────────────────────

export async function getAuditStats(from?: Date, to?: Date) {
  const dateFilter: any = {};
  if (from || to) {
    dateFilter.createdAt = {};
    if (from) dateFilter.createdAt.gte = from;
    if (to) dateFilter.createdAt.lte = to;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalActions, actionsToday, allEntries] = await Promise.all([
    db.adminAuditLog.count({ where: dateFilter }),
    db.adminAuditLog.count({
      where: { createdAt: { gte: today } },
    }),
    db.adminAuditLog.findMany({
      where: dateFilter,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 1000, // limit for aggregation
    }),
  ]);

  // Most active admin
  const adminCounts = new Map<string, { name: string; count: number }>();
  for (const e of allEntries) {
    const name = [e.user.firstName, e.user.lastName].filter(Boolean).join(" ") || e.user.email;
    const existing = adminCounts.get(e.userId);
    if (existing) {
      existing.count++;
    } else {
      adminCounts.set(e.userId, { name, count: 1 });
    }
  }
  let mostActiveAdmin = { name: "N/A", count: 0 };
  for (const [, v] of adminCounts) {
    if (v.count > mostActiveAdmin.count) mostActiveAdmin = v;
  }

  // Most modified entity
  const entityCounts = new Map<string, number>();
  for (const e of allEntries) {
    entityCounts.set(e.entity, (entityCounts.get(e.entity) ?? 0) + 1);
  }
  let mostModifiedEntity = { name: "N/A", count: 0 };
  for (const [name, count] of entityCounts) {
    if (count > mostModifiedEntity.count) mostModifiedEntity = { name, count };
  }

  // Actions by type
  const actionCounts = new Map<string, number>();
  for (const e of allEntries) {
    actionCounts.set(e.action, (actionCounts.get(e.action) ?? 0) + 1);
  }

  return {
    totalActions,
    actionsToday,
    mostActiveAdmin,
    mostModifiedEntity,
    actionsByType: Object.fromEntries(actionCounts),
  };
}

// ─── Export as CSV ────────────────────────────────────────────

export async function exportAuditTrail(params: SearchParams): Promise<string> {
  // Remove pagination for export — get all matching records
  const allParams = { ...params, page: 1, limit: 10000 };
  const { entries } = await searchAuditTrail(allParams);

  const headers = ["Timestamp", "Admin", "Email", "Action", "Entity", "Entity ID", "Details", "IP Address"];
  const rows = entries.map((e) => {
    const name = [e.user.firstName, e.user.lastName].filter(Boolean).join(" ");
    const details = e.details ? JSON.stringify(e.details).replace(/"/g, '""') : "";
    return [
      e.createdAt.toISOString(),
      name,
      e.user.email,
      e.action,
      e.entity,
      e.entityId ?? "",
      `"${details}"`,
      e.ipAddress ?? "",
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

// ─── Get distinct values for filter dropdowns ────────────────

export async function getAuditFilterOptions() {
  const [admins, entities, actions] = await Promise.all([
    db.adminAuditLog.findMany({
      distinct: ["userId"],
      select: {
        userId: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      take: 100,
    }),
    db.adminAuditLog.findMany({
      distinct: ["entity"],
      select: { entity: true },
      take: 50,
    }),
    db.adminAuditLog.findMany({
      distinct: ["action"],
      select: { action: true },
      take: 50,
    }),
  ]);

  return {
    admins: admins.map((a) => ({
      id: a.userId,
      name: [a.user.firstName, a.user.lastName].filter(Boolean).join(" ") || a.user.email,
    })),
    entities: entities.map((e) => e.entity),
    actions: actions.map((a) => a.action),
  };
}
