import { db } from "@/lib/db";

/**
 * Get comprehensive compliance dashboard stats across all resellers.
 */
export async function getResellerComplianceDashboard() {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);

  const [
    totalResellers,
    onboardingComplete,
    onboardingIncomplete,
    w9Submitted,
    activeCount,
    suspendedCount,
    terminatedCount,
    totalViolations,
    oigStaleCount,
    attestationStaleCount,
    pendingContentReviews,
  ] = await Promise.all([
    db.resellerProfile.count(),
    db.resellerProfile.count({ where: { onboardingCompletedAt: { not: null } } }),
    db.resellerProfile.count({ where: { onboardingCompletedAt: null, status: { not: "TERMINATED" } } }),
    db.resellerProfile.count({ where: { w9SubmittedAt: { not: null } } }),
    db.resellerProfile.count({ where: { status: "ACTIVE" } }),
    db.resellerProfile.count({ where: { status: "SUSPENDED" } }),
    db.resellerProfile.count({ where: { status: "TERMINATED" } }),
    db.resellerProfile.aggregate({ _sum: { complianceViolationCount: true } }),
    // OIG stale: active resellers whose OIG check is older than 90 days or never done
    db.resellerProfile.count({
      where: {
        status: { in: ["ACTIVE", "PAUSED"] },
        OR: [
          { oigCheckPassedAt: null },
          { oigCheckPassedAt: { lt: ninetyDaysAgo } },
        ],
      },
    }),
    // Attestation stale: signed more than 90 days ago
    db.resellerProfile.count({
      where: {
        status: { in: ["ACTIVE", "PAUSED"] },
        attestationSignedAt: { lt: ninetyDaysAgo },
      },
    }),
    db.marketingContentSubmission.count({ where: { status: "PENDING" } }),
  ]);

  const w9Rate = totalResellers > 0
    ? Math.round((w9Submitted / totalResellers) * 100)
    : 0;

  return {
    totalResellers,
    onboardingComplete,
    onboardingIncomplete,
    w9Submitted,
    w9Rate,
    activeCount,
    suspendedCount,
    terminatedCount,
    totalViolations: totalViolations._sum.complianceViolationCount || 0,
    oigStaleCount,
    attestationStaleCount,
    pendingContentReviews,
  };
}

/**
 * Get resellers requiring attention (incomplete onboarding, flagged, suspended, high violations).
 */
export async function getResellersRequiringAttention(limit = 50) {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);

  const resellers = await db.resellerProfile.findMany({
    where: {
      OR: [
        { onboardingCompletedAt: null, status: { not: "TERMINATED" } },
        { oigCheckResult: "FLAGGED" },
        { status: "SUSPENDED" },
        { complianceViolationCount: { gte: 2 } },
        // OIG check stale
        {
          status: { in: ["ACTIVE", "PAUSED"] },
          OR: [
            { oigCheckPassedAt: null },
            { oigCheckPassedAt: { lt: ninetyDaysAgo } },
          ],
        },
        // Attestation stale
        {
          status: { in: ["ACTIVE", "PAUSED"] },
          attestationSignedAt: { lt: ninetyDaysAgo },
        },
      ],
    },
    select: {
      id: true,
      displayName: true,
      companyName: true,
      contactEmail: true,
      tier: true,
      status: true,
      onboardingCompletedAt: true,
      complianceViolationCount: true,
      oigCheckResult: true,
      oigCheckPassedAt: true,
      attestationSignedAt: true,
      w9SubmittedAt: true,
      lastComplianceAuditAt: true,
      createdAt: true,
    },
    orderBy: [
      { complianceViolationCount: "desc" },
      { createdAt: "desc" },
    ],
    take: limit,
  });

  return resellers.map((r) => {
    // Determine attention reasons
    const reasons: string[] = [];
    if (!r.onboardingCompletedAt) reasons.push("Onboarding incomplete");
    if (r.oigCheckResult === "FLAGGED") reasons.push("OIG FLAGGED");
    if (r.status === "SUSPENDED") reasons.push("Suspended");
    if (r.complianceViolationCount >= 3) reasons.push(`${r.complianceViolationCount} violations`);
    else if (r.complianceViolationCount >= 2) reasons.push(`${r.complianceViolationCount} violations`);
    if (!r.oigCheckPassedAt || r.oigCheckPassedAt < ninetyDaysAgo) reasons.push("OIG check stale");
    if (r.attestationSignedAt && r.attestationSignedAt < ninetyDaysAgo) reasons.push("Re-attestation due");
    if (!r.w9SubmittedAt) reasons.push("Missing W-9");

    return { ...r, reasons };
  });
}

/**
 * Get pending marketing content review queue.
 */
export async function getMarketingReviewQueue(page = 1, limit = 25) {
  const [submissions, total] = await Promise.all([
    db.marketingContentSubmission.findMany({
      where: { status: "PENDING" },
      orderBy: { submittedAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.marketingContentSubmission.count({ where: { status: "PENDING" } }),
  ]);

  // Fetch reseller names
  const resellerIds = [...new Set(submissions.map((s) => s.resellerId))] as string[];
  const resellers = await db.resellerProfile.findMany({
    where: { id: { in: resellerIds } },
    select: { id: true, displayName: true, companyName: true, tier: true },
  });
  const resellerMap = new Map(resellers.map((r) => [r.id, r]));

  return {
    submissions: submissions.map((s) => ({
      ...s,
      resellerName: resellerMap.get(s.resellerId)?.displayName || "Unknown",
      resellerCompany: resellerMap.get(s.resellerId)?.companyName || null,
      resellerTier: resellerMap.get(s.resellerId)?.tier || "STANDARD",
    })),
    total,
  };
}

/**
 * Get all marketing content submissions (for full review history view).
 */
export async function getAllMarketingSubmissions(page = 1, limit = 25, status?: string) {
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;

  const [submissions, total] = await Promise.all([
    db.marketingContentSubmission.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.marketingContentSubmission.count({ where }),
  ]);

  const resellerIds = [...new Set(submissions.map((s) => s.resellerId))] as string[];
  const resellers = await db.resellerProfile.findMany({
    where: { id: { in: resellerIds } },
    select: { id: true, displayName: true },
  });
  const resellerMap = new Map(resellers.map((r) => [r.id, r]));

  return {
    submissions: submissions.map((s) => ({
      ...s,
      resellerName: resellerMap.get(s.resellerId)?.displayName || "Unknown",
    })),
    total,
  };
}
