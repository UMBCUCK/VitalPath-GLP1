import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getNetworkDownline,
  getNetworkTree,
  getNetworkMetrics,
  getNetworkLeaderboard,
  getNetworkUpline,
  recruitSubReseller,
  processOverrideCommissions,
  updateOverrideRates,
  getTierAutoPromotion,
  promoteResellerTier,
  getOverallNetworkStats,
} from "@/lib/admin-reseller-network";
import { safeError } from "@/lib/logger";

// ── GET: Network data ──────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const action = searchParams.get("action");
    const resellerId = searchParams.get("id");

    switch (action) {
      case "tree": {
        if (!resellerId) {
          return NextResponse.json({ error: "Reseller ID required" }, { status: 400 });
        }
        const tree = await getNetworkTree(resellerId);
        return NextResponse.json({ tree });
      }

      case "downline": {
        if (!resellerId) {
          return NextResponse.json({ error: "Reseller ID required" }, { status: 400 });
        }
        const downline = await getNetworkDownline(resellerId);
        return NextResponse.json({ downline });
      }

      case "upline": {
        if (!resellerId) {
          return NextResponse.json({ error: "Reseller ID required" }, { status: 400 });
        }
        const upline = await getNetworkUpline(resellerId);
        return NextResponse.json({ upline });
      }

      case "metrics": {
        if (!resellerId) {
          return NextResponse.json({ error: "Reseller ID required" }, { status: 400 });
        }
        const metrics = await getNetworkMetrics(resellerId);
        return NextResponse.json({ metrics });
      }

      case "promotion": {
        if (!resellerId) {
          return NextResponse.json({ error: "Reseller ID required" }, { status: 400 });
        }
        const promotion = await getTierAutoPromotion(resellerId);
        return NextResponse.json({ promotion });
      }

      case "leaderboard": {
        const leaderboard = await getNetworkLeaderboard();
        return NextResponse.json({ leaderboard });
      }

      case "stats": {
        const stats = await getOverallNetworkStats();
        return NextResponse.json({ stats });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: tree, downline, upline, metrics, promotion, leaderboard, stats" },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reseller Network GET]", error);
    return NextResponse.json({ error: "Failed to fetch network data" }, { status: 500 });
  }
}

// ── POST: Recruit or process overrides ─────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "recruit": {
        const { recruiterId, newReseller } = body;
        if (!recruiterId || !newReseller?.userId || !newReseller?.displayName || !newReseller?.contactEmail) {
          return NextResponse.json(
            { error: "recruiterId and newReseller (userId, displayName, contactEmail) required" },
            { status: 400 }
          );
        }
        const reseller = await recruitSubReseller(recruiterId, newReseller);
        return NextResponse.json({ reseller }, { status: 201 });
      }

      case "process-overrides": {
        const { commission } = body;
        if (!commission?.id || !commission?.resellerId || commission?.amountCents === undefined) {
          return NextResponse.json(
            { error: "commission (id, resellerId, amountCents) required" },
            { status: 400 }
          );
        }
        const overrides = await processOverrideCommissions(commission);
        return NextResponse.json({ overrides });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: recruit, process-overrides" },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const message = error instanceof Error ? error.message : "Failed to process request";
    safeError("[Admin Reseller Network POST]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── PUT: Update rates or promote ───────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "update-rates": {
        const { resellerId, rates } = body;
        if (!resellerId || !rates) {
          return NextResponse.json(
            { error: "resellerId and rates (tier1OverridePct, tier2OverridePct, tier3OverridePct) required" },
            { status: 400 }
          );
        }
        const updated = await updateOverrideRates(resellerId, rates);
        return NextResponse.json({ reseller: updated });
      }

      case "promote": {
        const { resellerId, newTier } = body;
        if (!resellerId || !newTier) {
          return NextResponse.json(
            { error: "resellerId and newTier required" },
            { status: 400 }
          );
        }
        const result = await promoteResellerTier(resellerId, newTier);
        return NextResponse.json({ result });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: update-rates, promote" },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const message = error instanceof Error ? error.message : "Failed to update";
    safeError("[Admin Reseller Network PUT]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
