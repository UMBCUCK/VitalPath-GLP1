export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAutomationRules } from "@/lib/admin-automations";
import { AutomationsClient } from "./automations-client";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AutomationsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 20;

  const data = await getAutomationRules(page, limit);

  // Cast Prisma JsonValue fields to the expected client types
  const serializedRules = data.rules.map((r) => ({
    ...r,
    conditions: (r.conditions ?? []) as { field: string; operator: string; value: string }[],
    actions: (r.actions ?? []) as { type: string; params: Record<string, string> }[],
  }));

  return (
    <AutomationsClient
      rules={serializedRules}
      total={data.total}
      page={data.page}
      limit={data.limit}
    />
  );
}
