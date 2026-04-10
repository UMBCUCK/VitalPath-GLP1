import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  computeOverallComplianceScore,
  getComplianceTimeline,
  getComplianceIssues,
  getFDAFTCChecklist,
} from "@/lib/admin-compliance-score";
import { ComplianceDashboardClient } from "./compliance-dashboard-client";

export default async function ComplianceDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [timeline, issues, checklist] = await Promise.all([
    getComplianceTimeline(),
    getComplianceIssues(),
    getFDAFTCChecklist(),
  ]);

  // Get or compute the latest score
  let latestScore = timeline[0] ?? null;
  if (!latestScore) {
    latestScore = await computeOverallComplianceScore();
  }

  const breakdown = (latestScore?.breakdown ?? {
    contentScore: 100,
    claimsScore: 100,
    consentScore: 100,
    credentialScore: 100,
  }) as {
    contentScore: number;
    claimsScore: number;
    consentScore: number;
    credentialScore: number;
  };

  const timelineData = timeline.map((t) => ({
    date: t.computedAt.toISOString().slice(0, 10),
    score: t.score,
  }));

  return (
    <ComplianceDashboardClient
      overallScore={latestScore?.score ?? 0}
      breakdown={breakdown}
      timeline={timelineData}
      issues={issues}
      checklist={checklist}
    />
  );
}
