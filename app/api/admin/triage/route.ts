import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { safeError } from "@/lib/logger";
import {
  createTriageAlert,
  getTriageAlerts,
  acknowledgeAlert,
  resolveAlert,
  escalateAlert,
  getTriageMetrics,
  autoDetectTriageNeeds,
} from "@/lib/admin-triage";
import { z } from "zod";

// ── GET: alerts + metrics ─────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const include = url.searchParams.get("include") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const severity = url.searchParams.get("severity") || undefined;
    const status = url.searchParams.get("status") || undefined;

    const result: Record<string, unknown> = {};

    if (include === "metrics") {
      result.metrics = await getTriageMetrics();
    } else {
      const alerts = await getTriageAlerts(page, limit, severity, status);
      result.alerts = alerts.rows;
      result.total = alerts.total;
      result.page = page;
      result.limit = limit;

      if (include.includes("metrics")) {
        result.metrics = await getTriageMetrics();
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    safeError("[triage] GET", error);
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST: create alert or auto-detect ─────────────────────────

const createSchema = z.object({
  action: z.enum(["create", "detect"]),
  patientId: z.string().optional(),
  severity: z.enum(["ROUTINE", "URGENT", "CRITICAL", "EMERGENCY"]).optional(),
  triggerType: z.enum(["SEVERE_SIDE_EFFECT", "MISSED_DOSES", "RAPID_WEIGHT_LOSS", "PSYCHIATRIC", "PATIENT_REQUEST"]).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = createSchema.parse(body);

    if (parsed.action === "detect") {
      const result = await autoDetectTriageNeeds();
      return NextResponse.json(result);
    }

    if (parsed.action === "create") {
      if (!parsed.patientId || !parsed.severity || !parsed.triggerType || !parsed.title || !parsed.description) {
        return NextResponse.json(
          { error: "patientId, severity, triggerType, title, and description are required" },
          { status: 400 }
        );
      }
      const alert = await createTriageAlert({
        patientId: parsed.patientId,
        severity: parsed.severity,
        triggerType: parsed.triggerType,
        title: parsed.title,
        description: parsed.description,
      });
      return NextResponse.json({ alert });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    safeError("[triage] POST", error);
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── PUT: acknowledge/resolve/escalate ─────────────────────────

const updateSchema = z.object({
  action: z.enum(["acknowledge", "resolve", "escalate"]),
  id: z.string().min(1),
  resolution: z.string().optional(),
  toProviderId: z.string().optional(),
  reason: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await req.json();
    const parsed = updateSchema.parse(body);

    if (parsed.action === "acknowledge") {
      const alert = await acknowledgeAlert(parsed.id, session.userId);
      return NextResponse.json({ alert });
    }

    if (parsed.action === "resolve") {
      if (!parsed.resolution) {
        return NextResponse.json({ error: "Resolution required" }, { status: 400 });
      }
      const alert = await resolveAlert(parsed.id, parsed.resolution);
      return NextResponse.json({ alert });
    }

    if (parsed.action === "escalate") {
      if (!parsed.toProviderId || !parsed.reason) {
        return NextResponse.json(
          { error: "toProviderId and reason required" },
          { status: 400 }
        );
      }
      const alert = await escalateAlert(parsed.id, parsed.toProviderId, parsed.reason);
      return NextResponse.json({ alert });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    safeError("[triage] PUT", error);
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
