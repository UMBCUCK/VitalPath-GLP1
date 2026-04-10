import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

function generateCode(length: number = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "VP-";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET — fetch user's referral data
export async function GET() {
  try {
    const session = await requireAuth();

    let referralCode = await db.referralCode.findUnique({
      where: { userId: session.userId },
      include: {
        referrals: {
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true,
            referredEmail: true,
            status: true,
            payoutCents: true,
            paidAt: true,
            createdAt: true,
          },
        },
      },
    });

    // Auto-create referral code if none exists
    if (!referralCode) {
      referralCode = await db.referralCode.create({
        data: {
          userId: session.userId,
          code: generateCode(),
          tier: "STANDARD",
        },
        include: {
          referrals: { take: 0, select: { id: true, referredEmail: true, status: true, payoutCents: true, paidAt: true, createdAt: true } },
        },
      });
    }

    // Get referral settings for payout info
    const settings = await db.referralSetting.findFirst({ where: { isActive: true } });

    return NextResponse.json({
      code: referralCode.code,
      tier: referralCode.tier,
      totalReferred: referralCode.totalReferred,
      totalEarned: referralCode.totalEarned,
      referrals: referralCode.referrals,
      payoutPerReferral: settings?.defaultPayoutCents || 5000,
      payoutType: settings?.payoutType || "CREDIT",
      bonusTiers: settings?.bonusTiers || [],
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Referrals API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST — send referral invite
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const referralCode = await db.referralCode.findUnique({
      where: { userId: session.userId },
    });

    if (!referralCode) {
      return NextResponse.json({ error: "No referral code" }, { status: 400 });
    }

    // Check for duplicate
    const existing = await db.referral.findFirst({
      where: { referralCodeId: referralCode.id, referredEmail: email },
    });

    if (existing) {
      return NextResponse.json({ error: "Already invited" }, { status: 400 });
    }

    const referral = await db.referral.create({
      data: {
        referralCodeId: referralCode.id,
        referrerId: session.userId,
        referredEmail: email,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, referralId: referral.id });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Referrals API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
