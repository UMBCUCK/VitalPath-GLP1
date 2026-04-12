export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getRetentionInterventions, getRetentionMetrics } from "@/lib/admin-retention-engine";
import { RetentionEngineClient } from "./retention-engine-client";

export default async function AdminRetentionEnginePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [interventionsData, metrics] = await Promise.all([
    getRetentionInterventions(1, 25),
    getRetentionMetrics(),
  ]);

  return (
    <RetentionEngineClient
      initialInterventions={JSON.parse(JSON.stringify(interventionsData.interventions))}
      initialTotal={interventionsData.total}
      metrics={metrics}
    />
  );
}
