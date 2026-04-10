import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { safeError } from "@/lib/logger";

const claimSchema = z.object({
  text: z.string().min(1, "Claim text is required"),
  category: z.enum([
    "STUDY_TETHERED_NUMERIC",
    "NON_NUMERIC_SUPPORT",
    "OPERATIONAL_TRUST",
    "LIFESTYLE_ADHERENCE",
    "TESTIMONIAL_RESULTS",
    "SUPPLEMENT_SUPPORT",
  ]),
  status: z
    .enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "REJECTED", "RETIRED"])
    .default("DRAFT"),
  allowedChannels: z.array(z.string()).default([]),
  disclosureText: z.string().optional().nullable(),
  citationSource: z.string().optional().nullable(),
  citationUrl: z.string().optional().nullable(),
  numericClaim: z.boolean().default(false),
  requiresFootnote: z.boolean().default(false),
  requiresModal: z.boolean().default(false),
  requiresLegalReview: z.boolean().default(false),
  requiresMedicalReview: z.boolean().default(false),
  stateRestrictions: z.array(z.string()).optional().nullable(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("LOW"),
  riskNotes: z.string().optional().nullable(),
  reviewNotes: z.string().optional().nullable(),
});

// ── GET: list claims with optional filters and pagination ────
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const search = url.searchParams.get("search") || "";

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (category && category !== "all") {
      where.category = category;
    }
    if (search) {
      where.text = { contains: search };
    }

    const [claims, total] = await Promise.all([
      db.claim.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.claim.count({ where }),
    ]);

    return NextResponse.json({ claims, total, page, limit });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Claims GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}

// ── POST: create a new claim ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const parsed = claimSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const claim = await db.claim.create({
      data: {
        ...parsed.data,
        allowedChannels: parsed.data.allowedChannels,
        stateRestrictions: parsed.data.stateRestrictions || [],
      },
    });

    // Audit log
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "CREATE",
        entity: "Claim",
        entityId: claim.id,
        details: { text: parsed.data.text.slice(0, 80) },
      },
    });

    return NextResponse.json({ claim });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Claims POST]", error);
    return NextResponse.json(
      { error: "Failed to create claim" },
      { status: 500 }
    );
  }
}

// ── PUT: update a claim (edit fields or change status) ──────
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Claim ID required" },
        { status: 400 }
      );
    }

    const parsed = claimSchema.partial().safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { ...parsed.data };

    // If status is being set to APPROVED, record who approved and when
    if (parsed.data.status === "APPROVED") {
      updateData.approvedBy = session.email;
      updateData.approvedAt = new Date();
    }

    // If status is being set to REJECTED, clear approval info
    if (parsed.data.status === "REJECTED") {
      updateData.approvedBy = null;
      updateData.approvedAt = null;
    }

    const claim = await db.claim.update({
      where: { id },
      data: updateData,
    });

    // Audit log
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: parsed.data.status
          ? `STATUS_${parsed.data.status}`
          : "UPDATE",
        entity: "Claim",
        entityId: id,
        details: parsed.data.status
          ? { newStatus: parsed.data.status }
          : { fieldsUpdated: Object.keys(parsed.data) },
      },
    });

    return NextResponse.json({ claim });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Claims PUT]", error);
    return NextResponse.json(
      { error: "Failed to update claim" },
      { status: 500 }
    );
  }
}
