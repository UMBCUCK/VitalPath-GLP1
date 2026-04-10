import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [alerts, unreadCount] = await Promise.all([
    db.adminAlert.findMany({
      where: { isDismissed: false },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.adminAlert.count({
      where: { isRead: false, isDismissed: false },
    }),
  ]);

  return NextResponse.json({ alerts, unreadCount });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.action === "read-all") {
    await db.adminAlert.updateMany({
      where: { isRead: false, isDismissed: false },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  }

  if (body.action === "dismiss" && body.id) {
    await db.adminAlert.update({
      where: { id: body.id },
      data: { isDismissed: true },
    });
    return NextResponse.json({ success: true });
  }

  if (body.action === "read" && body.id) {
    await db.adminAlert.update({
      where: { id: body.id },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
