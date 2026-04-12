import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";
import { sendLifecycleEmail, referralInviteReminder } from "@/lib/services/lifecycle-emails";

export async function POST() {
  try {
    const session = await requireAuth();
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingReferrals = await db.referral.findMany({
      where: {
        status: "PENDING",
        referredEmail: { not: null },
        createdAt: { lt: cutoff },
      },
      include: {
        referrer: { select: { firstName: true, lastName: true } },
        referralCode: { select: { code: true } },
      },
      take: 100,
    });

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vitalpath.com";
    let sent = 0;
    let skipped = 0;

    for (const r of pendingReferrals) {
      if (!r.referredEmail) { skipped++; continue; }
      try {
        const referrerName = [r.referrer.firstName, r.referrer.lastName].filter(Boolean).join(" ") || "A friend";
        const referralLink = `${APP_URL}/qualify?ref=${r.referralCode.code}`;
        const template = referralInviteReminder(referrerName, referralLink);
        await sendLifecycleEmail(r.referredEmail, template, ["referral-reminder"]);
        sent++;
      } catch (e) {
        safeError("[Remind] Email failed", e);
        skipped++;
      }
    }

    return NextResponse.json({ sent, skipped });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Remind API]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
