import { db } from "@/lib/db";

interface SLABreach {
  metric: string;
  current: number;
  threshold: number;
}

interface ProviderCoverage {
  covered: number;
  total: number;
  uncoveredStates: string[];
}

export interface OperationsMetrics {
  intakeAvgHours: number;
  paymentSuccessRate: number;
  webhookSuccessRate: number;
  providerCoverage: ProviderCoverage;
  slaBreaches: SLABreach[];
}

// SLA thresholds
const SLA_INTAKE_HOURS = 24;
const SLA_PAYMENT_RATE = 80;
const SLA_WEBHOOK_RATE = 95;

export async function getOperationsMetrics(): Promise<OperationsMetrics> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    completedIntakes,
    deliveredOrders,
    totalOrders30d,
    webhookSuccess,
    webhookTotal,
    providerStates,
    availableStates,
  ] = await Promise.all([
    // Avg intake review time: IntakeSubmissions where status IN (APPROVED, DENIED)
    db.intakeSubmission.findMany({
      where: { status: { in: ["APPROVED", "DENIED"] } },
      select: { createdAt: true, updatedAt: true },
    }),

    // Payment success rate: DELIVERED orders in last 30 days
    db.order.count({
      where: { status: "DELIVERED", createdAt: { gte: thirtyDaysAgo } },
    }),

    // Total orders in last 30 days
    db.order.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),

    // Webhook success count in last 30 days
    db.webhookEvent.count({
      where: { success: true, processedAt: { gte: thirtyDaysAgo } },
    }),

    // Webhook total count in last 30 days
    db.webhookEvent.count({
      where: { processedAt: { gte: thirtyDaysAgo } },
    }),

    // Provider coverage: distinct active license states
    db.providerCredential.findMany({
      where: { isActive: true },
      select: { licenseState: true },
      distinct: ["licenseState"],
    }),

    // States where service is available
    db.stateAvailability.findMany({
      where: { isAvailable: true },
      select: { stateCode: true, stateName: true },
    }),
  ]);

  // Compute avg intake review time in hours
  let intakeAvgHours = 0;
  if (completedIntakes.length > 0) {
    const totalMs = completedIntakes.reduce((sum, intake) => {
      const diff =
        intake.updatedAt.getTime() - intake.createdAt.getTime();
      return sum + diff;
    }, 0);
    intakeAvgHours = Math.round((totalMs / completedIntakes.length / 3600000) * 10) / 10;
  }

  // Payment success rate
  const paymentSuccessRate =
    totalOrders30d > 0
      ? Math.round((deliveredOrders / totalOrders30d) * 100 * 10) / 10
      : 100;

  // Webhook success rate
  const webhookSuccessRate =
    webhookTotal > 0
      ? Math.round((webhookSuccess / webhookTotal) * 100 * 10) / 10
      : 100;

  // Provider coverage
  const coveredStateCodes = new Set(providerStates.map((p) => p.licenseState));
  const availableStateCodes = availableStates.map((s) => s.stateCode);
  const uncoveredStates = availableStateCodes.filter(
    (code) => !coveredStateCodes.has(code)
  );

  const providerCoverage: ProviderCoverage = {
    covered: coveredStateCodes.size,
    total: availableStates.length,
    uncoveredStates,
  };

  // Check SLA breaches
  const slaBreaches: SLABreach[] = [];

  if (intakeAvgHours > SLA_INTAKE_HOURS) {
    slaBreaches.push({
      metric: "Intake Review Time",
      current: intakeAvgHours,
      threshold: SLA_INTAKE_HOURS,
    });
  }

  if (paymentSuccessRate < SLA_PAYMENT_RATE) {
    slaBreaches.push({
      metric: "Payment Success Rate",
      current: paymentSuccessRate,
      threshold: SLA_PAYMENT_RATE,
    });
  }

  if (webhookSuccessRate < SLA_WEBHOOK_RATE) {
    slaBreaches.push({
      metric: "Webhook Success Rate",
      current: webhookSuccessRate,
      threshold: SLA_WEBHOOK_RATE,
    });
  }

  return {
    intakeAvgHours,
    paymentSuccessRate,
    webhookSuccessRate,
    providerCoverage,
    slaBreaches,
  };
}
