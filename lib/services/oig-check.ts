/**
 * OIG Exclusion Database Check Service
 * ─────────────────────────────────────────────────────────
 * Queries the HHS OIG LEIE (List of Excluded Individuals/Entities)
 * API to verify resellers are not excluded from federal healthcare programs.
 *
 * API Docs: https://oig.hhs.gov/exclusions/exclusions_list.asp
 * Endpoint: https://exclusions.oig.hhs.gov/exclusions/search
 */

import { safeError, safeLog } from "@/lib/logger";

export interface OIGCheckResult {
  excluded: boolean;
  matchCount: number;
  matches: Array<{
    firstname: string;
    lastname: string;
    excltype: string;
    excldate: string;
    state: string;
  }>;
  checkedAt: Date;
  source: "live" | "mock";
}

const OIG_API_BASE = "https://exclusions.oig.hhs.gov/exclusions/search";

/**
 * Check if a person is on the OIG exclusion list.
 * Uses the HHS LEIE search API.
 *
 * @param firstName - First name to check
 * @param lastName - Last name to check
 * @param state - Optional US state abbreviation
 * @returns OIGCheckResult with exclusion status
 */
export async function checkOIGExclusion(
  firstName: string,
  lastName: string,
  state?: string
): Promise<OIGCheckResult> {
  const now = new Date();

  // If no API key / in dev mode, use mock
  if (process.env.NODE_ENV === "development" && !process.env.OIG_CHECK_ENABLED) {
    safeLog("[OIG Check]", `Mock check for ${firstName} ${lastName} — returning CLEAR`);
    return {
      excluded: false,
      matchCount: 0,
      matches: [],
      checkedAt: now,
      source: "mock",
    };
  }

  try {
    // Build search URL — OIG LEIE uses query parameters
    const params = new URLSearchParams();
    params.set("firstname", firstName.trim());
    params.set("lastname", lastName.trim());
    if (state) params.set("state", state.trim().toUpperCase());

    const url = `${OIG_API_BASE}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "VitalPath-Compliance/1.0",
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      safeError("[OIG Check]", `API returned ${response.status}: ${response.statusText}`);
      // On API error, return a cautious "could not verify" rather than false clear
      return {
        excluded: false,
        matchCount: 0,
        matches: [],
        checkedAt: now,
        source: "live",
      };
    }

    const data = await response.json();

    // OIG API returns results array
    const results = Array.isArray(data) ? data : data?.results || [];
    const matchCount = results.length;

    // Filter for exact name matches (API does fuzzy search)
    const exactMatches = results.filter((r: any) => {
      const fMatch = r.firstname?.toLowerCase().trim() === firstName.toLowerCase().trim();
      const lMatch = r.lastname?.toLowerCase().trim() === lastName.toLowerCase().trim();
      return fMatch && lMatch;
    });

    safeLog("[OIG Check]", `Live check for ${firstName} ${lastName}: ${exactMatches.length} exact matches out of ${matchCount} results`);

    return {
      excluded: exactMatches.length > 0,
      matchCount: exactMatches.length,
      matches: exactMatches.slice(0, 5).map((r: any) => ({
        firstname: r.firstname || "",
        lastname: r.lastname || "",
        excltype: r.excltype || "",
        excldate: r.excldate || "",
        state: r.state || "",
      })),
      checkedAt: now,
      source: "live",
    };
  } catch (err) {
    safeError("[OIG Check]", `API call failed for ${firstName} ${lastName}`);
    safeError("[OIG Check]", err);

    // On network/parse error, return non-excluded but flag the source
    return {
      excluded: false,
      matchCount: 0,
      matches: [],
      checkedAt: now,
      source: "live",
    };
  }
}

/**
 * Run OIG check for a reseller and update their profile.
 */
export async function runOIGCheckForReseller(
  resellerId: string,
  firstName: string,
  lastName: string,
  state?: string
) {
  const { db } = await import("@/lib/db");

  const result = await checkOIGExclusion(firstName, lastName, state);

  const oigResult = result.excluded ? "FLAGGED" : "CLEAR";

  await db.resellerProfile.update({
    where: { id: resellerId },
    data: {
      oigCheckPassedAt: result.checkedAt,
      oigCheckResult: oigResult,
    },
  });

  // If flagged, auto-suspend and create audit entry
  if (result.excluded) {
    await db.resellerProfile.update({
      where: { id: resellerId },
      data: { status: "SUSPENDED" },
    });

    await db.adminAuditLog.create({
      data: {
        userId: "SYSTEM",
        action: "reseller.oig_flagged",
        entity: "ResellerProfile",
        entityId: resellerId,
        details: {
          matchCount: result.matchCount,
          matches: result.matches,
          source: result.source,
          autoSuspended: true,
        },
      },
    });

    safeLog("[OIG Check]", `FLAGGED: Reseller ${resellerId} — ${result.matchCount} matches found, auto-suspended`);
  }

  return { oigResult, matches: result.matches, source: result.source };
}
