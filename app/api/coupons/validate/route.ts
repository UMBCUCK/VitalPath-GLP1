import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { safeError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Rate limit: 10 coupon validations per minute per IP
  const { success } = await rateLimit(getRateLimitKey(req, "coupon-validate"), {
    maxTokens: 10,
  });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

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
      let plans: string[] = [];
      try {
        plans = JSON.parse(coupon.applicablePlans as string) as string[];
      } catch {
        plans = [];
      }
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
    safeError("[Coupon Validate]", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
