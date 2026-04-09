import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getDashboardData(session.userId);
  return <DashboardClient data={data} />;
}
