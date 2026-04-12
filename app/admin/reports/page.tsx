export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getReportSchedules, REPORT_TEMPLATES } from "@/lib/admin-reports";
import { ReportsClient } from "./reports-client";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 20;

  const data = await getReportSchedules(page, limit);

  // Cast Prisma JsonValue fields to the expected client types
  const serializedSchedules = data.schedules.map((s) => ({
    ...s,
    recipients: (s.recipients ?? []) as string[],
    config: (s.config ?? null) as Record<string, unknown> | null,
  }));

  return (
    <ReportsClient
      templates={REPORT_TEMPLATES}
      schedules={serializedSchedules}
      total={data.total}
      page={data.page}
      limit={data.limit}
    />
  );
}
