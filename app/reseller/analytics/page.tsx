import { redirect } from "next/navigation";
import { getResellerSession } from "@/lib/reseller-auth";
import { getResellerAnalytics } from "@/lib/reseller-data";
import { AnalyticsClient } from "./analytics-client";

export default async function ResellerAnalyticsPage() {
  const session = await getResellerSession();
  if (!session) redirect("/reseller/login");

  const analytics = await getResellerAnalytics(session.resellerId);

  return (
    <AnalyticsClient
      analytics={JSON.parse(JSON.stringify(analytics))}
    />
  );
}
