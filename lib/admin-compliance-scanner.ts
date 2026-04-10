import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────

export interface ScanResult {
  id: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  flaggedText: string;
  claimId: string | null;
  severity: string;
  resolution: string | null;
  resolvedBy: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
}

export interface ScanResultsPage {
  results: ScanResult[];
  total: number;
  page: number;
  limit: number;
}

export interface ConsentExpiryInfo {
  totalConsents: number;
  expiringCount: number;
  byType: {
    type: string;
    count: number;
    oldestDate: Date;
    needsRenewal: boolean;
  }[];
}

// ─── Compliance Scanner ─────────────────────────────────────

/**
 * Extract key phrases (3+ word sequences) from claim text.
 * Used for keyword matching against content.
 */
function extractKeyPhrases(text: string): string[] {
  // Normalize to lowercase, strip punctuation
  const normalized = text.toLowerCase().replace(/[^\w\s]/g, "");
  const words = normalized.split(/\s+/).filter(Boolean);

  const phrases: string[] = [];

  // Extract all 3-word, 4-word, and 5-word sequences
  for (let len = 3; len <= Math.min(5, words.length); len++) {
    for (let i = 0; i <= words.length - len; i++) {
      phrases.push(words.slice(i, i + len).join(" "));
    }
  }

  // Also use the full text if it's short enough to be meaningful
  if (words.length >= 3 && words.length <= 8) {
    phrases.push(words.join(" "));
  }

  return [...new Set(phrases)];
}

/**
 * Check if content text contains any of the key phrases.
 * Returns the matched phrase if found.
 */
function findMatchingPhrase(
  contentText: string,
  phrases: string[]
): string | null {
  const normalizedContent = contentText.toLowerCase().replace(/[^\w\s]/g, "");
  for (const phrase of phrases) {
    if (normalizedContent.includes(phrase)) {
      return phrase;
    }
  }
  return null;
}

/**
 * Scan all published content for compliance issues.
 * Checks blog posts, recipes, and comparison pages against the claim library.
 *
 * - If content matches a NON-approved claim (DRAFT, PENDING_REVIEW, REJECTED, RETIRED) -> VIOLATION
 * - If content matches an APPROVED claim but the surrounding text modifies it -> WARNING
 */
export async function scanContentForCompliance(): Promise<ScanResult[]> {
  // Fetch all claims grouped by status
  const allClaims = await db.claim.findMany({
    select: {
      id: true,
      text: true,
      status: true,
      category: true,
      riskLevel: true,
    },
  });

  const approvedClaims = allClaims.filter((c) => c.status === "APPROVED");
  const nonApprovedClaims = allClaims.filter((c) => c.status !== "APPROVED");

  // Build phrase maps
  const nonApprovedPhraseMap = new Map<
    string,
    { claimId: string; phrases: string[] }
  >();
  for (const claim of nonApprovedClaims) {
    const phrases = extractKeyPhrases(claim.text);
    if (phrases.length > 0) {
      nonApprovedPhraseMap.set(claim.id, { claimId: claim.id, phrases });
    }
  }

  const approvedPhraseMap = new Map<
    string,
    { claimId: string; phrases: string[]; fullText: string }
  >();
  for (const claim of approvedClaims) {
    const phrases = extractKeyPhrases(claim.text);
    if (phrases.length > 0) {
      approvedPhraseMap.set(claim.id, {
        claimId: claim.id,
        phrases,
        fullText: claim.text.toLowerCase(),
      });
    }
  }

  // Fetch all published content
  const [blogPosts, recipes, comparisonPages] = await Promise.all([
    db.blogPost.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, content: true },
    }),
    db.recipe.findMany({
      select: { id: true, title: true, description: true, tips: true },
    }),
    db.comparisonPage.findMany({
      select: {
        id: true,
        title: true,
        overviewLeft: true,
        overviewRight: true,
        features: true,
      },
    }),
  ]);

  // Consolidate content entities
  const contentEntities: {
    entityType: string;
    entityId: string;
    entityTitle: string;
    text: string;
  }[] = [];

  for (const post of blogPosts) {
    contentEntities.push({
      entityType: "BLOG_POST",
      entityId: post.id,
      entityTitle: post.title,
      text: `${post.title} ${post.content ?? ""}`,
    });
  }

  for (const recipe of recipes) {
    const combinedText = [recipe.title, recipe.description, recipe.tips]
      .filter(Boolean)
      .join(" ");
    contentEntities.push({
      entityType: "RECIPE",
      entityId: recipe.id,
      entityTitle: recipe.title,
      text: combinedText,
    });
  }

  for (const page of comparisonPages) {
    const featuresText =
      typeof page.features === "string"
        ? page.features
        : JSON.stringify(page.features ?? "");
    const combinedText = [
      page.title,
      page.overviewLeft,
      page.overviewRight,
      featuresText,
    ]
      .filter(Boolean)
      .join(" ");
    contentEntities.push({
      entityType: "COMPARISON_PAGE",
      entityId: page.id,
      entityTitle: page.title,
      text: combinedText,
    });
  }

  // Scan content against claims
  const newFlags: {
    entityType: string;
    entityId: string;
    entityTitle: string;
    flaggedText: string;
    claimId: string | null;
    severity: string;
  }[] = [];

  for (const entity of contentEntities) {
    // Check for NON-approved claim matches -> VIOLATION
    for (const [, claim] of nonApprovedPhraseMap) {
      const matched = findMatchingPhrase(entity.text, claim.phrases);
      if (matched) {
        newFlags.push({
          entityType: entity.entityType,
          entityId: entity.entityId,
          entityTitle: entity.entityTitle,
          flaggedText: matched,
          claimId: claim.claimId,
          severity: "VIOLATION",
        });
      }
    }

    // Check approved claims for modifications -> WARNING
    for (const [, claim] of approvedPhraseMap) {
      const matched = findMatchingPhrase(entity.text, claim.phrases);
      if (matched) {
        // Check if the matched text is an exact substring of the approved claim
        // If the content has the phrase but the surrounding context differs, flag as WARNING
        const normalizedContent = entity.text
          .toLowerCase()
          .replace(/[^\w\s]/g, "");
        if (!normalizedContent.includes(claim.fullText.replace(/[^\w\s]/g, ""))) {
          newFlags.push({
            entityType: entity.entityType,
            entityId: entity.entityId,
            entityTitle: entity.entityTitle,
            flaggedText: matched,
            claimId: claim.claimId,
            severity: "WARNING",
          });
        }
      }
    }
  }

  // Deduplicate: one flag per entity+claim combo
  const seen = new Set<string>();
  const uniqueFlags = newFlags.filter((flag) => {
    const key = `${flag.entityType}:${flag.entityId}:${flag.claimId ?? "none"}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Persist results
  const results: ScanResult[] = [];
  for (const flag of uniqueFlags) {
    const record = await db.complianceScanResult.create({
      data: {
        entityType: flag.entityType,
        entityId: flag.entityId,
        entityTitle: flag.entityTitle,
        flaggedText: flag.flaggedText,
        claimId: flag.claimId,
        severity: flag.severity,
      },
    });
    results.push(record as ScanResult);
  }

  return results;
}

// ─── Paginated Scan Results ─────────────────────────────────

export async function getComplianceScanResults(
  page = 1,
  limit = 25,
  severity?: string
): Promise<ScanResultsPage> {
  const where: Record<string, unknown> = {};
  if (severity && severity !== "all") {
    where.severity = severity;
  }

  const [results, total] = await Promise.all([
    db.complianceScanResult.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.complianceScanResult.count({ where }),
  ]);

  return {
    results: results as ScanResult[],
    total,
    page,
    limit,
  };
}

// ─── Resolve a Scan Flag ────────────────────────────────────

export async function resolveComplianceScan(
  id: string,
  resolution: "APPROVED" | "DISMISSED" | "FIXED",
  resolvedBy: string
): Promise<ScanResult> {
  const result = await db.complianceScanResult.update({
    where: { id },
    data: {
      resolution,
      resolvedBy,
      resolvedAt: new Date(),
    },
  });

  return result as ScanResult;
}

// ─── Consent Expiry Tracker ─────────────────────────────────

export async function getConsentExpiryTracker(): Promise<ConsentExpiryInfo> {
  const allConsents = await db.consentRecord.findMany({
    select: {
      id: true,
      userId: true,
      consentType: true,
      signedAt: true,
    },
    orderBy: { signedAt: "asc" },
  });

  const totalConsents = allConsents.length;
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  // Group by consent type
  const byTypeMap = new Map<
    string,
    { count: number; oldestDate: Date; userIds: Set<string> }
  >();

  for (const consent of allConsents) {
    const existing = byTypeMap.get(consent.consentType);
    if (existing) {
      existing.count++;
      existing.userIds.add(consent.userId);
      if (new Date(consent.signedAt) < existing.oldestDate) {
        existing.oldestDate = new Date(consent.signedAt);
      }
    } else {
      byTypeMap.set(consent.consentType, {
        count: 1,
        oldestDate: new Date(consent.signedAt),
        userIds: new Set([consent.userId]),
      });
    }
  }

  // Find users with oldest consent per type > 12 months
  // Group consents by user+type, keep most recent per user per type
  const latestByUserType = new Map<string, Date>();
  for (const consent of allConsents) {
    const key = `${consent.userId}:${consent.consentType}`;
    const existing = latestByUserType.get(key);
    if (!existing || new Date(consent.signedAt) > existing) {
      latestByUserType.set(key, new Date(consent.signedAt));
    }
  }

  // Count users needing renewal (their latest consent for any type is > 12 months old)
  const usersNeedingRenewal = new Set<string>();
  for (const [key, date] of latestByUserType) {
    if (date < twelveMonthsAgo) {
      const userId = key.split(":")[0];
      usersNeedingRenewal.add(userId);
    }
  }

  const expiringCount = usersNeedingRenewal.size;

  const byType = Array.from(byTypeMap.entries()).map(
    ([type, data]) => ({
      type,
      count: data.count,
      oldestDate: data.oldestDate,
      needsRenewal: data.oldestDate < twelveMonthsAgo,
    })
  );

  return {
    totalConsents,
    expiringCount,
    byType,
  };
}
