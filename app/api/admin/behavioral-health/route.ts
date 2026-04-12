import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  submitScreening,
  getScreenings,
  reviewScreening,
  createReferral,
  getReferrals,
  updateReferral,
  getBehavioralMetrics,
} from "@/lib/admin-behavioral-health";
import { safeError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "metrics") {
      const metrics = await getBehavioralMetrics();
      return NextResponse.json(metrics);
    }

    if (action === "referrals") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "25");
      const status = url.searchParams.get("status") || undefined;
      const data = await getReferrals(page, limit, status);
      return NextResponse.json(data);
    }

    // Default: screenings
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "25");
    const flaggedParam = url.searchParams.get("flagged");
    const flagged = flaggedParam === "true" ? true : flaggedParam === "false" ? false : undefined;

    const data = await getScreenings(page, limit, flagged);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Behavioral Health GET]", error);
    return NextResponse.json({ error: "Failed to fetch behavioral health data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { action } = body;

    if (action === "submit-screening") {
      const { userId, type, responses } = body;
      if (!userId || !type || !responses) {
        return NextResponse.json({ error: "userId, type, and responses required" }, { status: 400 });
      }
      const screening = await submitScreening(userId, type, responses);
      return NextResponse.json({ screening });
    }

    if (action === "create-referral") {
      const { userId, referralType, screeningId } = body;
      if (!userId || !referralType) {
        return NextResponse.json({ error: "userId and referralType required" }, { status: 400 });
      }
      const referral = await createReferral(userId, referralType, screeningId);
      return NextResponse.json({ referral });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Behavioral Health POST]", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { action } = body;

    if (action === "review-screening") {
      const { id } = body;
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const screening = await reviewScreening(id, session.userId);
      return NextResponse.json({ screening });
    }

    if (action === "update-referral") {
      const { id, ...data } = body;
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      // Convert date strings to Date objects
      if (data.scheduledAt) data.scheduledAt = new Date(data.scheduledAt);
      if (data.completedAt) data.completedAt = new Date(data.completedAt);
      delete data.action;
      const referral = await updateReferral(id, data);
      return NextResponse.json({ referral });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Behavioral Health PUT]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
