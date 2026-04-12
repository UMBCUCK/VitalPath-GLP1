export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getWearableAdminMetrics } from "@/lib/wearable-integration";
import { WearablesClient } from "./wearables-client";

export default async function WearablesAdminPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const metrics = await getWearableAdminMetrics();

  return <WearablesClient metrics={JSON.parse(JSON.stringify(metrics))} />;
}
