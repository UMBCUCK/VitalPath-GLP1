import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getInsights } from "@/lib/admin-insights";
import { InsightsClient } from "./insights-client";

export default async function AdminInsightsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const data = await getInsights(1, 20);

  return <InsightsClient initialData={data} />;
}
