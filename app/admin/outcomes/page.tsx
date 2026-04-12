export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOutcomeReports, getOutcomeSummary } from "@/lib/admin-outcomes";
import { OutcomesClient } from "./outcomes-client";

export default async function OutcomesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const type = params.type ?? undefined;

  const [reportsData, summary] = await Promise.all([
    getOutcomeReports(page, 20, type),
    getOutcomeSummary(),
  ]);

  return (
    <OutcomesClient
      reports={JSON.parse(JSON.stringify(reportsData.reports))}
      total={reportsData.total}
      page={reportsData.page}
      limit={reportsData.limit}
      summary={JSON.parse(JSON.stringify(summary))}
      currentType={type}
    />
  );
}
