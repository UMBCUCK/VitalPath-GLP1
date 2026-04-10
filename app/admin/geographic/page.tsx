import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getStateMetrics,
  getExpansionOpportunities,
} from "@/lib/admin-geographic";
import { GeographicClient } from "./geographic-client";

export default async function GeographicPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [stateMetrics, expansionOpportunities] = await Promise.all([
    getStateMetrics(),
    getExpansionOpportunities(),
  ]);

  return (
    <GeographicClient
      stateMetrics={JSON.parse(JSON.stringify(stateMetrics))}
      expansionOpportunities={JSON.parse(
        JSON.stringify(expansionOpportunities)
      )}
    />
  );
}
