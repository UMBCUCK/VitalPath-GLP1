import { db } from "@/lib/db";

// ─── Scoring ───────────────────────────────────────────────

function scorePHQ9(responses: number[]): { score: number; severity: string } {
  const score = responses.reduce((sum, r) => sum + r, 0);
  let severity: string;
  if (score <= 4) severity = "NONE";
  else if (score <= 9) severity = "MILD";
  else if (score <= 14) severity = "MODERATE";
  else if (score <= 19) severity = "MODERATELY_SEVERE";
  else severity = "SEVERE";
  return { score, severity };
}

function scoreGAD7(responses: number[]): { score: number; severity: string } {
  const score = responses.reduce((sum, r) => sum + r, 0);
  let severity: string;
  if (score <= 4) severity = "NONE";
  else if (score <= 9) severity = "MILD";
  else if (score <= 14) severity = "MODERATE";
  else severity = "SEVERE";
  return { score, severity };
}

function scoreAUDIT_C(responses: number[]): { score: number; severity: string } {
  const score = responses.reduce((sum, r) => sum + r, 0);
  let severity: string;
  if (score <= 2) severity = "NONE";
  else if (score <= 3) severity = "MILD";
  else if (score <= 7) severity = "MODERATE";
  else severity = "SEVERE";
  return { score, severity };
}

function scoreCAGE(responses: number[]): { score: number; severity: string } {
  const score = responses.reduce((sum, r) => sum + r, 0);
  let severity: string;
  if (score === 0) severity = "NONE";
  else if (score === 1) severity = "MILD";
  else if (score <= 2) severity = "MODERATE";
  else severity = "SEVERE";
  return { score, severity };
}

// ─── Submit Screening ──────────────────────────────────────

export async function submitScreening(
  userId: string,
  type: "PHQ9" | "GAD7" | "AUDIT_C" | "CAGE",
  responses: number[]
) {
  let result: { score: number; severity: string };

  switch (type) {
    case "PHQ9":
      result = scorePHQ9(responses);
      break;
    case "GAD7":
      result = scoreGAD7(responses);
      break;
    case "AUDIT_C":
      result = scoreAUDIT_C(responses);
      break;
    case "CAGE":
      result = scoreCAGE(responses);
      break;
    default:
      throw new Error(`Unknown screening type: ${type}`);
  }

  // Flag if above threshold: PHQ9 >= 10, GAD7 >= 10, AUDIT_C >= 4, CAGE >= 2
  const flagThresholds: Record<string, number> = {
    PHQ9: 10,
    GAD7: 10,
    AUDIT_C: 4,
    CAGE: 2,
  };
  const flagged = result.score >= (flagThresholds[type] || 10);

  return db.behavioralScreening.create({
    data: {
      userId,
      type,
      score: result.score,
      severity: result.severity,
      responses,
      flagged,
    },
  });
}

// ─── Screenings ────────────────────────────────────────────

export async function getScreenings(
  page = 1,
  limit = 25,
  flagged?: boolean
) {
  const where: Record<string, unknown> = {};
  if (flagged !== undefined) where.flagged = flagged;

  const [screenings, total] = await Promise.all([
    db.behavioralScreening.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.behavioralScreening.count({ where }),
  ]);

  // Enrich with user names
  const userIds = [...new Set(screenings.map((s) => s.userId))] as string[];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return {
    screenings: screenings.map((s) => {
      const user = userMap.get(s.userId);
      return {
        ...s,
        patientName: user
          ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
          : "Unknown",
        patientEmail: user?.email || "",
      };
    }),
    total,
  };
}

export async function reviewScreening(id: string, reviewedBy: string) {
  return db.behavioralScreening.update({
    where: { id },
    data: {
      reviewedBy,
      reviewedAt: new Date(),
    },
  });
}

// ─── Referrals ─────────────────────────────────────────────

export async function createReferral(
  userId: string,
  referralType: "THERAPY" | "PSYCHIATRY" | "CRISIS" | "SUPPORT_GROUP",
  screeningId?: string
) {
  return db.behavioralReferral.create({
    data: {
      userId,
      screeningId: screeningId || null,
      referralType,
      status: "PENDING",
    },
  });
}

export async function getReferrals(
  page = 1,
  limit = 25,
  status?: string
) {
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;

  const [referrals, total] = await Promise.all([
    db.behavioralReferral.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.behavioralReferral.count({ where }),
  ]);

  // Enrich with user names
  const userIds = [...new Set(referrals.map((r) => r.userId))] as string[];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return {
    referrals: referrals.map((r) => {
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

export async function updateReferral(
  id: string,
  data: {
    status?: string;
    providerName?: string;
    notes?: string;
    scheduledAt?: Date;
    completedAt?: Date;
  }
) {
  return db.behavioralReferral.update({
    where: { id },
    data,
  });
}

// ─── Metrics ───────────────────────────────────────────────

export async function getBehavioralMetrics() {
  const [
    totalScreenings,
    flaggedCount,
    unflaggedUnreviewed,
    totalReferrals,
    pendingReferrals,
    completedReferrals,
    byType,
    bySeverity,
  ] = await Promise.all([
    db.behavioralScreening.count(),
    db.behavioralScreening.count({ where: { flagged: true } }),
    db.behavioralScreening.count({ where: { flagged: true, reviewedBy: null } }),
    db.behavioralReferral.count(),
    db.behavioralReferral.count({ where: { status: "PENDING" } }),
    db.behavioralReferral.count({ where: { status: "COMPLETED" } }),
    db.behavioralScreening.groupBy({ by: ["type"], _count: true }),
    db.behavioralScreening.groupBy({ by: ["severity"], _count: true }),
  ]);

  const flaggedRate = totalScreenings > 0
    ? Math.round((flaggedCount / totalScreenings) * 100)
    : 0;
  const referralRate = totalScreenings > 0
    ? Math.round((totalReferrals / totalScreenings) * 100)
    : 0;

  return {
    totalScreenings,
    flaggedCount,
    unflaggedUnreviewed,
    flaggedRate,
    totalReferrals,
    pendingReferrals,
    completedReferrals,
    referralRate,
    byType: byType.map((t) => ({ type: t.type, count: t._count })),
    bySeverity: bySeverity.map((s) => ({ severity: s.severity, count: s._count })),
  };
}
