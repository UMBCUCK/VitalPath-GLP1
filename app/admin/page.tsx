import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminDashboardDataV2 } from "@/lib/admin-data";
import { getRecentInsights } from "@/lib/admin-insights";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [data, recentInsights] = await Promise.all([
    getAdminDashboardDataV2(),
    getRecentInsights(3),
  ]);

  return <DashboardClient data={data} recentInsights={recentInsights} />;
}
