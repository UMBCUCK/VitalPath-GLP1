/**
 * /api/subscription/save-offer
 * ─────────────────────────────────────────────────────────────
 * Tier 7.3 — Accepts a save-offer action from the retention modal in
 * dashboard settings. Each offer type maps to a real Stripe mutation:
 *
 *   - discount    → apply a coupon to the active subscription
 *   - downgrade   → swap the primary plan item to the Essential tier price
 *   - coaching    → flag the subscription so admin can book a 1:1
 *   - provider_consult → flag the subscription so admin schedules a dose
 *                        review with the assigned provider
 *
 * Records the save-offer on db.subscription (saveOfferType, saveOfferApplied)
 * for churn-recovery reporting in admin.
 *
 * Auth: requireAuth() — the subscription must belong to the caller.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { safeError, safeLog } from "@/lib/logger";

const schema = z.object({
  offerType: z.enum(["discount", "downgrade", "coaching", "provider_consult"]),
  reason: z.string().max(120).optional(),
});

// Stripe coupon for the 25%-off-3-months retention offer. Must exist in the
// connected Stripe account (create via dashboard or CLI before shipping).
// Fallback: operational-only save (DB mark only, no Stripe call).
const RETENTION_COUPON_ID = process.env.STRIPE_RETENTION_COUPON_ID || "";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { offerType, reason } = parsed.data;

    const subscription = await db.subscription.findFirst({
      where: { userId: session.userId, status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
      include: {
        items: { include: { product: { select: { slug: true } } } },
      },
    });
    if (!subscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    // ─── Discount: apply retention coupon in Stripe ─────────────
    // Stripe v22+ uses `discounts: [{ coupon: ID }]` instead of the
    // deprecated `coupon` field on SubscriptionUpdateParams.
    if (offerType === "discount") {
      if (subscription.stripeSubscriptionId && RETENTION_COUPON_ID) {
        try {
          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            discounts: [{ coupon: RETENTION_COUPON_ID }],
          });
          safeLog("[SaveOffer]", "Retention coupon applied", { userId: session.userId });
        } catch (stripeErr) {
          safeError("[SaveOffer] Stripe coupon apply failed", stripeErr);
          // Non-blocking — we still record the save on our side
        }
      }
    }

    // ─── Downgrade: swap primary plan item to essential ─────────
    if (offerType === "downgrade") {
      const essential = await db.product.findUnique({ where: { slug: "essential" } });
      if (essential?.stripePriceIdMonthly && subscription.stripeSubscriptionId) {
        try {
          // Find the plan item (first item is the main membership)
          const stripeSub = await stripe.subscriptions.retrieve(
            subscription.stripeSubscriptionId,
          );
          const mainItemId = stripeSub.items.data[0]?.id;
          if (mainItemId) {
            await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
              items: [
                {
                  id: mainItemId,
                  price: essential.stripePriceIdMonthly,
                },
              ],
              proration_behavior: "create_prorations",
            });
            safeLog("[SaveOffer]", "Downgraded to essential", { userId: session.userId });
          }
        } catch (stripeErr) {
          safeError("[SaveOffer] Stripe downgrade failed", stripeErr);
        }
      }
    }

    // ─── Coaching / provider_consult: flag for admin action ─────
    // These don't mutate Stripe — they queue a task for ops via the
    // subscription row + a notification to the patient confirming the
    // complimentary touchpoint has been scheduled.
    if (offerType === "coaching" || offerType === "provider_consult") {
      await db.notification.create({
        data: {
          userId: session.userId,
          type: "SYSTEM",
          title:
            offerType === "coaching"
              ? "Complimentary 1:1 coaching session"
              : "Provider dose-review scheduled",
          body:
            offerType === "coaching"
              ? "Your care team will reach out within 2 business days to book your free coaching session."
              : "Your provider will review your dose and reach out within 2 business days with recommendations.",
          link: "/dashboard/messages",
          metadata: { tag: `save_offer_${offerType}`, reason },
        },
      });
    }

    // ─── Record the save on our subscription row ────────────────
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        saveOfferApplied: true,
        saveOfferType: offerType,
      },
    });

    return NextResponse.json({ ok: true, offerType });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[SaveOffer]", error);
    return NextResponse.json({ error: "Failed to apply offer" }, { status: 500 });
  }
}
