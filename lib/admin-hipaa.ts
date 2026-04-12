import { db } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────

interface LogHipaaAccessParams {
  actorId: string;
  actorType: "PATIENT" | "PROVIDER" | "ADMIN" | "SYSTEM";
  action: "ACCESS" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT" | "SHARE";
  resourceType: "PHI" | "MEDICAL_RECORD" | "PRESCRIPTION" | "LAB_RESULT";
  resourceId?: string;
  patientId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

// ─── Audit Logging ─────────────────────────────────────────

export async function logHipaaAccess(params: LogHipaaAccessParams) {
  return db.hipaaAuditEntry.create({
    data: {
      actorId: params.actorId,
      actorType: params.actorType,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId || null,
      patientId: params.patientId || null,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
      details: params.details ? JSON.parse(JSON.stringify(params.details)) : null,
    },
  });
}

export async function getHipaaAuditLog(
  page = 1,
  limit = 50,
  action?: string,
  resourceType?: string,
  patientId?: string
) {
  const where: Record<string, unknown> = {};
  if (action && action !== "all") where.action = action;
  if (resourceType && resourceType !== "all") where.resourceType = resourceType;
  if (patientId) where.patientId = patientId;

  const [entries, total] = await Promise.all([
    db.hipaaAuditEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.hipaaAuditEntry.count({ where }),
  ]);

  // Enrich with actor names
  const actorIds = [...new Set(entries.map((e) => e.actorId))];
  const actors = await db.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const actorMap = new Map(actors.map((a) => [a.id, a]));

  return {
    entries: entries.map((e) => {
      const actor = actorMap.get(e.actorId);
      return {
        ...e,
        actorName: actor
          ? [actor.firstName, actor.lastName].filter(Boolean).join(" ") || actor.email
          : e.actorId === "SYSTEM" ? "System" : "Unknown",
      };
    }),
    total,
  };
}

// ─── Data Requests ─────────────────────────────────────────

export async function getDataRequests(
  page = 1,
  limit = 25,
  status?: string
) {
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;

  const [requests, total] = await Promise.all([
    db.dataRequest.findMany({
      where,
      orderBy: { requestedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.dataRequest.count({ where }),
  ]);

  // Enrich with user names
  const userIds = [...new Set(requests.map((r) => r.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return {
    requests: requests.map((r) => {
      const user = userMap.get(r.userId);
      return {
        ...r,
        patientName: user
          ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
          : "Unknown",
        patientEmail: user?.email || "",
      };
    }),
    total,
  };
}

export async function createDataRequest(
  userId: string,
  type: "ACCESS" | "DELETION" | "EXPORT" | "AMENDMENT"
) {
  return db.dataRequest.create({
    data: {
      userId,
      type,
      status: "PENDING",
      requestedAt: new Date(),
    },
  });
}

export async function processDataRequest(
  id: string,
  action: "PROCESSING" | "COMPLETED" | "DENIED",
  completedBy: string,
  notes?: string,
  exportUrl?: string
) {
  return db.dataRequest.update({
    where: { id },
    data: {
      status: action,
      completedAt: action === "COMPLETED" || action === "DENIED" ? new Date() : undefined,
      completedBy,
      notes: notes || undefined,
      exportUrl: exportUrl || undefined,
    },
  });
}

// ─── Metrics ───────────────────────────────────────────────

export async function getHipaaMetrics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    accessLogs30d,
    totalAccessLogs,
    pendingRequests,
    completedRequests,
    deniedRequests,
    totalRequests,
    actionBreakdown,
  ] = await Promise.all([
    db.hipaaAuditEntry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.hipaaAuditEntry.count(),
    db.dataRequest.count({ where: { status: "PENDING" } }),
    db.dataRequest.count({ where: { status: "COMPLETED" } }),
    db.dataRequest.count({ where: { status: "DENIED" } }),
    db.dataRequest.count(),
    db.hipaaAuditEntry.groupBy({
      by: ["action"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
    }),
  ]);

  // Compliance score: base 100, deduct for pending requests and missing logs
  let complianceScore = 100;
  if (pendingRequests > 5) complianceScore -= 10;
  if (pendingRequests > 10) complianceScore -= 10;
  if (accessLogs30d < 10 && totalAccessLogs > 0) complianceScore -= 5; // Low audit activity
  if (deniedRequests > completedRequests && totalRequests > 0) complianceScore -= 10;
  complianceScore = Math.max(0, complianceScore);

  return {
    accessLogs30d,
    totalAccessLogs,
    pendingRequests,
    completedRequests,
    deniedRequests,
    totalRequests,
    complianceScore,
    actionBreakdown: actionBreakdown.map((a) => ({
      action: a.action,
      count: a._count,
    })),
  };
}
