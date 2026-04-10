import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { name, platform, expected } = await req.json();

    if (!name || !platform) {
      return NextResponse.json({ error: "Name and platform required" }, { status: 400 });
    }

    // Check for existing application
    const existing = await db.notification.findFirst({
      where: {
        userId: session.userId,
        type: "OFFER",
        title: "Reseller Application",
      },
    });

    if (existing) {
      return NextResponse.json({ ok: true, alreadyApplied: true });
    }

    // Store the application as a notification (user-facing confirmation)
    await db.notification.create({
      data: {
        userId: session.userId,
        type: "OFFER",
        title: "Reseller Application",
        body: `Application submitted. Platform: ${platform}. Expected referrals: ${expected || "Not specified"}.`,
        link: "/dashboard/referrals",
        metadata: {
          applicationType: "reseller",
          status: "pending",
          name,
          platform,
          expected: expected || null,
          submittedAt: new Date().toISOString(),
        },
      },
    });

    // Notify admin by creating a system message to admin users
    const adminUser = await db.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (adminUser) {
      await db.notification.create({
        data: {
          userId: adminUser.id,
          type: "SYSTEM",
          title: "New Reseller Application",
          body: `${name} applied to the Reseller program. Platform: ${platform}. Expected: ${expected || "—"}.`,
          link: "/admin/customers",
          metadata: {
            applicantUserId: session.userId,
            applicationType: "reseller",
            name,
            platform,
            expected: expected || null,
          },
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Reseller Apply API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// GET — check if user has applied
export async function GET() {
  try {
    const session = await requireAuth();

    const application = await db.notification.findFirst({
      where: {
        userId: session.userId,
        type: "OFFER",
        title: "Reseller Application",
      },
      select: {
        id: true,
        createdAt: true,
        metadata: true,
      },
    });

    return NextResponse.json({
      applied: !!application,
      appliedAt: application?.createdAt || null,
      status: application ? ((application.metadata as Record<string, unknown>)?.status as string ?? "pending") : null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Reseller Status API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
