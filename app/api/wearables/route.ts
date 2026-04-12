import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { safeError } from "@/lib/logger";
import {
  connectDevice,
  disconnectDevice,
  getUserDevices,
  ingestDataPoint,
  getUserHealthData,
  type Platform,
  type Metric,
} from "@/lib/wearable-integration";
import { z } from "zod";

const VALID_PLATFORMS: Platform[] = ["APPLE_HEALTH", "GOOGLE_FIT", "FITBIT", "WHOOP", "OURA"];
const VALID_METRICS: Metric[] = ["STEPS", "WEIGHT", "HEART_RATE", "SLEEP_HOURS", "BLOOD_GLUCOSE", "ACTIVE_CALORIES"];

// ── GET: user devices + data ──────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const include = url.searchParams.get("include") || "devices";
    const metric = url.searchParams.get("metric") as Metric | null;
    const days = parseInt(url.searchParams.get("days") || "30", 10);

    const result: Record<string, unknown> = {};

    if (include.includes("devices")) {
      result.devices = await getUserDevices(session.userId);
    }

    if (include.includes("data") && metric && VALID_METRICS.includes(metric)) {
      result.data = await getUserHealthData(session.userId, metric, days);
    }

    return NextResponse.json(result);
  } catch (error) {
    safeError("[wearables] GET", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST: connect device or ingest data ───────────────────────

const connectSchema = z.object({
  action: z.enum(["connect", "ingest"]),
  platform: z.enum(["APPLE_HEALTH", "GOOGLE_FIT", "FITBIT", "WHOOP", "OURA"]).optional(),
  metric: z.enum(["STEPS", "WEIGHT", "HEART_RATE", "SLEEP_HOURS", "BLOOD_GLUCOSE", "ACTIVE_CALORIES"]).optional(),
  value: z.number().optional(),
  unit: z.string().optional(),
  recordedAt: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = connectSchema.parse(body);

    if (parsed.action === "connect") {
      if (!parsed.platform) {
        return NextResponse.json({ error: "Platform required" }, { status: 400 });
      }
      const connection = await connectDevice(session.userId, parsed.platform);
      return NextResponse.json({ connection });
    }

    if (parsed.action === "ingest") {
      if (!parsed.platform || !parsed.metric || parsed.value === undefined) {
        return NextResponse.json(
          { error: "Platform, metric, and value required" },
          { status: 400 }
        );
      }
      const dataPoint = await ingestDataPoint(
        session.userId,
        parsed.platform,
        parsed.metric,
        parsed.value,
        parsed.unit,
        parsed.recordedAt ? new Date(parsed.recordedAt) : undefined
      );
      return NextResponse.json({ dataPoint });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    safeError("[wearables] POST", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── DELETE: disconnect device ─────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const platform = url.searchParams.get("platform") as Platform | null;

    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: "Valid platform required" }, { status: 400 });
    }

    await disconnectDevice(session.userId, platform);
    return NextResponse.json({ success: true });
  } catch (error) {
    safeError("[wearables] DELETE", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
