import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getRecommendationAnalytics,
  getContentPerformance,
} from "@/lib/admin-content-recommendations";
import { ContentIntelligenceClient } from "./content-intelligence-client";

export default async function ContentIntelligencePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [analytics, performance] = await Promise.all([
    getRecommendationAnalytics(),
    getContentPerformance(),
  ]);

  return (
    <ContentIntelligenceClient
      analytics={JSON.parse(JSON.stringify(analytics))}
      performance={JSON.parse(JSON.stringify(performance))}
    />
  );
}
