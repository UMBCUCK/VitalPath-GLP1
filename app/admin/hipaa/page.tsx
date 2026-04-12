export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getHipaaAuditLog, getDataRequests, getHipaaMetrics } from "@/lib/admin-hipaa";
import { HipaaClient } from "./hipaa-client";

export default async function AdminHipaaPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [auditData, requestsData, metrics] = await Promise.all([
    getHipaaAuditLog(1, 50),
    getDataRequests(1, 25),
    getHipaaMetrics(),
  ]);

  return (
    <HipaaClient
      initialAuditEntries={JSON.parse(JSON.stringify(auditData.entries))}
      initialAuditTotal={auditData.total}
      initialRequests={JSON.parse(JSON.stringify(requestsData.requests))}
      initialRequestsTotal={requestsData.total}
      metrics={metrics}
    />
  );
}
