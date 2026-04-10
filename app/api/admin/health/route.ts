import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  runHealthChecks,
  getHealthHistory,
  getErrorLogs,
  getErrorStats,
  getPerformanceMetrics,
} from "@/lib/admin-health-monitor";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") ?? "history";

  try {
    switch (type) {
      case "history": {
        const service = searchParams.get("service") ?? undefined;
        const hours = Number(searchParams.get("hours")) || 24;
        const data = await getHealthHistory(service, hours);
        return NextResponse.json({ data });
      }
      case "errors": {
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 25;
        const route = searchParams.get("route") ?? undefined;
        const statusCode = searchParams.get("statusCode")
          ? Number(searchParams.get("statusCode"))
          : undefined;
        const from = searchParams.get("from")
          ? new Date(searchParams.get("from")!)
          : undefined;
        const to = searchParams.get("to")
          ? new Date(searchParams.get("to")!)
          : undefined;
        const data = await getErrorLogs({ page, limit, route, statusCode, from, to });
        return NextResponse.json(data);
      }
      case "stats": {
        const from = searchParams.get("from")
          ? new Date(searchParams.get("from")!)
          : undefined;
        const to = searchParams.get("to")
          ? new Date(searchParams.get("to")!)
          : undefined;
        const data = await getErrorStats(from, to);
        return NextResponse.json({ data });
      }
      case "performance": {
        const data = await getPerformanceMetrics();
        return NextResponse.json({ data });
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (err) {
    console.error("[health]", err);
    return NextResponse.json(
      { error: "Failed to fetch health data" },
      { status: 500 }
    );
  }
}

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const checks = await runHealthChecks();
    return NextResponse.json({ checks });
  } catch (err) {
    console.error("[health run-checks]", err);
    return NextResponse.json(
      { error: "Failed to run health checks" },
      { status: 500 }
    );
  }
}
