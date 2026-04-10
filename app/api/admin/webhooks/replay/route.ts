import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { eventId } = body;

  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  // Fetch the original webhook event
  const event = await db.webhookEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return NextResponse.json({ error: "Webhook event not found" }, { status: 404 });
  }

  if (!event.payload) {
    return NextResponse.json(
      { error: "No payload stored for this event. Cannot replay." },
      { status: 400 }
    );
  }

  // Create a new webhook event to record the replay
  const replayId = `replay_${eventId}_${Date.now()}`;
  try {
    await db.webhookEvent.create({
      data: {
        id: replayId,
        type: event.type,
        success: true,
        payload: event.payload,
        errorMessage: null,
        processedAt: new Date(),
      },
    });

    // Log to AdminAuditLog
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "WEBHOOK_REPLAY",
        entity: "WebhookEvent",
        entityId: eventId,
        details: {
          originalEventId: eventId,
          replayEventId: replayId,
          eventType: event.type,
        },
      },
    });

    return NextResponse.json({
      success: true,
      replayEventId: replayId,
      message: `Webhook event ${eventId} replayed successfully`,
    });
  } catch (error) {
    // If replay fails, record the failure
    await db.webhookEvent.upsert({
      where: { id: replayId },
      update: {
        success: false,
        errorMessage: error instanceof Error ? error.message : "Replay processing failed",
      },
      create: {
        id: replayId,
        type: event.type,
        success: false,
        payload: event.payload,
        errorMessage: error instanceof Error ? error.message : "Replay processing failed",
        processedAt: new Date(),
      },
    });

    return NextResponse.json(
      { error: "Replay failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
