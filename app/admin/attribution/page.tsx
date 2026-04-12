export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getAttributionOverview,
  getChannelAttribution,
  getContentAttribution,
  getCampaignAttribution,
  type AttributionModel,
} from "@/lib/admin-attribution";
import { AttributionClient } from "./attribution-client";

interface PageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    model?: string;
  }>;
}

export default async function AttributionPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const now = new Date();
  const from = params.from ? new Date(params.from) : new Date(now.getTime() - 30 * 86400000);
  const to = params.to ? new Date(params.to) : now;
  const model = (params.model || "last_click") as AttributionModel;

  const [overview, channels, content, campaigns] = await Promise.all([
    getAttributionOverview(from, to),
    getChannelAttribution(from, to, model),
    getContentAttribution(from, to),
    getCampaignAttribution(from, to),
  ]);

  // Also get channel attribution for each model for comparison
  const [firstClickChannels, lastClickChannels, linearChannels] = await Promise.all([
    getChannelAttribution(from, to, "first_click"),
    getChannelAttribution(from, to, "last_click"),
    getChannelAttribution(from, to, "linear"),
  ]);

  return (
    <AttributionClient
      overview={overview}
      channels={channels}
      content={content}
      campaigns={campaigns}
      model={model}
      from={from.toISOString().slice(0, 10)}
      to={to.toISOString().slice(0, 10)}
      modelComparison={{
        firstClick: firstClickChannels[0]?.channel || "N/A",
        lastClick: lastClickChannels[0]?.channel || "N/A",
        linear: linearChannels[0]?.channel || "N/A",
        firstClickRevenue: firstClickChannels[0]?.revenue || 0,
        lastClickRevenue: lastClickChannels[0]?.revenue || 0,
        linearRevenue: linearChannels[0]?.revenue || 0,
      }}
    />
  );
}
