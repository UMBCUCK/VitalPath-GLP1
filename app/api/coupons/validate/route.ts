import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code, planSlug } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: "This coupon is no longer active" });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "This coupon has expired" });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
    }

    // Check plan applicability
    if (coupon.applicablePlans && planSlug) {
      const plans = JSON.parse(coupon.applicablePlans as string) as string[];
      if (plans.length > 0 && !plans.includes(planSlug)) {
        return NextResponse.json({ valid: false, error: "This coupon doesn't apply to your selected plan" });
      }
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        valueCents: coupon.valueCents,
        valuePct: coupon.valuePct,
        firstMonthOnly: coupon.firstMonthOnly,
      },
    });
  } catch (error) {
    console.error("[Coupon Validate]", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
