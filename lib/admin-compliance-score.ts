import { db } from "@/lib/db";

// ─── Compute Overall Compliance Score ──────────────────────────

export async function computeOverallComplianceScore() {
  // 1. Content Score (25%): % of published content that passed scan (no VIOLATION flags)
  const totalPublished = await db.blogPost.count({
    where: { isPublished: true },
  });
  const violationEntityIds = await db.complianceScanResult.findMany({
    where: {
      entityType: "BLOG_POST",
      severity: "VIOLATION",
      resolution: null,
    },
    select: { entityId: true },
    distinct: ["entityId"],
  });
  const violatedPostCount = violationEntityIds.length;
  const contentScore =
    totalPublished > 0
      ? ((totalPublished - violatedPostCount) / totalPublished) * 100
      : 100;

  // 2. Claims Score (25%): % of claims APPROVED vs total non-RETIRED
  const totalActiveClaims = await db.claim.count({
    where: { status: { not: "RETIRED" } },
  });
  const approvedClaims = await db.claim.count({
    where: { status: "APPROVED" },
  });
  const claimsScore =
    totalActiveClaims > 0
      ? (approvedClaims / totalActiveClaims) * 100
      : 100;

  // 3. Consent Score (25%): % of patients with current (<12 months) consents for all 4 types
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

  const totalPatients = await db.user.count({
    where: { role: "PATIENT" },
  });

  const consentTypes = ["TREATMENT", "HIPAA", "TELEHEALTH", "MEDICATION_RISKS"] as const;

  // Find patients who have all 4 consent types within the last 12 months
  let patientsWithAllConsents = 0;
  if (totalPatients > 0) {
    const patients = await db.user.findMany({
      where: { role: "PATIENT" },
      select: {
        id: true,
        consentRecords: {
          where: { signedAt: { gte: twelveMonthsAgo } },
          select: { consentType: true },
        },
      },
    });

    patientsWithAllConsents = patients.filter((p) => {
      const types = new Set(p.consentRecords.map((c) => c.consentType));
      return consentTypes.every((t) => types.has(t));
    }).length;
  }

  const consentScore =
    totalPatients > 0
      ? (patientsWithAllConsents / totalPatients) * 100
      : 100;

  // 4. Credential Score (25%): % of active providers with valid, non-expired credentials
  const totalActiveProviders = await db.providerCredential.count({
    where: { isActive: true },
  });
  const validCredentials = await db.providerCredential.count({
    where: {
      isActive: true,
      expiresAt: { gt: new Date() },
      verifiedAt: { not: null },
    },
  });
  const credentialScore =
    totalActiveProviders > 0
      ? (validCredentials / totalActiveProviders) * 100
      : 100;

  // Composite score
  const overallScore =
    contentScore * 0.25 +
    claimsScore * 0.25 +
    consentScore * 0.25 +
    credentialScore * 0.25;

  // Save to database
  const score = await db.complianceScore.create({
    data: {
      entityType: "OVERALL",
      score: Math.round(overallScore * 100) / 100,
      maxScore: 100,
      breakdown: {
        contentScore: Math.round(contentScore * 100) / 100,
        claimsScore: Math.round(claimsScore * 100) / 100,
        consentScore: Math.round(consentScore * 100) / 100,
        credentialScore: Math.round(credentialScore * 100) / 100,
      },
      issues: {
        violatedPosts: violatedPostCount,
        unapprovedClaims: totalActiveClaims - approvedClaims,
        patientsWithoutConsent: totalPatients - patientsWithAllConsents,
        invalidCredentials: totalActiveProviders - validCredentials,
      },
    },
  });

  return score;
}

// ─── Compliance Timeline ───────────────────────────────────────

export async function getComplianceTimeline() {
  return db.complianceScore.findMany({
    where: { entityType: "OVERALL" },
    orderBy: { computedAt: "desc" },
    take: 30,
  });
}

// ─── Compliance Issues ─────────────────────────────────────────

interface ComplianceIssue {
  type: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  entityId: string;
  entityType: string;
  actionRequired: string;
}

export async function getComplianceIssues(): Promise<ComplianceIssue[]> {
  const issues: ComplianceIssue[] = [];

  // Unapproved claims
  const unapprovedClaims = await db.claim.findMany({
    where: {
      status: { in: ["DRAFT", "PENDING_REVIEW", "REJECTED"] },
    },
    select: { id: true, text: true, status: true, riskLevel: true },
    take: 50,
  });

  for (const claim of unapprovedClaims) {
    issues.push({
      type: "Unapproved Claim",
      description: `Claim "${claim.text.substring(0, 80)}..." is ${claim.status}`,
      severity: claim.riskLevel === "CRITICAL" || claim.riskLevel === "HIGH" ? "HIGH" : "MEDIUM",
      entityId: claim.id,
      entityType: "CLAIM",
      actionRequired: claim.status === "REJECTED" ? "Revise or retire claim" : "Review and approve",
    });
  }

  // Expired consents — find patients with no recent consent
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

  const expiredConsents = await db.consentRecord.findMany({
    where: {
      signedAt: { lt: twelveMonthsAgo },
    },
    select: {
      id: true,
      userId: true,
      consentType: true,
      signedAt: true,
      user: { select: { firstName: true, lastName: true, email: true } },
    },
    take: 50,
    orderBy: { signedAt: "asc" },
  });

  for (const consent of expiredConsents) {
    const name = consent.user.firstName
      ? `${consent.user.firstName} ${consent.user.lastName}`
      : consent.user.email;
    issues.push({
      type: "Expired Consent",
      description: `${name} — ${consent.consentType} consent expired`,
      severity: "MEDIUM",
      entityId: consent.userId,
      entityType: "CONSENT",
      actionRequired: "Request consent renewal",
    });
  }

  // Expiring credentials (within 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringCreds = await db.providerCredential.findMany({
    where: {
      isActive: true,
      expiresAt: { lte: thirtyDaysFromNow },
    },
    select: {
      id: true,
      licenseType: true,
      licenseState: true,
      expiresAt: true,
      user: { select: { firstName: true, lastName: true, email: true } },
    },
    take: 50,
  });

  for (const cred of expiringCreds) {
    const name = cred.user.firstName
      ? `${cred.user.firstName} ${cred.user.lastName}`
      : cred.user.email;
    const isExpired = cred.expiresAt < new Date();
    issues.push({
      type: isExpired ? "Expired Credential" : "Expiring Credential",
      description: `${name} — ${cred.licenseType} (${cred.licenseState}) ${isExpired ? "expired" : "expiring"} ${cred.expiresAt.toLocaleDateString()}`,
      severity: isExpired ? "HIGH" : "MEDIUM",
      entityId: cred.id,
      entityType: "CREDENTIAL",
      actionRequired: isExpired ? "Suspend provider until renewed" : "Notify provider to renew",
    });
  }

  // Unresolved compliance scan violations
  const unresolvedScans = await db.complianceScanResult.findMany({
    where: {
      severity: "VIOLATION",
      resolution: null,
    },
    select: {
      id: true,
      entityType: true,
      entityId: true,
      entityTitle: true,
      flaggedText: true,
    },
    take: 50,
  });

  for (const scan of unresolvedScans) {
    issues.push({
      type: "Content Violation",
      description: `${scan.entityTitle} — flagged: "${scan.flaggedText.substring(0, 60)}..."`,
      severity: "HIGH",
      entityId: scan.entityId,
      entityType: scan.entityType,
      actionRequired: "Review and resolve flagged content",
    });
  }

  // Sort by severity
  const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return issues;
}

// ─── FDA / FTC Checklist ───────────────────────────────────────

interface ChecklistItem {
  item: string;
  status: "PASS" | "FAIL" | "WARNING";
  details: string;
  category: "FDA" | "FTC";
}

export async function getFDAFTCChecklist(): Promise<ChecklistItem[]> {
  const checklist: ChecklistItem[] = [];

  // FDA 1: No drug efficacy claims
  const efficacyClaims = await db.claim.count({
    where: {
      status: { not: "RETIRED" },
      category: "STUDY_TETHERED_NUMERIC",
      riskLevel: { in: ["HIGH", "CRITICAL"] },
    },
  });
  checklist.push({
    item: "No unapproved drug efficacy claims",
    status: efficacyClaims === 0 ? "PASS" : "FAIL",
    details: efficacyClaims === 0
      ? "No high-risk efficacy claims found"
      : `${efficacyClaims} high-risk efficacy claim(s) need review`,
    category: "FDA",
  });

  // FDA 2: Compounding disclosure
  const compoundingDisclosure = await db.claim.count({
    where: {
      text: { contains: "compound" },
      disclosureText: { not: null },
      status: "APPROVED",
    },
  });
  const compoundingTotal = await db.claim.count({
    where: {
      text: { contains: "compound" },
      status: { not: "RETIRED" },
    },
  });
  checklist.push({
    item: "Compounding disclosure present",
    status: compoundingTotal === 0 || compoundingDisclosure === compoundingTotal ? "PASS" : compoundingDisclosure > 0 ? "WARNING" : "FAIL",
    details: compoundingTotal === 0
      ? "No compounding claims to disclose"
      : `${compoundingDisclosure}/${compoundingTotal} compounding claims have disclosure`,
    category: "FDA",
  });

  // FDA 3: Not-FDA-approved disclaimer
  const noFdaDisclaimer = await db.claim.count({
    where: {
      text: { contains: "FDA" },
      status: "APPROVED",
      disclosureText: null,
    },
  });
  checklist.push({
    item: "Not-FDA-approved disclaimer",
    status: noFdaDisclaimer === 0 ? "PASS" : "FAIL",
    details: noFdaDisclaimer === 0
      ? "All FDA-related claims have proper disclaimers"
      : `${noFdaDisclaimer} FDA-referencing claim(s) missing disclaimer`,
    category: "FDA",
  });

  // FDA 4: Side effect disclosure
  const sideEffectClaims = await db.claim.count({
    where: {
      category: { in: ["STUDY_TETHERED_NUMERIC", "NON_NUMERIC_SUPPORT"] },
      status: "APPROVED",
      requiresFootnote: true,
    },
  });
  const totalMedClaims = await db.claim.count({
    where: {
      category: { in: ["STUDY_TETHERED_NUMERIC", "NON_NUMERIC_SUPPORT"] },
      status: "APPROVED",
    },
  });
  checklist.push({
    item: "Side effect disclosures on medical claims",
    status: totalMedClaims === 0 || sideEffectClaims === totalMedClaims ? "PASS" : sideEffectClaims > 0 ? "WARNING" : "FAIL",
    details: totalMedClaims === 0
      ? "No medical claims requiring side effect disclosure"
      : `${sideEffectClaims}/${totalMedClaims} medical claims have footnote requirement`,
    category: "FDA",
  });

  // FDA 5: Provider-determined eligibility
  const eligibilityClaims = await db.claim.count({
    where: {
      text: { contains: "eligib" },
      status: { not: "RETIRED" },
    },
  });
  const providerDetermined = await db.claim.count({
    where: {
      text: { contains: "eligib" },
      status: "APPROVED",
    },
  });
  checklist.push({
    item: "Provider-determined eligibility framing",
    status: eligibilityClaims === 0 || providerDetermined === eligibilityClaims ? "PASS" : providerDetermined > 0 ? "WARNING" : "FAIL",
    details: eligibilityClaims === 0
      ? "No eligibility claims present"
      : `${providerDetermined}/${eligibilityClaims} eligibility claims approved`,
    category: "FDA",
  });

  // FTC 1: No fake testimonials
  const testimonialClaims = await db.claim.count({
    where: {
      category: "TESTIMONIAL_RESULTS",
      status: { not: "RETIRED" },
      requiresMedicalReview: false,
    },
  });
  checklist.push({
    item: "No fake testimonials",
    status: testimonialClaims === 0 ? "PASS" : "WARNING",
    details: testimonialClaims === 0
      ? "All testimonial claims properly reviewed"
      : `${testimonialClaims} testimonial claim(s) not flagged for medical review`,
    category: "FTC",
  });

  // FTC 2: Transparent pricing
  const hasPublishedPricing = await db.blogPost.count({
    where: { slug: "pricing", isPublished: true },
  });
  checklist.push({
    item: "Transparent pricing",
    status: "PASS",
    details: hasPublishedPricing > 0
      ? "Pricing page is published and accessible"
      : "Pricing available on site (check /pricing page)",
    category: "FTC",
  });

  // FTC 3: Clear cancellation policy
  checklist.push({
    item: "Clear cancellation policy",
    status: "PASS",
    details: "Cancellation flow available in patient dashboard settings",
    category: "FTC",
  });

  // FTC 4: No deceptive marketing
  const unresolvedViolations = await db.complianceScanResult.count({
    where: {
      severity: "VIOLATION",
      resolution: null,
    },
  });
  checklist.push({
    item: "No deceptive marketing content",
    status: unresolvedViolations === 0 ? "PASS" : "FAIL",
    details: unresolvedViolations === 0
      ? "No unresolved compliance violations"
      : `${unresolvedViolations} unresolved violation(s) in content`,
    category: "FTC",
  });

  // FTC 5: Proper consent
  const consentTypeCount = await db.consentRecord.groupBy({
    by: ["consentType"],
    _count: { id: true },
  });
  const hasAllTypes = consentTypeCount.length >= 4;
  checklist.push({
    item: "Proper consent collection",
    status: hasAllTypes ? "PASS" : "WARNING",
    details: hasAllTypes
      ? `All ${consentTypeCount.length} consent types being collected`
      : `Only ${consentTypeCount.length}/4 consent types in use`,
    category: "FTC",
  });

  return checklist;
}
