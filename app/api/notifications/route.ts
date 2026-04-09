import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();

    const notifications = await db.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await db.notification.count({
      where: { userId: session.userId, isRead: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { ids } = await req.json();

    if (ids === "all") {
      await db.notification.updateMany({
        where: { userId: session.userId, isRead: false },
        data: { isRead: true },
      });
    } else if (Array.isArray(ids)) {
      await db.notification.updateMany({
        where: { id: { in: ids }, userId: session.userId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
