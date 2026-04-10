import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { safeError, safeLog } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { targetPlanSlug } = await req.json();

    if (!targetPlanSlug) {
      return NextResponse.json({ error: "Target plan required" }, { status: 400 });
    }

    const targetProduct = await db.product.findUnique({ where: { slug: targetPlanSlug } });
    if (!targetProduct || targetProduct.type !== "MEMBERSHIP") {
      return NextResponse.json({ error: "Invalid target plan" }, { status: 400 });
    }

    const subscription = await db.subscription.findFirst({
      where: { userId: session.userId, status: "ACTIVE" },
      include: { items: { include: { product: true } } },
    });

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    // Upgrade in Stripe — swap the price on the subscription with proration
    if (subscription.stripeSubscriptionId && targetProduct.stripePriceIdMonthly) {
      try {
        const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
        const currentItem = stripeSub.items.data[0];

        if (currentItem) {
          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            items: [{
              id: currentItem.id,
              price: targetProduct.stripePriceIdMonthly,
            }],
            proration_behavior: "create_prorations", // Customer gets credit for unused time
          });
          safeLog("[Upgrade]", "Stripe subscription upgraded with proration", {
            from: subscription.items[0]?.product?.name || "unknown",
            to: targetProduct.name,
          });
        }
      } catch (stripeErr) {
        safeError("[Upgrade] Stripe upgrade failed", stripeErr);
        return NextResponse.json({ error: "Failed to upgrade payment. Please try again." }, { status: 500 });
      }
    }

    // Update local database
    const currentItem = subscription.items[0];
    if (currentItem) {
      await db.subscriptionItem.update({
        where: { id: currentItem.id },
        data: { productId: targetProduct.id, priceInCents: targetProduct.priceMonthly },
      });
    }

    // Create notification
    await db.notification.create({
      data: {
        userId: session.userId,
        type: "SYSTEM",
        title: `Upgraded to ${targetProduct.name}`,
        body: `Your plan has been upgraded to ${targetProduct.name}. New features are now available in your dashboard.`,
        link: "/dashboard",
      },
    });

    return NextResponse.json({ ok: true, newPlan: targetProduct.name });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Upgrade API]", error);
    return NextResponse.json({ error: "Failed to upgrade plan" }, { status: 500 });
  }
}
