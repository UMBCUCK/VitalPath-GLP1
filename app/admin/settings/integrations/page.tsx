export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { IntegrationsClient } from "./integrations-client";

export default async function AdminIntegrationsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  return <IntegrationsClient />;
}
