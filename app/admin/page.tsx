import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminDashboardDataV2 } from "@/lib/admin-data";
import { getRecentInsights } from "@/lib/admin-insights";
import { getWidgetLayout } from "@/lib/admin-widgets";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [data, recentInsights, widgetLayout] = await Promise.all([
    getAdminDashboardDataV2(),
    getRecentInsights(3),
    getWidgetLayout(session.userId),
  ]);

  return (
    <DashboardClient
      data={data}
      recentInsights={recentInsights}
      widgetLayout={widgetLayout}
    />
  );
}
