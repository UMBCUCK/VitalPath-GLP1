import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProgressData } from "@/lib/dashboard-data";
import { ProgressClient } from "./progress-client";

export default async function ProgressPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getProgressData(session.userId, 90);
  return <ProgressClient data={data} />;
}
