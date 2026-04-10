import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getExperiments,
  createExperiment,
  updateExperiment,
  getExperimentResults,
} from "@/lib/admin-experiments";
import { safeError } from "@/lib/logger";

// ── GET: list experiments ───────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const experimentId = url.searchParams.get("experimentId");

    // If experimentId is provided, return results for that experiment
    if (experimentId) {
      const results = await getExperimentResults(experimentId);
      return NextResponse.json({ results });
    }

    const data = await getExperiments(page, limit);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Experiments GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch experiments" },
      { status: 500 }
    );
  }
}

// ── POST: create a new experiment ───────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { name, description, metric, variants } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!metric) {
      return NextResponse.json(
        { error: "Metric is required" },
        { status: 400 }
      );
    }

    if (!variants || !Array.isArray(variants) || variants.length < 2) {
      return NextResponse.json(
        { error: "At least 2 variants are required" },
        { status: 400 }
      );
    }

    const experiment = await createExperiment({
      name: name.trim(),
      description: description?.trim(),
      metric,
      variants,
      createdBy: session.userId,
    });

    return NextResponse.json({ experiment });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Experiments POST]", error);
    return NextResponse.json(
      { error: "Failed to create experiment" },
      { status: 500 }
    );
  }
}

// ── PUT: update an experiment (status, details) ─────────────
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Experiment ID is required" },
        { status: 400 }
      );
    }

    const experiment = await updateExperiment(id, rest);
    return NextResponse.json({ experiment });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Experiments PUT]", error);
    return NextResponse.json(
      { error: "Failed to update experiment" },
      { status: 500 }
    );
  }
}
