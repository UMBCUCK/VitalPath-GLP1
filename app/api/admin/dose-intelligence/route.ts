import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { safeError } from "@/lib/logger";
import {
  generateDoseRecommendation,
  getDoseRecommendations,
  reviewRecommendation,
  getDoseIntelligenceMetrics,
} from "@/lib/admin-dose-intelligence";
import { db } from "@/lib/db";
import { z } from "zod";

// ── GET: list recommendations + metrics ───────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const include = url.searchParams.get("include") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const status = url.searchParams.get("status") || undefined;

    const result: Record<string, unknown> = {};

    if (include === "metrics") {
      result.metrics = await getDoseIntelligenceMetrics();
    } else {
      const recommendations = await getDoseRecommendations(page, limit, status);
      result.recommendations = recommendations.rows;
      result.total = recommendations.total;
      result.page = page;
      result.limit = limit;

      if (include.includes("metrics")) {
        result.metrics = await getDoseIntelligenceMetrics();
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    safeError("[dose-intelligence] GET", error);
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST: generate recommendation or batch ────────────────────

const generateSchema = z.object({
  action: z.enum(["generate", "batch"]),
  userId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { action, userId } = generateSchema.parse(body);

    if (action === "generate") {
      if (!userId) {
        return NextResponse.json(
          { error: "userId required for single generation" },
          { status: 400 }
        );
      }
      const rec = await generateDoseRecommendation(userId);
      return NextResponse.json({ recommendation: rec });
    }

    if (action === "batch") {
      // Generate for all patients with active dosage schedules
      const schedules = await db.dosageSchedule.findMany({
        where: { status: "ACTIVE" },
        select: { userId: true },
        distinct: ["userId"],
      });

      const results: string[] = [];
      const errors: { userId: string; error: string }[] = [];

      for (const schedule of schedules) {
        try {
          const rec = await generateDoseRecommendation(schedule.userId);
          results.push(rec.id);
        } catch (err) {
          errors.push({
            userId: schedule.userId,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }

      return NextResponse.json({
        generated: results.length,
        errors: errors.length,
        details: errors.length > 0 ? errors : undefined,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    safeError("[dose-intelligence] POST", error);
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── PUT: review recommendation ────────────────────────────────

const reviewSchema = z.object({
  id: z.string().min(1),
  action: z.enum(["ACCEPTED", "REJECTED"]),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await req.json();
    const { id, action } = reviewSchema.parse(body);

    const rec = await reviewRecommendation(id, action, session.userId);
    return NextResponse.json({ recommendation: rec });
  } catch (error) {
    safeError("[dose-intelligence] PUT", error);
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
