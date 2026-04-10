import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { safeError, safeLog } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { months = 1 } = await req.json().catch(() => ({ months: 1 }));

    const subscription = await db.subscription.findFirst({
      where: { userId: session.userId, status: "ACTIVE" },
    });

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    const pausedUntil = new Date();
    pausedUntil.setMonth(pausedUntil.getMonth() + Math.min(3, months));

    // Pause in Stripe — stops billing while keeping the subscription object
    if (subscription.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          pause_collection: {
            behavior: "void", // Don't generate invoices while paused
            resumes_at: Math.floor(pausedUntil.getTime() / 1000),
          },
        });
        safeLog("[Pause]", "Stripe subscription paused", { months });
      } catch (stripeErr) {
        safeError("[Pause] Stripe pause failed", stripeErr);
      }
    }

    // Update local database
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "PAUSED",
        pausedUntil,
        saveOfferApplied: true,
        saveOfferType: "pause",
      },
    });

    return NextResponse.json({ ok: true, pausedUntil });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Pause API]", error);
    return NextResponse.json({ error: "Failed to pause subscription" }, { status: 500 });
  }
}
