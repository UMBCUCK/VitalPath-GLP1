export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getRevenueByContent,
  getContentROI,
  getChannelROI,
  getMarketingSpendRecommendations,
} from "@/lib/admin-revenue-attribution";
import { RevenueAttributionClient } from "./revenue-attribution-client";

export default async function RevenueAttributionPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; model?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const to = params.to ? new Date(params.to) : new Date();
  const from = params.from
    ? new Date(params.from)
    : new Date(to.getTime() - 30 * 86400000);
  const model = params.model ?? undefined;

  const [contentData, contentROI, channelData, recommendations] =
    await Promise.all([
      getRevenueByContent(from, to),
      getContentROI(from, to),
      getChannelROI(from, to, model),
      getMarketingSpendRecommendations(from, to),
    ]);

  // Compute KPIs
  const totalRevenue = contentData.reduce((s, c) => s + c.totalRevenue, 0);
  const totalOrders = contentData.reduce((s, c) => s + c.orderCount, 0);
  const topContent = contentData[0]?.contentPiece ?? "N/A";
  const topChannel = channelData[0]?.channel ?? "N/A";

  return (
    <RevenueAttributionClient
      contentData={contentData}
      contentROI={contentROI}
      channelData={channelData}
      recommendations={recommendations}
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      topContent={topContent}
      topChannel={topChannel}
      initialFrom={from.toISOString().slice(0, 10)}
      initialTo={to.toISOString().slice(0, 10)}
      initialModel={model ?? "all"}
    />
  );
}
