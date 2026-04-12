export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProviderScorecards, getCredentialAlerts } from "@/lib/admin-provider-scorecards";
import { db } from "@/lib/db";
import { ProviderScorecardsClient } from "./provider-scorecards-client";

export default async function ProviderScorecardsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [scorecards, credentialAlerts, providers] = await Promise.all([
    getProviderScorecards(),
    getCredentialAlerts(),
    db.user.findMany({
      where: { role: "PROVIDER" },
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { lastName: "asc" },
    }),
  ]);

  const serializedProviders = providers.map((p) => ({
    id: p.id,
    name: [p.firstName, p.lastName].filter(Boolean).join(" ") || p.email,
    email: p.email,
  }));

  return (
    <ProviderScorecardsClient
      initialScorecards={scorecards}
      credentialAlerts={credentialAlerts}
      providers={serializedProviders}
    />
  );
}
