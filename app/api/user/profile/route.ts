import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        subscriptions: {
          where: { status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            status: true,
            currentPeriodEnd: true,
            cancelAt: true,
            items: {
              take: 1,
              select: { product: { select: { name: true } } },
            },
          },
        },
      },
    });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const sub = user.subscriptions[0] ?? null;
    return NextResponse.json({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      phone: user.phone || "",
      subscription: sub ? {
        planName: sub.items[0]?.product?.name ?? "Active Plan",
        status: sub.status,
        currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
        cancelAtPeriodEnd: sub.cancelAt !== null,
      } : null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Profile GET]", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { firstName, lastName, phone } = await req.json();

    await db.user.update({
      where: { id: session.userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Profile API]", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: session.userId }, select: { passwordHash: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (!user.passwordHash) return NextResponse.json({ error: "No password set on this account" }, { status: 400 });

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.user.update({ where: { id: session.userId }, data: { passwordHash: newHash } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Password Change]", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
