import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getProviderScorecards,
  getAllProviderRankings,
  generateProviderScorecard,
  getProviderComparison,
  getCredentialAlerts,
} from "@/lib/admin-provider-scorecards";
import { safeError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const providerId = url.searchParams.get("providerId") || undefined;

    // Rankings: generate scorecards for all providers in a date range
    if (action === "rankings") {
      const periodStart = url.searchParams.get("periodStart");
      const periodEnd = url.searchParams.get("periodEnd");
      if (!periodStart || !periodEnd) {
        return NextResponse.json(
          { error: "periodStart and periodEnd required for rankings" },
          { status: 400 }
        );
      }
      const rankings = await getAllProviderRankings(
        new Date(periodStart),
        new Date(periodEnd)
      );
      return NextResponse.json({ rankings });
    }

    // Comparison: side-by-side two providers
    if (action === "compare") {
      const providerIdA = url.searchParams.get("providerIdA");
      const providerIdB = url.searchParams.get("providerIdB");
      if (!providerIdA || !providerIdB) {
        return NextResponse.json(
          { error: "providerIdA and providerIdB required" },
          { status: 400 }
        );
      }
      const comparison = await getProviderComparison(providerIdA, providerIdB);
      return NextResponse.json({ comparison });
    }

    // Credential alerts
    if (action === "credential-alerts") {
      const alerts = await getCredentialAlerts();
      return NextResponse.json({ alerts });
    }

    // Default: list scorecards
    const scorecards = await getProviderScorecards(providerId);
    return NextResponse.json({ scorecards });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Provider Scorecards GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch provider scorecards" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { providerId, periodStart, periodEnd } = body;

    // Generate for a specific provider
    if (providerId) {
      if (!periodStart || !periodEnd) {
        return NextResponse.json(
          { error: "periodStart and periodEnd required" },
          { status: 400 }
        );
      }
      const scorecard = await generateProviderScorecard(
        providerId,
        new Date(periodStart),
        new Date(periodEnd)
      );
      return NextResponse.json({ scorecard });
    }

    // Generate rankings for all providers
    if (!periodStart || !periodEnd) {
      return NextResponse.json(
        { error: "periodStart and periodEnd required" },
        { status: 400 }
      );
    }
    const rankings = await getAllProviderRankings(
      new Date(periodStart),
      new Date(periodEnd)
    );
    return NextResponse.json({ rankings });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Provider Scorecards POST]", error);
    return NextResponse.json(
      { error: "Failed to generate scorecards" },
      { status: 500 }
    );
  }
}
