import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();

    const messages = await db.message.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await db.message.count({
      where: { userId: session.userId, isRead: false, direction: "INBOUND" },
    });

    return NextResponse.json({ messages, unreadCount });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { subject, body, threadId } = await req.json();

    if (!body?.trim()) {
      return NextResponse.json({ error: "Message body required" }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        userId: session.userId,
        direction: "OUTBOUND",
        channel: "APP",
        subject: subject || null,
        body: body.trim(),
        threadId: threadId || `thread_${Date.now()}`,
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
