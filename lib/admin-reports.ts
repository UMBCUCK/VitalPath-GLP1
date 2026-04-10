import { db } from "@/lib/db";
import { getMRRWaterfall, getRevenueBySegment } from "@/lib/admin-financial";
import { getSubscriptionHealth } from "@/lib/admin-subscriptions";
import { getOperationsMetrics } from "@/lib/admin-operations";

// ── Report template definitions ──────────────────────────────

export interface ReportTemplate {
  key: string;
  name: string;
  description: string;
  sections: string[];
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    key: "MONTHLY_BOARD",
    name: "Monthly Board Deck",
    description: "Executive summary with revenue, subscriptions, patient growth, and churn analysis for board-level reporting.",
    sections: ["revenue_summary", "subscription_health", "patient_growth", "churn_analysis"],
  },
  {
    key: "WEEKLY_OPS",
    name: "Weekly Operations",
    description: "Operational metrics including intake queue, payment health, webhook status, and provider coverage.",
    sections: ["intake_queue", "payment_health", "webhook_status", "provider_coverage"],
  },
  {
    key: "COMPLIANCE_AUDIT",
    name: "Compliance Audit",
    description: "Compliance-focused report covering claims status, adverse events, consent records, and provider credentials.",
    sections: ["claims_status", "adverse_events", "consent_records", "provider_credentials"],
  },
];

// ── Section data types ───────────────────────────────────────

interface ReportSection {
  key: string;
  title: string;
  type: "kpi" | "table" | "summary";
  data: Record<string, unknown>;
}

interface GeneratedReport {
  templateKey: string;
  templateName: string;
  generatedAt: string;
  sections: ReportSection[];
}

// ── Generate report data ─────────────────────────────────────

export async function generateReportData(templateKey: string): Promise<GeneratedReport> {
  const template = REPORT_TEMPLATES.find((t) => t.key === templateKey);
  if (!template) throw new Error(`Unknown report template: ${templateKey}`);

  const sections: ReportSection[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

  for (const sectionKey of template.sections) {
    const section = await generateSection(sectionKey, thirtyDaysAgo, now);
    sections.push(section);
  }

  return {
    templateKey,
    templateName: template.name,
    generatedAt: now.toISOString(),
    sections,
  };
}

async function generateSection(
  sectionKey: string,
  from: Date,
  to: Date
): Promise<ReportSection> {
  switch (sectionKey) {
    // ── Monthly Board sections ─────────────────────────────

    case "revenue_summary": {
      const waterfall = await getMRRWaterfall(from, to);
      const segments = await getRevenueBySegment(from, to);
      return {
        key: "revenue_summary",
        title: "Revenue Summary",
        type: "kpi",
        data: {
          currentMRR: waterfall.currentMRR,
          newMRR: waterfall.newMRR,
          churnedMRR: waterfall.churnedMRR,
          netNewMRR: waterfall.netNewMRR,
          totalRevenue: segments.totalRevenue,
          topPlans: segments.byPlan.slice(0, 5),
        },
      };
    }

    case "subscription_health": {
      const health = await getSubscriptionHealth();
      return {
        key: "subscription_health",
        title: "Subscription Health",
        type: "kpi",
        data: {
          active: health.active,
          trialing: health.trialing,
          pastDue: health.pastDue,
          paused: health.paused,
          canceledRecent: health.canceledRecent,
          newRecent: health.newRecent,
          netGrowth: health.netGrowth,
        },
      };
    }

    case "patient_growth": {
      const [totalPatients, newPatients, activeProfiles] = await Promise.all([
        db.user.count({ where: { role: "PATIENT" } }),
        db.user.count({ where: { role: "PATIENT", createdAt: { gte: from } } }),
        db.patientProfile.count({ where: { userId: { not: undefined } } }),
      ]);

      return {
        key: "patient_growth",
        title: "Patient Growth",
        type: "kpi",
        data: {
          totalPatients,
          newPatients,
          activeProfiles,
          growthRate: totalPatients > 0 ? Math.round((newPatients / totalPatients) * 100 * 10) / 10 : 0,
        },
      };
    }

    case "churn_analysis": {
      const [canceled, atRisk, totalActive] = await Promise.all([
        db.subscription.count({ where: { status: "CANCELED", canceledAt: { gte: from } } }),
        db.patientProfile.count({ where: { churnRisk: { gte: 70 } } }),
        db.subscription.count({ where: { status: { in: ["ACTIVE", "TRIALING"] } } }),
      ]);

      const churnRate = totalActive + canceled > 0
        ? Math.round((canceled / (totalActive + canceled)) * 100 * 10) / 10
        : 0;

      return {
        key: "churn_analysis",
        title: "Churn Analysis",
        type: "kpi",
        data: {
          canceledLast30d: canceled,
          atRiskPatients: atRisk,
          churnRate,
          totalActive,
        },
      };
    }

    // ── Weekly Ops sections ────────────────────────────────

    case "intake_queue": {
      const [pending, submitted, underReview, approved, denied] = await Promise.all([
        db.intakeSubmission.count({ where: { status: "PENDING" } }),
        db.intakeSubmission.count({ where: { status: "SUBMITTED" } }),
        db.intakeSubmission.count({ where: { status: "UNDER_REVIEW" } }),
        db.intakeSubmission.count({ where: { status: "APPROVED", updatedAt: { gte: from } } }),
        db.intakeSubmission.count({ where: { status: "DENIED", updatedAt: { gte: from } } }),
      ]);

      return {
        key: "intake_queue",
        title: "Intake Queue",
        type: "kpi",
        data: {
          pending,
          submitted,
          underReview,
          approvedRecent: approved,
          deniedRecent: denied,
          queueDepth: pending + submitted + underReview,
        },
      };
    }

    case "payment_health": {
      const [successfulOrders, failedOrders, totalRevenue] = await Promise.all([
        db.order.count({ where: { status: "DELIVERED", createdAt: { gte: from } } }),
        db.order.count({ where: { status: { in: ["REFUNDED", "CANCELED"] }, createdAt: { gte: from } } }),
        db.order.aggregate({ where: { createdAt: { gte: from } }, _sum: { totalCents: true } }),
      ]);

      const totalOrders = successfulOrders + failedOrders;
      return {
        key: "payment_health",
        title: "Payment Health",
        type: "kpi",
        data: {
          successfulOrders,
          failedOrders,
          successRate: totalOrders > 0 ? Math.round((successfulOrders / totalOrders) * 100 * 10) / 10 : 100,
          periodRevenue: totalRevenue._sum.totalCents || 0,
        },
      };
    }

    case "webhook_status": {
      const [successCount, failCount] = await Promise.all([
        db.webhookEvent.count({ where: { success: true, processedAt: { gte: from } } }),
        db.webhookEvent.count({ where: { success: false, processedAt: { gte: from } } }),
      ]);

      const totalWebhooks = successCount + failCount;
      return {
        key: "webhook_status",
        title: "Webhook Status",
        type: "kpi",
        data: {
          successCount,
          failCount,
          totalWebhooks,
          successRate: totalWebhooks > 0 ? Math.round((successCount / totalWebhooks) * 100 * 10) / 10 : 100,
        },
      };
    }

    case "provider_coverage": {
      const ops = await getOperationsMetrics();
      return {
        key: "provider_coverage",
        title: "Provider Coverage",
        type: "summary",
        data: {
          coveredStates: ops.providerCoverage.covered,
          totalStates: ops.providerCoverage.total,
          uncoveredStates: ops.providerCoverage.uncoveredStates,
          coverageRate: ops.providerCoverage.total > 0
            ? Math.round((ops.providerCoverage.covered / ops.providerCoverage.total) * 100)
            : 0,
        },
      };
    }

    // ── Compliance Audit sections ──────────────────────────

    case "claims_status": {
      const claimStats = await db.claim.groupBy({
        by: ["status"],
        _count: true,
      });

      const statusMap: Record<string, number> = {};
      let total = 0;
      for (const row of claimStats) {
        statusMap[row.status] = row._count;
        total += row._count;
      }

      return {
        key: "claims_status",
        title: "Claims Status",
        type: "kpi",
        data: {
          total,
          approved: statusMap["APPROVED"] || 0,
          pending: statusMap["PENDING_REVIEW"] || 0,
          rejected: statusMap["REJECTED"] || 0,
          flagged: statusMap["FLAGGED"] || 0,
        },
      };
    }

    case "adverse_events": {
      const [totalEvents, recentEvents, openEvents] = await Promise.all([
        db.adverseEventReport.count(),
        db.adverseEventReport.count({ where: { reportedAt: { gte: from } } }),
        db.adverseEventReport.count({ where: { resolvedAt: null } }),
      ]);

      return {
        key: "adverse_events",
        title: "Adverse Events",
        type: "kpi",
        data: {
          totalEvents,
          recentEvents,
          openEvents,
        },
      };
    }

    case "consent_records": {
      const [totalConsents, recentConsents, consentsByType] = await Promise.all([
        db.consentRecord.count(),
        db.consentRecord.count({ where: { signedAt: { gte: from } } }),
        db.consentRecord.groupBy({ by: ["consentType"], _count: true }),
      ]);

      const byType: Record<string, number> = {};
      for (const row of consentsByType) {
        byType[row.consentType] = row._count;
      }

      return {
        key: "consent_records",
        title: "Consent Records",
        type: "kpi",
        data: {
          totalConsents,
          recentConsents,
          byType,
        },
      };
    }

    case "provider_credentials": {
      const [totalCredentials, activeCredentials, expiringCredentials] = await Promise.all([
        db.providerCredential.count(),
        db.providerCredential.count({ where: { isActive: true } }),
        db.providerCredential.count({
          where: {
            isActive: true,
            expiresAt: { lte: new Date(Date.now() + 30 * 86400000) },
          },
        }),
      ]);

      return {
        key: "provider_credentials",
        title: "Provider Credentials",
        type: "kpi",
        data: {
          totalCredentials,
          activeCredentials,
          expiringSoon: expiringCredentials,
          complianceRate: totalCredentials > 0
            ? Math.round((activeCredentials / totalCredentials) * 100)
            : 100,
        },
      };
    }

    default:
      return {
        key: sectionKey,
        title: sectionKey,
        type: "summary",
        data: { error: "Unknown section" },
      };
  }
}

// ── Report schedule CRUD ─────────────────────────────────────

export async function getReportSchedules(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [schedules, total] = await Promise.all([
    db.reportSchedule.findMany({
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    db.reportSchedule.count(),
  ]);

  return {
    schedules: schedules.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      lastSentAt: s.lastSentAt?.toISOString() || null,
      nextSendAt: s.nextSendAt?.toISOString() || null,
    })),
    total,
    page,
    limit,
  };
}

export async function createReportSchedule(data: {
  name: string;
  templateKey: string;
  frequency: string;
  recipients: string[];
  config?: Record<string, unknown>;
  createdBy: string;
}) {
  // Calculate next send date based on frequency
  const now = new Date();
  let nextSendAt: Date;
  switch (data.frequency) {
    case "DAILY":
      nextSendAt = new Date(now.getTime() + 86400000);
      break;
    case "WEEKLY":
      nextSendAt = new Date(now.getTime() + 7 * 86400000);
      break;
    case "MONTHLY":
      nextSendAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    default:
      nextSendAt = new Date(now.getTime() + 7 * 86400000);
  }

  return db.reportSchedule.create({
    data: {
      name: data.name,
      templateKey: data.templateKey,
      frequency: data.frequency,
      recipients: data.recipients,
      config: data.config ? JSON.parse(JSON.stringify(data.config)) : undefined,
      nextSendAt,
      createdBy: data.createdBy,
    },
  });
}

export async function updateReportSchedule(
  id: string,
  data: {
    name?: string;
    frequency?: string;
    recipients?: string[];
    isActive?: boolean;
    config?: Record<string, unknown>;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.frequency !== undefined) updateData.frequency = data.frequency;
  if (data.recipients !== undefined) updateData.recipients = data.recipients;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.config !== undefined) updateData.config = data.config;

  return db.reportSchedule.update({ where: { id }, data: updateData });
}

export async function deleteReportSchedule(id: string) {
  return db.reportSchedule.delete({ where: { id } });
}
