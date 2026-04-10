import { db } from "@/lib/db";
import { getAdminDashboardDataV2 } from "@/lib/admin-data";
import { getMRRWaterfall, getRevenueBySegment, getCohortLTV } from "@/lib/admin-financial";
import { getSubscriptionHealth } from "@/lib/admin-subscriptions";
import { getFunnelData, getAcquisitionAttribution } from "@/lib/admin-analytics";
import { getChurnRiskDistribution } from "@/lib/admin-churn";
import { getOperationsMetrics } from "@/lib/admin-operations";

// ── Gather full analytics snapshot ────────────────────────────

export async function gatherAnalyticsSnapshot(): Promise<Record<string, unknown>> {
  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 86400000);

  const [
    dashboardKPIs,
    mrrWaterfall,
    revenueSegments,
    cohortLTV,
    subscriptionHealth,
    funnelData,
    acquisitionAttribution,
    churnDistribution,
    operationsMetrics,
  ] = await Promise.all([
    getAdminDashboardDataV2(),
    getMRRWaterfall(ninetyDaysAgo, now),
    getRevenueBySegment(ninetyDaysAgo, now),
    getCohortLTV(),
    getSubscriptionHealth(),
    getFunnelData(ninetyDaysAgo, now),
    getAcquisitionAttribution(ninetyDaysAgo, now),
    getChurnRiskDistribution(),
    getOperationsMetrics(),
  ]);

  return {
    dashboardKPIs,
    mrrWaterfall,
    revenueSegments,
    cohortLTV,
    subscriptionHealth,
    funnelData,
    acquisitionAttribution,
    churnDistribution,
    operationsMetrics,
    generatedAt: now.toISOString(),
  };
}

// ── Report type titles ────────────────────────────────────────

const REPORT_TITLES: Record<string, string> = {
  FULL_ANALYTICS: "Full Analytics Report",
  CONVERSION_OPTIMIZATION: "Conversion Optimization Report",
  SALES_PERFORMANCE: "Sales Performance Report",
  FINANCIAL: "Financial Review Report",
  CUSTOM: "Custom Analytics Report",
};

// ── Build prompt for Claude API ───────────────────────────────

function buildPrompt(reportType: string, snapshot: Record<string, unknown>): string {
  const dataStr = JSON.stringify(snapshot, null, 2);

  const typeInstructions: Record<string, string> = {
    FULL_ANALYTICS: `Provide a comprehensive analysis of ALL metrics including revenue, subscriptions, funnel, churn, and operations. Cover every aspect of the business.`,
    CONVERSION_OPTIMIZATION: `Focus primarily on the conversion funnel data, acquisition attribution, and quiz-to-subscription flow. Identify specific bottlenecks and provide conversion rate optimization strategies.`,
    SALES_PERFORMANCE: `Focus on revenue metrics, MRR waterfall, cohort LTV, revenue segmentation by plan and interval. Analyze sales trends and recommend growth strategies.`,
    FINANCIAL: `Focus on financial health: MRR, churn impact on revenue, LTV/CAC analysis, revenue segments, and refund patterns. Provide financial projections and risk assessment.`,
    CUSTOM: `Provide a balanced analysis of all metrics, highlighting the most notable findings and areas needing immediate attention.`,
  };

  return `You are an expert business analyst for VitalPath, a telehealth weight management platform. Analyze the following analytics data and generate a detailed report.

REPORT TYPE: ${reportType}
FOCUS: ${typeInstructions[reportType] || typeInstructions.CUSTOM}

ANALYTICS DATA:
${dataStr}

Generate a report with the following structure. Use markdown formatting.

## Executive Summary
A 2-3 sentence overview of the business health and most critical findings.

## Key Findings
3-5 numbered findings with data backing each one.

## Revenue Analysis
Analyze MRR trends, revenue segments, and growth trajectory. Reference specific numbers.

## Conversion Funnel Analysis
Identify bottleneck stages, drop-off rates, and optimization opportunities.

## Churn Risk Assessment
Analyze churn distribution, at-risk patients, and retention strategies.

## Operational Efficiency
Review intake processing times, payment success rates, webhook reliability, and provider coverage.

## Prioritized Suggestions
Provide 5-10 specific, actionable suggestions. For each, include:
- A clear title
- Priority level (HIGH, MEDIUM, or LOW)
- Expected impact description
- Specific implementation steps

Format the suggestions section as a JSON array at the end of your response, wrapped in <suggestions> tags:
<suggestions>
[
  {
    "title": "...",
    "priority": "HIGH",
    "impact": "...",
    "description": "..."
  }
]
</suggestions>

## Action Items
Bullet list of immediate next steps with owners/timelines.

Be specific with numbers, percentages, and comparisons. Avoid generic advice.`;
}

// ── Generate AI Report ────────────────────────────────────────

export async function generateAIReport(
  reportType: string,
  adminId: string
): Promise<{
  id: string;
  title: string;
  reportType: string;
  content: string;
  summary: string | null;
  suggestions: unknown;
  dataSnapshot: unknown;
  tokenUsage: number | null;
  generatedBy: string;
  createdAt: Date;
}> {
  // Gather snapshot
  const snapshot = await gatherAnalyticsSnapshot();

  // Build prompt
  const prompt = buildPrompt(reportType, snapshot);

  // Call Claude API
  let content = "";
  let tokenUsage: number | null = null;

  try {
    // Dynamic import — only works if @anthropic-ai/sdk is installed
    const mod = await import("@anthropic-ai/sdk" as string);
    const Anthropic = mod.default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract text content
    for (const block of message.content) {
      if (block.type === "text") {
        content += block.text;
      }
    }

    tokenUsage = (message.usage?.input_tokens || 0) + (message.usage?.output_tokens || 0);
  } catch (error) {
    // Fallback: generate a basic report from the data
    console.error("[AI Report] Claude API error, generating fallback:", error);
    content = generateFallbackReport(reportType, snapshot);
    tokenUsage = 0;
  }

  // Parse suggestions from content
  let suggestions: unknown[] = [];
  const suggestionsMatch = content.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
  if (suggestionsMatch) {
    try {
      suggestions = JSON.parse(suggestionsMatch[1]);
    } catch {
      suggestions = [];
    }
    // Remove the raw suggestions tags from content for cleaner display
    content = content.replace(/<suggestions>[\s\S]*?<\/suggestions>/, "").trim();
  }

  // Extract executive summary (first section after ## Executive Summary)
  let summary: string | null = null;
  const summaryMatch = content.match(/## Executive Summary\s*\n([\s\S]*?)(?=\n##|\n<|$)/);
  if (summaryMatch) {
    summary = summaryMatch[1].trim().slice(0, 500);
  }

  const title = REPORT_TITLES[reportType] || "Analytics Report";

  // Save to database
  const report = await db.aIReport.create({
    data: {
      title,
      reportType,
      content,
      summary,
      suggestions: suggestions as never,
      dataSnapshot: snapshot as never,
      tokenUsage,
      generatedBy: adminId,
    },
  });

  return report;
}

// ── Fallback report when API is unavailable ───────────────────

function generateFallbackReport(reportType: string, snapshot: Record<string, unknown>): string {
  const kpis = snapshot.dashboardKPIs as Record<string, unknown> | undefined;
  const kpiData = kpis?.kpis as Record<string, Record<string, unknown>> | undefined;
  const mrr = snapshot.mrrWaterfall as Record<string, number> | undefined;
  const subHealth = snapshot.subscriptionHealth as Record<string, number> | undefined;
  const funnel = snapshot.funnelData as Array<{ stage: string; count: number; conversionRate: number }> | undefined;
  const ops = snapshot.operationsMetrics as Record<string, unknown> | undefined;

  return `## Executive Summary
This ${reportType.toLowerCase().replace(/_/g, " ")} was generated from current platform data. The API key for AI analysis was not configured, so this is a data summary.

## Key Findings
1. **MRR**: Current MRR is $${((mrr?.currentMRR || 0) / 100).toLocaleString()} with net new MRR of $${((mrr?.netNewMRR || 0) / 100).toLocaleString()}
2. **Active Members**: ${kpiData?.activeMembers?.value || 0} active subscribers
3. **Churn Rate**: ${kpiData?.churnRate?.value || 0}% monthly churn
4. **New Patients**: ${kpiData?.newPatients?.value || 0} new patients in the last 30 days

## Revenue Analysis
- Current MRR: $${((mrr?.currentMRR || 0) / 100).toLocaleString()}
- New MRR: $${((mrr?.newMRR || 0) / 100).toLocaleString()}
- Churned MRR: $${((mrr?.churnedMRR || 0) / 100).toLocaleString()}

## Conversion Funnel Analysis
${funnel?.map((s) => `- ${s.stage}: ${s.count} (${s.conversionRate}% conversion)`).join("\n") || "No funnel data available."}

## Churn Risk Assessment
- Active: ${subHealth?.active || 0}
- Trialing: ${subHealth?.trialing || 0}
- Past Due: ${subHealth?.pastDue || 0}
- Recently Canceled: ${subHealth?.canceledRecent || 0}

## Operational Efficiency
- Intake Avg Review: ${(ops?.intakeAvgHours as number) || 0} hours
- Payment Success Rate: ${(ops?.paymentSuccessRate as number) || 0}%
- Webhook Success Rate: ${(ops?.webhookSuccessRate as number) || 0}%

## Action Items
- Configure ANTHROPIC_API_KEY environment variable for AI-powered analysis
- Review current metrics and identify areas for improvement

<suggestions>
[
  {
    "title": "Configure AI API Key",
    "priority": "HIGH",
    "impact": "Enable full AI-powered analytics reports",
    "description": "Set ANTHROPIC_API_KEY in your environment to unlock comprehensive AI analysis."
  }
]
</suggestions>`;
}

// ── List previous reports ─────────────────────────────────────

export async function getAIReports(page = 1, limit = 10) {
  const [reports, total] = await Promise.all([
    db.aIReport.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        reportType: true,
        summary: true,
        tokenUsage: true,
        generatedBy: true,
        createdAt: true,
      },
    }),
    db.aIReport.count(),
  ]);

  return { reports, total, page, limit };
}

// ── Get single report ─────────────────────────────────────────

export async function getAIReport(id: string) {
  return db.aIReport.findUnique({
    where: { id },
  });
}
