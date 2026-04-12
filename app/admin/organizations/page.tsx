export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOrganizations, getOrganizationMetrics } from "@/lib/admin-organizations";
import { OrganizationsClient } from "./organizations-client";

export default async function AdminOrganizationsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [orgsData, metrics] = await Promise.all([
    getOrganizations(1, 25),
    getOrganizationMetrics(),
  ]);

  return (
    <OrganizationsClient
      initialOrganizations={JSON.parse(JSON.stringify(orgsData.organizations))}
      initialTotal={orgsData.total}
      metrics={metrics}
    />
  );
}
