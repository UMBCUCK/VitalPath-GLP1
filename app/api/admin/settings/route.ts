import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { defaultPayoutCents, payoutType, payoutCapCents, bonusTiers } = await req.json();

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
    console.error("[Admin Settings API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
