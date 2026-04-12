export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getResellerComplianceDashboard,
  getResellersRequiringAttention,
  getMarketingReviewQueue,
} from "@/lib/admin-reseller-compliance";
import { ComplianceDashboardClient } from "./compliance-dashboard-client";

export default async function ResellerCompliancePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [stats, attentionList, reviewQueue] = await Promise.all([
    getResellerComplianceDashboard(),
    getResellersRequiringAttention(),
    getMarketingReviewQueue(),
  ]);

  return (
    <ComplianceDashboardClient
      stats={stats}
      attentionList={JSON.parse(JSON.stringify(attentionList))}
      reviewQueue={JSON.parse(JSON.stringify(reviewQueue))}
    />
  );
}
