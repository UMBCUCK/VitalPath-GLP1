import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getRecommendationAnalytics,
  getContentPerformance,
  getUserRecommendations,
  generateRecommendations,
  generateBatchRecommendations,
} from "@/lib/admin-content-recommendations";

// ── GET: Analytics, performance, or user recommendations ───────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const view = searchParams.get("view"); // "analytics" | "performance" | "user"
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || undefined;

    if (view === "analytics") {
      const analytics = await getRecommendationAnalytics();
      return NextResponse.json(analytics);
    }

    if (view === "performance") {
      const performance = await getContentPerformance();
      return NextResponse.json(performance);
    }

    if (view === "user" && userId) {
      const recs = await getUserRecommendations(userId, type);
      return NextResponse.json(recs);
    }

    // Default: return both analytics + performance
    const [analytics, performance] = await Promise.all([
      getRecommendationAnalytics(),
      getContentPerformance(),
    ]);

    return NextResponse.json({ analytics, performance });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("[Recommendations GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

// ── POST: Generate recommendations (single user or batch) ──────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { userId, batch } = body;

    if (batch) {
      const count = await generateBatchRecommendations();
      return NextResponse.json(
        { message: `Generated recommendations for ${count} patients` },
        { status: 201 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required (or set batch: true)" },
        { status: 400 }
      );
    }

    const recs = await generateRecommendations(userId);
    return NextResponse.json({ recommendations: recs }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("[Recommendations POST]", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
