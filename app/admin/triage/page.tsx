export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTriageAlerts, getTriageMetrics } from "@/lib/admin-triage";
import { TriageClient } from "./triage-client";

export default async function TriagePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [alerts, metrics] = await Promise.all([
    getTriageAlerts(1, 50),
    getTriageMetrics(),
  ]);

  return (
    <TriageClient
      initialAlerts={JSON.parse(JSON.stringify(alerts.rows))}
      initialTotal={alerts.total}
      metrics={metrics}
    />
  );
}
