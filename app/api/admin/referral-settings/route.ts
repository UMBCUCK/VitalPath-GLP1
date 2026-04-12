import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await db.referralSetting.findFirst({ where: { isActive: true } });
    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Referral Settings GET]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { defaultPayoutCents } = await req.json();

    if (!defaultPayoutCents || defaultPayoutCents < 100) {
      return NextResponse.json({ error: "Payout must be at least $1" }, { status: 400 });
    }

    // Upsert: update existing active setting or create one
    const existing = await db.referralSetting.findFirst({ where: { isActive: true } });

    let settings;
    if (existing) {
      settings = await db.referralSetting.update({
        where: { id: existing.id },
        data: { defaultPayoutCents },
      });
    } else {
      settings = await db.referralSetting.create({
        data: { defaultPayoutCents, isActive: true },
      });
    }

    // Audit
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "REFERRAL_SETTINGS_UPDATE",
        entity: "ReferralSetting",
        entityId: settings.id,
        details: { defaultPayoutCents },
      },
    });

    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Referral Settings POST]", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
