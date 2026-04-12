import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";
import { ReferralTier } from "@prisma/client";

function calcTier(totalReferred: number): ReferralTier {
  if (totalReferred >= 25) return ReferralTier.AMBASSADOR;
  if (totalReferred >= 10) return ReferralTier.GOLD;
  if (totalReferred >= 5) return ReferralTier.SILVER;
  return ReferralTier.STANDARD;
}

export async function POST() {
  try {
    const session = await requireAuth();
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const codes = await db.referralCode.findMany({
      select: { id: true, totalReferred: true, tier: true },
    });

    let updated = 0;
    for (const code of codes) {
      const correctTier = calcTier(code.totalReferred);
      if (code.tier !== correctTier) {
        await db.referralCode.update({
          where: { id: code.id },
          data: { tier: correctTier },
        });
        updated++;
      }
    }

    return NextResponse.json({ updated, total: codes.length });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[RecalcTiers]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
