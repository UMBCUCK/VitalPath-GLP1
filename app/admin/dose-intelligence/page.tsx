export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDoseRecommendations, getDoseIntelligenceMetrics } from "@/lib/admin-dose-intelligence";
import { DoseIntelligenceClient } from "./dose-intelligence-client";

export default async function DoseIntelligencePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [recommendations, metrics] = await Promise.all([
    getDoseRecommendations(1, 25),
    getDoseIntelligenceMetrics(),
  ]);

  return (
    <DoseIntelligenceClient
      initialRecommendations={JSON.parse(JSON.stringify(recommendations.rows))}
      initialTotal={recommendations.total}
      metrics={metrics}
    />
  );
}
