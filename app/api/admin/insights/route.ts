import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  detectAnomalies,
  detectTrends,
  getInsights,
  dismissInsight,
} from "@/lib/admin-insights";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const type = searchParams.get("type") || undefined;

  const data = await getInsights(page, limit, type);

  return NextResponse.json(data);
}

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [anomalies, trends] = await Promise.all([
      detectAnomalies(),
      detectTrends(),
    ]);

    return NextResponse.json({
      success: true,
      created: anomalies.length + trends.length,
      anomalies: anomalies.length,
      trends: trends.length,
    });
  } catch (error) {
    console.error("Insight detection error:", error);
    return NextResponse.json(
      { error: "Failed to run detection" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.action === "dismiss" && body.id) {
    await dismissInsight(body.id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
