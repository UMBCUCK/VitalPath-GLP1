import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  computeOverallComplianceScore,
  getComplianceTimeline,
  getComplianceIssues,
  getFDAFTCChecklist,
} from "@/lib/admin-compliance-score";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") ?? "score";

  try {
    switch (type) {
      case "score": {
        const timeline = await getComplianceTimeline();
        const latest = timeline[0] ?? null;
        return NextResponse.json({ score: latest, timeline });
      }
      case "timeline": {
        const data = await getComplianceTimeline();
        return NextResponse.json({ data });
      }
      case "issues": {
        const data = await getComplianceIssues();
        return NextResponse.json({ data });
      }
      case "checklist": {
        const data = await getFDAFTCChecklist();
        return NextResponse.json({ data });
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (err) {
    console.error("[compliance-score]", err);
    return NextResponse.json(
      { error: "Failed to fetch compliance data" },
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
    const score = await computeOverallComplianceScore();
    return NextResponse.json({ score });
  } catch (err) {
    console.error("[compliance-score recompute]", err);
    return NextResponse.json(
      { error: "Failed to recompute compliance score" },
      { status: 500 }
    );
  }
}
