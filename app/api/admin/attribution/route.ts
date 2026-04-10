import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAttributionOverview,
  getChannelAttribution,
  getContentAttribution,
  getCampaignAttribution,
  type AttributionModel,
} from "@/lib/admin-attribution";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const fromStr = searchParams.get("from");
  const toStr = searchParams.get("to");
  const model = (searchParams.get("model") || "last_click") as AttributionModel;

  const now = new Date();
  const from = fromStr ? new Date(fromStr) : new Date(now.getTime() - 30 * 86400000);
  const to = toStr ? new Date(toStr) : now;

  try {
    const [overview, channels, content, campaigns] = await Promise.all([
      getAttributionOverview(from, to),
      getChannelAttribution(from, to, model),
      getContentAttribution(from, to),
      getCampaignAttribution(from, to),
    ]);

    return NextResponse.json({ overview, channels, content, campaigns, model });
  } catch (error) {
    console.error("Attribution API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
