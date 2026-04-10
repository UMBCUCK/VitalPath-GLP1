import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAIReports } from "@/lib/admin-ai-reports";
import { AIReportsClient } from "./ai-reports-client";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AIReportsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const data = await getAIReports(page, 10);

  const serializedReports = data.reports.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <AIReportsClient
      reports={serializedReports}
      total={data.total}
      page={data.page}
      limit={data.limit}
    />
  );
}
