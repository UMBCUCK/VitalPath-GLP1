import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getRetentionInterventions,
  createIntervention,
  respondToIntervention,
  autoTriggerInterventions,
  getRetentionMetrics,
} from "@/lib/admin-retention-engine";
import { safeError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "metrics") {
      const metrics = await getRetentionMetrics();
      return NextResponse.json(metrics);
    }

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "25");
    const status = url.searchParams.get("status") || undefined;
    const type = url.searchParams.get("type") || undefined;

    const data = await getRetentionInterventions(page, limit, status, type);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Retention GET]", error);
    return NextResponse.json({ error: "Failed to fetch interventions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { action } = body;

    if (action === "auto-trigger") {
      const result = await autoTriggerInterventions();
      return NextResponse.json(result);
    }

    // Manual create
    const { userId, type, offerDetails, triggeredBy } = body;
    if (!userId || !type) {
      return NextResponse.json({ error: "userId and type are required" }, { status: 400 });
    }

    const intervention = await createIntervention(
      userId,
      type,
      offerDetails || {},
      triggeredBy || "ADMIN"
    );
    return NextResponse.json({ intervention });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Retention POST]", error);
    return NextResponse.json({ error: "Failed to create intervention" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, accepted } = body;

    if (!id || typeof accepted !== "boolean") {
      return NextResponse.json({ error: "id and accepted (boolean) required" }, { status: 400 });
    }

    const intervention = await respondToIntervention(id, accepted);
    return NextResponse.json({ intervention });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Retention PUT]", error);
    return NextResponse.json({ error: "Failed to update intervention" }, { status: 500 });
  }
}
