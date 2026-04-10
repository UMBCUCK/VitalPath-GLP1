import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getThreads,
  createThread,
  getThreadMetrics,
  getMessageTemplates,
} from "@/lib/admin-communications";
import { safeError } from "@/lib/logger";

// ── GET: list threads with filters, or fetch metrics/templates ──

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "metrics") {
      const metrics = await getThreadMetrics();
      return NextResponse.json(metrics);
    }

    if (action === "templates") {
      const templates = getMessageTemplates();
      return NextResponse.json({ templates });
    }

    if (action === "admins") {
      const admins = await db.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
      return NextResponse.json({ admins });
    }

    if (action === "patients") {
      const search = url.searchParams.get("search") || "";
      const patients = await db.user.findMany({
        where: {
          role: "PATIENT",
          ...(search
            ? {
                OR: [
                  { firstName: { contains: search } },
                  { lastName: { contains: search } },
                  { email: { contains: search } },
                ],
              }
            : {}),
        },
        select: { id: true, firstName: true, lastName: true, email: true },
        take: 20,
        orderBy: { firstName: "asc" },
      });
      return NextResponse.json({ patients });
    }

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const status = url.searchParams.get("status") || undefined;
    const assignedTo = url.searchParams.get("assignedTo") || undefined;
    const priority = url.searchParams.get("priority") || undefined;
    const search = url.searchParams.get("search") || undefined;

    const result = await getThreads(page, limit, status, assignedTo, priority, search);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Communications GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

// ── POST: create a new thread ───────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { patientId, subject, message, channel } = body;

    if (!patientId || !subject || !message) {
      return NextResponse.json(
        { error: "patientId, subject, and message are required" },
        { status: 400 }
      );
    }

    const thread = await createThread(
      patientId,
      subject,
      message,
      session.userId,
      channel || "APP"
    );

    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "CREATE",
        entity: "MessageThread",
        entityId: thread.id,
        details: { subject },
      },
    });

    return NextResponse.json({ thread });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Communications POST]", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
