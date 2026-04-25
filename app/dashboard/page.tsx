export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { computeStreak, computeBadges, computeWeeklyProgress } from "@/lib/dashboard-gamification";
import { DashboardClient } from "./dashboard-client";

// Tier 6.2 — upsell suggestions are already fetched inside getDashboardData()
// via lib/upsell-engine.ts#evaluateUpsells. They surface through <UpsellCards />
// in dashboard-client.tsx — the peptide rules added in Tier 3.2 flow through
// automatically once the user clears each rule's condition (e.g. day ≥ 30).

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [data, streak, badges, weeklyProgress] = await Promise.all([
    getDashboardData(session.userId),
    computeStreak(session.userId),
    computeBadges(session.userId),
    computeWeeklyProgress(session.userId),
  ]);

  return (
    <DashboardClient
      data={data}
      streak={streak}
      badges={badges}
      weeklyProgress={weeklyProgress}
    />
  );
}
