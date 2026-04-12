import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

// ── GET: Paginated referral list with filters ──────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("q") || undefined;

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") where.status = status;
    if (search) {
      where.OR = [
        { referredEmail: { contains: search } },
        { referrer: { email: { contains: search } } },
        { referrer: { firstName: { contains: search } } },
        { referralCode: { code: { contains: search } } },
      ];
    }

    const [referrals, total, stats] = await Promise.all([
      db.referral.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          referrer: { select: { id: true, firstName: true, lastName: true, email: true } },
          referralCode: { select: { code: true, tier: true } },
        },
      }),
      db.referral.count({ where }),
      db.referral.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    const statusCounts = Object.fromEntries(stats.map((s) => [s.status, s._count]));
    const totalPendingPayout = await db.referral.aggregate({
      where: { status: "CONVERTED" },
      _sum: { payoutCents: true },
    });

    return NextResponse.json({
      referrals: referrals.map((r) => ({
        id: r.id,
        referrerId: r.referrerId,
        referrerName: [r.referrer.firstName, r.referrer.lastName].filter(Boolean).join(" ") || r.referrer.email,
        referrerEmail: r.referrer.email,
        referralCode: r.referralCode.code,
        tier: r.referralCode.tier,
        referredEmail: r.referredEmail,
        status: r.status,
        payoutCents: r.payoutCents,
        paidAt: r.paidAt,
        createdAt: r.createdAt,
      })),
      total,
      page,
      limit,
      statusCounts,
      pendingPayoutCents: totalPendingPayout._sum.payoutCents || 0,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Referrals GET]", error);
    return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
  }
}

// ── PUT: Update referral status ────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { id, action } = body as { id: string; action: "pay" | "cancel" | "flag" | "unconvert" };

    if (!id || !action) {
      return NextResponse.json({ error: "id and action are required" }, { status: 400 });
    }

    const referral = await db.referral.findUnique({
      where: { id },
      include: { referralCode: true },
    });

    if (!referral) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    let updatedReferral;

    switch (action) {
      case "pay": {
        if (referral.status !== "CONVERTED") {
          return NextResponse.json({ error: "Can only pay out CONVERTED referrals" }, { status: 400 });
        }
        updatedReferral = await db.referral.update({
          where: { id },
          data: { status: "PAID", paidAt: new Date() },
        });
        break;
      }

      case "cancel": {
        if (referral.status === "PAID") {
          return NextResponse.json({ error: "Cannot cancel an already-paid referral" }, { status: 400 });
        }
        const wasConverted = referral.status === "CONVERTED";
        updatedReferral = await db.referral.update({
          where: { id },
          data: { status: "EXPIRED" },
        });
        // Reverse the totalEarned increment if the referral was previously counted
        if (wasConverted && referral.payoutCents) {
          await db.referralCode.update({
            where: { id: referral.referralCodeId },
            data: {
              totalReferred: { decrement: 1 },
              totalEarned: { decrement: referral.payoutCents },
            },
          });
        }
        break;
      }

      case "flag": {
        updatedReferral = await db.referral.update({
          where: { id },
          data: { status: "FLAGGED" },
        });
        break;
      }

      case "unconvert": {
        if (referral.status !== "FLAGGED" && referral.status !== "EXPIRED") {
          return NextResponse.json({ error: "Can only restore FLAGGED or EXPIRED referrals" }, { status: 400 });
        }
        updatedReferral = await db.referral.update({
          where: { id },
          data: { status: "CONVERTED" },
        });
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Audit log
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: `REFERRAL_${action.toUpperCase()}`,
        entity: "Referral",
        entityId: id,
        details: { referredEmail: referral.referredEmail, payoutCents: referral.payoutCents },
      },
    });

    return NextResponse.json({ ok: true, referral: updatedReferral });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Referrals PUT]", error);
    return NextResponse.json({ error: "Failed to update referral" }, { status: 500 });
  }
}
