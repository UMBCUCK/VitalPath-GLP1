export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getReconciliations,
  getReconciliationSummary,
  getReconciliationTrend,
} from "@/lib/admin-reconciliation";
import { ReconciliationClient } from "./reconciliation-client";

export default async function ReconciliationPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [{ records, total, page, limit }, summary, trend] = await Promise.all([
    getReconciliations(1, 25),
    getReconciliationSummary(),
    getReconciliationTrend(),
  ]);

  return (
    <ReconciliationClient
      initialRecords={JSON.parse(JSON.stringify(records))}
      initialTotal={total}
      initialPage={page}
      initialLimit={limit}
      summary={JSON.parse(JSON.stringify(summary))}
      trendData={trend}
    />
  );
}
