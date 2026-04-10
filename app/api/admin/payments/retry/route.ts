import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await request.json();
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { subscriptions: { where: { status: "PAST_DUE" }, take: 1 } } } },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const pastDueSub = order.user.subscriptions[0];
  if (pastDueSub?.stripeSubscriptionId) {
    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2026-03-25.dahlia" });
      // Get the latest invoice for this subscription and pay it
      const invoices = await stripe.invoices.list({
        subscription: pastDueSub.stripeSubscriptionId,
        status: "open",
        limit: 1,
      });
      if (invoices.data[0]) {
        await stripe.invoices.pay(invoices.data[0].id);
      }
    } catch (err) {
      console.error("Stripe retry error:", err);
      return NextResponse.json({ error: "Payment retry failed" }, { status: 500 });
    }
  }

  // Log admin action
  await db.adminAuditLog.create({
    data: {
      userId: session.userId,
      action: "PAYMENT_RETRY",
      entity: "Order",
      entityId: orderId,
    },
  });

  return NextResponse.json({ success: true });
}
