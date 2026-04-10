import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { safeError } from "@/lib/logger";
import {
  getDosageSchedules,
  getDosageAnalytics,
  getMedicationAdherenceCorrelation,
  createDosageSchedule,
  updateDosageSchedule,
} from "@/lib/admin-medication";
import { z } from "zod";

const createSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  treatmentPlanId: z.string().optional(),
  medicationName: z.string().min(1, "Medication name is required"),
  currentDose: z.string().min(1, "Current dose is required"),
  targetDose: z.string().min(1, "Target dose is required"),
  frequency: z.string().min(1, "Frequency is required"),
  escalationPlan: z.array(
    z.object({
      week: z.number(),
      dose: z.string(),
      notes: z.string().optional(),
    })
  ),
  providerNotes: z.string().optional(),
});

const updateSchema = z.object({
  id: z.string().min(1, "Schedule ID is required"),
  currentWeek: z.number().optional(),
  currentDose: z.string().optional(),
  adherenceRate: z.number().min(0).max(100).optional(),
  sideEffects: z
    .array(
      z.object({
        date: z.string(),
        symptom: z.string(),
        severity: z.string(),
      })
    )
    .optional(),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED", "DISCONTINUED"]).optional(),
  nextDoseDate: z.string().optional(),
  lastDoseDate: z.string().optional(),
  providerNotes: z.string().optional(),
});

// ── GET: list schedules + analytics ────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const status = url.searchParams.get("status") || undefined;
    const include = url.searchParams.get("include") || "";

    const result: Record<string, unknown> = {};

    // Always include schedules
    const schedules = await getDosageSchedules(page, limit, status);
    result.schedules = schedules.rows;
    result.total = schedules.total;
    result.page = page;
    result.limit = limit;

    // Optionally include analytics
    if (include.includes("analytics")) {
      result.analytics = await getDosageAnalytics();
    }

    if (include.includes("correlation")) {
      result.correlation = await getMedicationAdherenceCorrelation();
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Medication GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch medication data" },
      { status: 500 }
    );
  }
}

// ── POST: create a dosage schedule ─────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const schedule = await createDosageSchedule(parsed.data);
    return NextResponse.json({ schedule });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Medication POST]", error);
    return NextResponse.json(
      { error: "Failed to create dosage schedule" },
      { status: 500 }
    );
  }
}

// ── PUT: update a dosage schedule ──────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { id, ...updateData } = parsed.data;
    const schedule = await updateDosageSchedule(id, updateData);
    return NextResponse.json({ schedule });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Medication PUT]", error);
    return NextResponse.json(
      { error: "Failed to update dosage schedule" },
      { status: 500 }
    );
  }
}
