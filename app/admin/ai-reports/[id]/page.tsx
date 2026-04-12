export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAIReport } from "@/lib/admin-ai-reports";
import { ReportDetailClient } from "./report-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AIReportDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const { id } = await params;
  const report = await getAIReport(id);

  if (!report) redirect("/admin/ai-reports");

  return (
    <ReportDetailClient
      report={{
        id: report.id,
        title: report.title,
        reportType: report.reportType,
        content: report.content,
        summary: report.summary,
        suggestions: report.suggestions as Array<{
          title: string;
          priority: string;
          impact: string;
          description: string;
        }> | null,
        dataSnapshot: report.dataSnapshot as Record<string, unknown> | null,
        tokenUsage: report.tokenUsage,
        generatedBy: report.generatedBy,
        createdAt: report.createdAt.toISOString(),
      }}
    />
  );
}
