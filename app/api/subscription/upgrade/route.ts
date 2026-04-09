import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

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

    // Update the subscription item to the new plan
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
    console.error("[Upgrade API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
