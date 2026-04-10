import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getConversionMetrics,
  getConversionBySegment,
  getSpendEfficiency,
  getConversionSuggestions,
} from "@/lib/admin-conversion";
import { ConversionClient } from "./conversion-client";

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function ConversionPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;

  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setDate(now.getDate() - 30);

  const from = params.from ? new Date(params.from) : defaultFrom;
  const to = params.to ? new Date(params.to) : now;

  const [metrics, segments, spend] = await Promise.all([
    getConversionMetrics(from, to),
    getConversionBySegment(from, to),
    getSpendEfficiency(),
  ]);

  const suggestions = getConversionSuggestions(metrics.stages);

  return (
    <ConversionClient
      metrics={metrics}
      segments={segments}
      spend={spend}
      suggestions={suggestions}
      initialFrom={from.toISOString().slice(0, 10)}
      initialTo={to.toISOString().slice(0, 10)}
    />
  );
}
