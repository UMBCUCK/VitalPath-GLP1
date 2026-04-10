import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { safeError } from "@/lib/logger";

const createSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  type: z.enum(["REACTIVATION", "RECOVERY", "UPGRADE", "RETENTION", "ENGAGEMENT"]),
  trigger: z.string().min(1, "Trigger description is required"),
  offerText: z.string().optional().nullable(),
  couponId: z.string().optional().nullable(),
  emailSubject: z.string().optional().nullable(),
  emailBody: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]).default("DRAFT"),
});

const updateSchema = z.object({
  id: z.string().min(1, "Campaign ID is required"),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  name: z.string().min(1).optional(),
  trigger: z.string().min(1).optional(),
  offerText: z.string().optional().nullable(),
  couponId: z.string().optional().nullable(),
  emailSubject: z.string().optional().nullable(),
  emailBody: z.string().optional().nullable(),
  sentCount: z.number().min(0).optional(),
  openedCount: z.number().min(0).optional(),
  clickedCount: z.number().min(0).optional(),
  convertedCount: z.number().min(0).optional(),
  revenueGenerated: z.number().min(0).optional(),
});

// ── GET: List campaigns ───────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (type && type !== "all") where.type = type;

    const [campaigns, total] = await Promise.all([
      db.campaign.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.campaign.count({ where }),
    ]);

    return NextResponse.json({ campaigns, total, page, limit });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Campaigns GET]", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

// ── POST: Create campaign ─────────────────────────────────────

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

    const campaign = await db.campaign.create({
      data: {
        ...parsed.data,
        startedAt: parsed.data.status === "ACTIVE" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Campaigns POST]", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

// ── PUT: Update campaign status/metrics ───────────────────────

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { id, ...updates } = parsed.data;

    // Track status transitions
    const statusData: Record<string, unknown> = {};
    if (updates.status === "ACTIVE") {
      statusData.startedAt = new Date();
      statusData.pausedAt = null;
    } else if (updates.status === "PAUSED") {
      statusData.pausedAt = new Date();
    }

    const campaign = await db.campaign.update({
      where: { id },
      data: { ...updates, ...statusData },
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Campaigns PUT]", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}
