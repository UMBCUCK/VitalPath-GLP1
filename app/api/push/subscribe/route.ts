import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { subscribeToPush, unsubscribeFromPush } from "@/lib/push-notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const { endpoint, keys, deviceInfo } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Invalid subscription data. Required: endpoint, keys.p256dh, keys.auth" },
        { status: 400 }
      );
    }

    const subscription = await subscribeToPush(
      session.userId,
      { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } },
      deviceInfo
    );

    return NextResponse.json({ ok: true, id: subscription.id });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();

    const { endpoint } = body;
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    await unsubscribeFromPush(endpoint);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Push unsubscribe error:", error);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
