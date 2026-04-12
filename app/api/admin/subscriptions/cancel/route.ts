import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { safeError, safeLog } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { subscriptionId, reason, immediately = false } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: "subscriptionId is required" }, { status: 400 });
    }

    const sub = await db.subscription.findUnique({
      where: { id: subscriptionId },
      select: { id: true, stripeSubscriptionId: true, status: true, userId: true },
    });

    if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    if (sub.status === "CANCELED") return NextResponse.json({ error: "Already canceled" }, { status: 400 });

    // Cancel via Stripe
    if (sub.stripeSubscriptionId) {
      try {
        if (immediately) {
          await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
        } else {
          await stripe.subscriptions.update(sub.stripeSubscriptionId, {
            cancel_at_period_end: true,
          });
        }
      } catch (stripeErr: any) {
        safeError("[Cancel] Stripe error", stripeErr);
        // If not found in Stripe, continue with DB update
        if (stripeErr?.code !== "resource_missing") {
          return NextResponse.json({ error: stripeErr?.message || "Stripe error" }, { status: 500 });
        }
      }
    }

    // Update DB
    const now = new Date();
    await db.subscription.update({
      where: { id: subscriptionId },
      data: immediately
        ? { status: "CANCELED", canceledAt: now, cancelReason: reason || "Admin cancellation" }
        : { cancelAt: sub.status === "ACTIVE" ? undefined : now, cancelReason: reason || "Admin cancellation" },
    });

    // Notification
    await db.notification.create({
      data: {
        userId: sub.userId,
        type: "SYSTEM",
        title: "Subscription canceled",
        body: immediately
          ? "Your subscription has been canceled by an administrator."
          : "Your subscription has been scheduled for cancellation at the end of the current billing period.",
        link: "/dashboard/settings",
      },
    });

    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "subscription.canceled",
        entity: "Subscription",
        entityId: subscriptionId,
        details: { reason, immediately },
      },
    });

    safeLog("[Cancel]", `Subscription ${subscriptionId} canceled by admin`);
    return NextResponse.json({ success: true });
  } catch (err) {
    safeError("[Cancel] Error", err);
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
  }
}
