import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getThread,
  replyToThread,
  updateThreadStatus,
  assignThread,
  updateThreadPriority,
} from "@/lib/admin-communications";
import { safeError } from "@/lib/logger";

// ── GET: get thread with all messages ───────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    await requireAdmin();
    const { threadId } = await params;

    const thread = await getThread(threadId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    return NextResponse.json(thread);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Thread GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 }
    );
  }
}

// ── POST: reply to thread ───────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const session = await requireAdmin();
    const { threadId } = await params;
    const body = await req.json();
    const { message, channel } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message body is required" },
        { status: 400 }
      );
    }

    const reply = await replyToThread(
      threadId,
      message,
      session.userId,
      channel || "APP"
    );

    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "REPLY",
        entity: "MessageThread",
        entityId: threadId,
        details: { channel: channel || "APP" },
      },
    });

    return NextResponse.json({ message: reply });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Thread POST]", error);
    return NextResponse.json(
      { error: "Failed to reply to thread" },
      { status: 500 }
    );
  }
}

// ── PUT: update thread status, priority, or assignment ──────

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const session = await requireAdmin();
    const { threadId } = await params;
    const body = await req.json();
    const { status, assignedTo, priority } = body;

    let thread;

    if (status) {
      thread = await updateThreadStatus(threadId, status);
      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "STATUS_CHANGE",
          entity: "MessageThread",
          entityId: threadId,
          details: { newStatus: status },
        },
      });
    }

    if (assignedTo !== undefined) {
      thread = await assignThread(threadId, assignedTo);
      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "ASSIGN",
          entity: "MessageThread",
          entityId: threadId,
          details: { assignedTo },
        },
      });
    }

    if (priority) {
      thread = await updateThreadPriority(threadId, priority);
      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "PRIORITY_CHANGE",
          entity: "MessageThread",
          entityId: threadId,
          details: { newPriority: priority },
        },
      });
    }

    return NextResponse.json({ thread: thread ?? { id: threadId } });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Thread PUT]", error);
    return NextResponse.json(
      { error: "Failed to update thread" },
      { status: 500 }
    );
  }
}
