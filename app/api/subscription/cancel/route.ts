import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendLifecycleEmail, cancellationSaveOffer } from "@/lib/services/lifecycle-emails";
import { safeError } from "@/lib/logger";

export async function POST() {
  try {
    const session = await requireAuth();

    const subscription = await db.subscription.findFirst({
      where: { userId: session.userId, status: { in: ["ACTIVE", "TRIALING", "PAUSED"] } },
    });

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELED", canceledAt: new Date() },
    });

    // Send cancellation save offer email
    const user = await db.user.findUnique({ where: { id: session.userId } });
    if (user) {
      const template = cancellationSaveOffer(user.firstName || "there");
      await sendLifecycleEmail(user.email, template, ["cancellation"]);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Cancel API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
