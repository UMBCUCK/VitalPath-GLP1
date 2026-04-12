import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { safeError, safeLog } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { userId, reason } = await req.json();

    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    // Get full user snapshot before archiving
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        subscriptions: { include: { items: true } },
        orders: { take: 50, orderBy: { createdAt: "desc" } },
        intakeSubmission: true,
        referralCode: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.email.startsWith("ARCHIVED:")) {
      return NextResponse.json({ error: "User is already archived" }, { status: 400 });
    }

    // Cancel all active Stripe subscriptions
    const stripeCancellations: string[] = [];
    for (const sub of user.subscriptions) {
      if (sub.stripeSubscriptionId && sub.status !== "CANCELED") {
        try {
          await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
          stripeCancellations.push(sub.stripeSubscriptionId);
        } catch (err) {
          safeError("[Archive] Stripe cancel error", err);
        }
      }
    }

    // Update all active subscriptions to CANCELED in DB
    await db.subscription.updateMany({
      where: { userId, status: { not: "CANCELED" } },
      data: { status: "CANCELED", canceledAt: new Date(), cancelReason: "Account archived by admin" },
    });

    // Archive the user email (preserves uniqueness, prevents login)
    const archivePrefix = `ARCHIVED:${Date.now()}_`;
    await db.user.update({
      where: { id: userId },
      data: {
        email: `${archivePrefix}${user.email}`,
        passwordHash: null, // remove ability to login
      },
    });

    // Full data snapshot in audit log for recovery
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "user.archived",
        entity: "User",
        entityId: userId,
        details: {
          reason,
          originalEmail: user.email,
          archivePrefix,
          snapshot: {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            createdAt: user.createdAt,
            subscriptionCount: user.subscriptions.length,
            orderCount: user.orders.length,
            stripeCancellations,
          },
        },
      },
    });

    safeLog("[Archive]", `User ${userId} archived by admin ${session.userId}`);
    return NextResponse.json({ success: true, originalEmail: user.email });
  } catch (err) {
    safeError("[Archive] Error", err);
    return NextResponse.json({ error: "Archive failed" }, { status: 500 });
  }
}

// DELETE = restore archived user
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { userId } = await req.json();

    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (!user.email.startsWith("ARCHIVED:")) {
      return NextResponse.json({ error: "User is not archived" }, { status: 400 });
    }

    // Find original email from audit log
    const auditEntry = await db.adminAuditLog.findFirst({
      where: { entityId: userId, action: "user.archived" },
      orderBy: { createdAt: "desc" },
    });

    const originalEmail = (auditEntry?.details as any)?.originalEmail;
    if (!originalEmail) {
      return NextResponse.json({ error: "Cannot find original email to restore" }, { status: 400 });
    }

    // Check if original email is still available
    const existing = await db.user.findUnique({ where: { email: originalEmail } });
    if (existing) {
      return NextResponse.json({ error: "Original email is already in use — manual restore required" }, { status: 409 });
    }

    await db.user.update({
      where: { id: userId },
      data: { email: originalEmail },
    });

    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "user.restored",
        entity: "User",
        entityId: userId,
        details: { restoredEmail: originalEmail },
      },
    });

    return NextResponse.json({ success: true, restoredEmail: originalEmail });
  } catch (err) {
    safeError("[Archive Restore] Error", err);
    return NextResponse.json({ error: "Restore failed" }, { status: 500 });
  }
}
