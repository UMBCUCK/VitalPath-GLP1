import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  generateOutcomeReport,
  getOutcomeReports,
  approveForPublishing,
  getOutcomeSummary,
} from "@/lib/admin-outcomes";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.searchParams;
  const type = url.get("type") ?? undefined;
  const page = parseInt(url.get("page") ?? "1");
  const limit = parseInt(url.get("limit") ?? "20");
  const summary = url.get("summary") === "true";

  if (summary) {
    const data = await getOutcomeSummary();
    return NextResponse.json(data);
  }

  const data = await getOutcomeReports(page, limit, type);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { reportType, periodStart, periodEnd } = body;

  if (!reportType || !periodStart || !periodEnd) {
    return NextResponse.json(
      { error: "Missing required fields: reportType, periodStart, periodEnd" },
      { status: 400 }
    );
  }

  const report = await generateOutcomeReport(
    reportType,
    new Date(periodStart),
    new Date(periodEnd),
    session.userId
  );

  return NextResponse.json(report, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
  }

  const report = await approveForPublishing(id, session.userId);
  return NextResponse.json(report);
}
