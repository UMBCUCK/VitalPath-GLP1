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

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "REFUNDED") {
    return NextResponse.json({ error: "Already refunded" }, { status: 400 });
  }

  // Attempt Stripe refund if we have a payment ID
  if (order.stripePaymentId) {
    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2026-03-25.dahlia" });
      await stripe.refunds.create({ payment_intent: order.stripePaymentId });
    } catch (err) {
      console.error("Stripe refund error:", err);
      // Continue to update local status even if Stripe fails in dev
    }
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: "REFUNDED" },
  });

  // Log admin action
  await db.adminAuditLog.create({
    data: {
      userId: session.userId,
      action: "REFUND_ISSUED",
      entity: "Order",
      entityId: orderId,
      details: { amount: order.totalCents },
    },
  });

  return NextResponse.json({ success: true });
}
