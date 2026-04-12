export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOperationsMetrics } from "@/lib/admin-operations";
import { OperationsClient } from "./operations-client";

export default async function OperationsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const metrics = await getOperationsMetrics();

  return <OperationsClient metrics={metrics} />;
}
