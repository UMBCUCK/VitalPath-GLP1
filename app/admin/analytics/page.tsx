import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getFunnelData,
  getAcquisitionAttribution,
  getUpsellPerformance,
} from "@/lib/admin-analytics";
import { AnalyticsClient } from "./analytics-client";

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;

  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(now.getDate() - 30);

  const from = params.from ? new Date(params.from) : defaultFrom;
  const to = params.to ? new Date(params.to) : now;

  const [funnelData, attributionData, upsellData] = await Promise.all([
    getFunnelData(from, to),
    getAcquisitionAttribution(from, to),
    getUpsellPerformance(),
  ]);

  return (
    <AnalyticsClient
      funnelData={funnelData}
      attributionData={attributionData}
      upsellData={upsellData}
      initialFrom={from.toISOString().slice(0, 10)}
      initialTo={to.toISOString().slice(0, 10)}
    />
  );
}
