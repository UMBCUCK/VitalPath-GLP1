import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminDashboardDataV2 } from "@/lib/admin-data";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const data = await getAdminDashboardDataV2();

  return <DashboardClient data={data} />;
}
