import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_ACTIONS = [
  "lock",
  "unlock",
  "disable_commission",
  "enable_commission",
  "set_notes",
  "change_status",
  "link_reseller",
  "unlink_reseller",
] as const;

type Action = (typeof VALID_ACTIONS)[number];

const VALID_STATUSES = ["ACTIVE", "PAUSED", "CANCELED"] as const;

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { subscriptionId, action, value } = body as {
      subscriptionId: string;
      action: Action;
      value?: string;
    };

    if (!subscriptionId || !action) {
      return NextResponse.json(
        { error: "subscriptionId and action are required" },
        { status: 400 }
      );
    }

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(", ")}` },
        { status: 400 }
      );
    }

    // Verify subscription exists
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
      select: {
        id: true,
        status: true,
        adminLocked: true,
        adminNotes: true,
        commissionDisabled: true,
        referredByReseller: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    let auditDetails: Record<string, unknown> = {};

    switch (action) {
      case "lock":
        updateData.adminLocked = true;
        auditDetails = { field: "adminLocked", from: subscription.adminLocked, to: true };
        break;

      case "unlock":
        updateData.adminLocked = false;
        auditDetails = { field: "adminLocked", from: subscription.adminLocked, to: false };
        break;

      case "disable_commission":
        updateData.commissionDisabled = true;
        auditDetails = { field: "commissionDisabled", from: subscription.commissionDisabled, to: true };
        break;

      case "enable_commission":
        updateData.commissionDisabled = false;
        auditDetails = { field: "commissionDisabled", from: subscription.commissionDisabled, to: false };
        break;

      case "set_notes":
        updateData.adminNotes = value || null;
        auditDetails = {
          field: "adminNotes",
          from: subscription.adminNotes?.slice(0, 100),
          to: (value || "").slice(0, 100),
        };
        break;

      case "change_status": {
        if (!value || !VALID_STATUSES.includes(value as (typeof VALID_STATUSES)[number])) {
          return NextResponse.json(
            { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
            { status: 400 }
          );
        }
        updateData.status = value;
        if (value === "CANCELED") {
          updateData.canceledAt = new Date();
          updateData.cancelReason = "Admin manual cancellation";
        }
        if (value === "ACTIVE" && subscription.status === "PAUSED") {
          updateData.cancelAt = null;
        }
        auditDetails = { field: "status", from: subscription.status, to: value };
        break;
      }

      case "link_reseller": {
        if (!value) {
          return NextResponse.json(
            { error: "Reseller ID is required for link_reseller action" },
            { status: 400 }
          );
        }
        // Verify reseller exists
        const reseller = await db.resellerProfile.findUnique({
          where: { id: value },
          select: { id: true, displayName: true },
        });
        if (!reseller) {
          return NextResponse.json({ error: "Reseller not found" }, { status: 404 });
        }
        updateData.referredByReseller = value;
        auditDetails = {
          field: "referredByReseller",
          from: subscription.referredByReseller,
          to: value,
          resellerName: reseller.displayName,
        };
        break;
      }

      case "unlink_reseller":
        updateData.referredByReseller = null;
        auditDetails = {
          field: "referredByReseller",
          from: subscription.referredByReseller,
          to: null,
        };
        break;
    }

    // Apply the update
    const updated = await db.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
    });

    // Log to AdminAuditLog
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: `subscription.${action}`,
        entity: "Subscription",
        entityId: subscriptionId,
        details: auditDetails ? JSON.parse(JSON.stringify(auditDetails)) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: updated.id,
        status: updated.status,
        adminLocked: updated.adminLocked,
        adminNotes: updated.adminNotes,
        commissionDisabled: updated.commissionDisabled,
        referredByReseller: updated.referredByReseller,
      },
    });
  } catch (error) {
    console.error("[admin/subscriptions/control]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
