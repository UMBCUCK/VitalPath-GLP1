export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getScreenings, getReferrals, getBehavioralMetrics } from "@/lib/admin-behavioral-health";
import { BehavioralHealthClient } from "./behavioral-health-client";

export default async function AdminBehavioralHealthPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [screeningsData, referralsData, metrics] = await Promise.all([
    getScreenings(1, 25),
    getReferrals(1, 25),
    getBehavioralMetrics(),
  ]);

  return (
    <BehavioralHealthClient
      initialScreenings={JSON.parse(JSON.stringify(screeningsData.screenings))}
      initialScreeningsTotal={screeningsData.total}
      initialReferrals={JSON.parse(JSON.stringify(referralsData.referrals))}
      initialReferralsTotal={referralsData.total}
      metrics={metrics}
    />
  );
}
