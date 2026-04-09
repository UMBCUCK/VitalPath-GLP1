import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { safeError } from "@/lib/logger";

const settingsSchema = z.object({
  defaultPayoutCents: z.number().int().min(0).max(100000).optional(),
  payoutType: z.enum(["CREDIT", "CASH"]).optional(),
  payoutCapCents: z.number().int().min(0).max(1000000).optional().nullable(),
  bonusTiers: z
    .array(
      z.object({
        referrals: z.number().int().min(1),
        bonusCents: z.number().int().min(0),
      })
    )
    .optional(),
});

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { defaultPayoutCents, payoutType, payoutCapCents, bonusTiers } = parsed.data;

    const existing = await db.referralSetting.findFirst({ where: { isActive: true } });

    if (existing) {
      await db.referralSetting.update({
        where: { id: existing.id },
        data: {
          ...(defaultPayoutCents !== undefined && { defaultPayoutCents }),
          ...(payoutType !== undefined && { payoutType }),
          ...(payoutCapCents !== undefined && { payoutCapCents }),
          ...(bonusTiers !== undefined && { bonusTiers }),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Settings API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
