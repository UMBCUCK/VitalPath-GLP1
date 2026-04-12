export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSalesOverview, getSalesPerformance, getSalesTrend } from "@/lib/admin-sales";
import { SalesClient } from "./sales-client";

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function SalesPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;

  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(now.getDate() - 30);

  const from = params.from ? new Date(params.from) : defaultFrom;
  const to = params.to ? new Date(params.to) : now;

  const [overview, performance, trend] = await Promise.all([
    getSalesOverview(from, to),
    getSalesPerformance(from, to),
    getSalesTrend(30),
  ]);

  return (
    <SalesClient
      overview={overview}
      performance={performance}
      trend={trend}
      initialFrom={from.toISOString().slice(0, 10)}
      initialTo={to.toISOString().slice(0, 10)}
    />
  );
}
