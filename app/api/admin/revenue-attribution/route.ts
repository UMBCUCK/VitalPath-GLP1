import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getRevenueByContent,
  getContentROI,
  getChannelROI,
  getMarketingSpendRecommendations,
} from "@/lib/admin-revenue-attribution";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") ?? "content";
  const fromStr = searchParams.get("from");
  const toStr = searchParams.get("to");
  const model = searchParams.get("model") ?? undefined;

  const now = new Date();
  const to = toStr ? new Date(toStr) : now;
  const from = fromStr ? new Date(fromStr) : new Date(to.getTime() - 30 * 86400000);

  try {
    switch (type) {
      case "content": {
        const data = await getRevenueByContent(from, to);
        return NextResponse.json({ data });
      }
      case "channels": {
        const data = await getChannelROI(from, to, model);
        return NextResponse.json({ data });
      }
      case "roi": {
        const data = await getContentROI(from, to);
        return NextResponse.json({ data });
      }
      case "recommendations": {
        const data = await getMarketingSpendRecommendations(from, to);
        return NextResponse.json({ data });
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (err) {
    console.error("[revenue-attribution]", err);
    return NextResponse.json(
      { error: "Failed to fetch attribution data" },
      { status: 500 }
    );
  }
}
