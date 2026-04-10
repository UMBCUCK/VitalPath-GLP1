import { db } from "@/lib/db";
import { createAdminAlert } from "@/lib/admin-alerts";

/**
 * Evaluate 6 automatic alert rules and create AdminAlerts when thresholds are breached.
 * Uses a 60-minute cooldown to avoid duplicate alerts.
 * Returns the count of new alerts created.
 */
export async function evaluateAlertRules(): Promise<number> {
  const now = new Date();
  const cooldownCutoff = new Date(now.getTime() - 60 * 60 * 1000); // 60 min ago
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const fourteenDaysAhead = new Date(now.getTime() + 14 * 86400000);

  let newAlerts = 0;

  // Helper: check cooldown for an alert type
  async function hasCooldownAlert(type: string): Promise<boolean> {
    const existing = await db.adminAlert.findFirst({
      where: {
        type,
        isDismissed: false,
        createdAt: { gte: cooldownCutoff },
      },
    });
    return !!existing;
  }

  // ── Rule 1: Churn rate > 5% ──────────────────────────────
  try {
    const [activeSubs, canceledRecent] = await Promise.all([
      db.subscription.count({ where: { status: { in: ["ACTIVE", "TRIALING"] } } }),
      db.subscription.count({ where: { status: "CANCELED", canceledAt: { gte: thirtyDaysAgo } } }),
    ]);
    const totalPool = activeSubs + canceledRecent;
    const churnRate = totalPool > 0 ? (canceledRecent / totalPool) * 100 : 0;

    if (churnRate > 5 && !(await hasCooldownAlert("HIGH_CHURN"))) {
      await createAdminAlert({
        type: "HIGH_CHURN",
        severity: "WARNING",
        title: `Churn rate at ${churnRate.toFixed(1)}% (threshold: 5%)`,
        body: `${canceledRecent} cancellations out of ${totalPool} subscriptions in the last 30 days.`,
        link: "/admin/subscriptions?tab=at_risk",
      });
      newAlerts++;
    }
  } catch {
    // Silently continue on rule failure
  }

  // ── Rule 2: 3+ adverse events in 7 days ──────────────────
  try {
    const adverseCount = await db.adverseEventReport.count({
      where: { reportedAt: { gte: sevenDaysAgo } },
    });

    if (adverseCount >= 3 && !(await hasCooldownAlert("ADVERSE_EVENT"))) {
      await createAdminAlert({
        type: "ADVERSE_EVENT",
        severity: "CRITICAL",
        title: `${adverseCount} adverse events reported in the last 7 days`,
        body: "Review adverse event reports immediately for patient safety.",
        link: "/admin/customers?status=adverse_event",
      });
      newAlerts++;
    }
  } catch {
    // Silently continue
  }

  // ── Rule 3: Provider license expiring in 14 days ─────────
  try {
    const expiringCredentials = await db.providerCredential.count({
      where: {
        isActive: true,
        expiresAt: { lte: fourteenDaysAhead, gt: now },
      },
    });

    if (expiringCredentials > 0 && !(await hasCooldownAlert("CREDENTIAL_EXPIRING"))) {
      await createAdminAlert({
        type: "CREDENTIAL_EXPIRING",
        severity: "WARNING",
        title: `${expiringCredentials} provider license(s) expiring within 14 days`,
        body: "Verify renewal status to avoid service interruption.",
        link: "/admin/settings",
      });
      newAlerts++;
    }
  } catch {
    // Silently continue
  }

  // ── Rule 4: Intake queue > 10 pending ────────────────────
  try {
    const pendingIntakes = await db.intakeSubmission.count({
      where: { status: { in: ["PENDING", "SUBMITTED"] } },
    });

    if (pendingIntakes > 10 && !(await hasCooldownAlert("INTAKE_QUEUE_HIGH"))) {
      await createAdminAlert({
        type: "INTAKE_QUEUE_HIGH",
        severity: "WARNING",
        title: `Intake queue has ${pendingIntakes} pending submissions`,
        body: "Review and process pending intakes to avoid patient wait times.",
        link: "/admin/customers?status=intake_review",
      });
      newAlerts++;
    }
  } catch {
    // Silently continue
  }

  // ── Rule 5: Payment failure rate > 10% ───────────────────
  try {
    const [problemOrders, totalOrders] = await Promise.all([
      db.order.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: { in: ["REFUNDED", "CANCELED"] },
        },
      }),
      db.order.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    const failureRate = totalOrders > 0 ? (problemOrders / totalOrders) * 100 : 0;

    if (failureRate > 10 && !(await hasCooldownAlert("PAYMENT_FAILED"))) {
      await createAdminAlert({
        type: "PAYMENT_FAILED",
        severity: "CRITICAL",
        title: `Payment failure rate at ${failureRate.toFixed(1)}% (threshold: 10%)`,
        body: `${problemOrders} refunded/canceled orders out of ${totalOrders} total in the last 30 days.`,
        link: "/admin/revenue",
      });
      newAlerts++;
    }
  } catch {
    // Silently continue
  }

  // ── Rule 6: MRR dropped > 5% month-over-month ────────────
  try {
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [currentMRRResult, lastMonthMRRResult] = await Promise.all([
      db.subscriptionItem.aggregate({
        where: { subscription: { status: { in: ["ACTIVE", "TRIALING"] } } },
        _sum: { priceInCents: true },
      }),
      // Approximate last month MRR: active subs created before end of last month
      db.subscriptionItem.aggregate({
        where: {
          subscription: {
            createdAt: { lte: lastMonthEnd },
            OR: [
              { status: { in: ["ACTIVE", "TRIALING"] } },
              { canceledAt: { gte: thisMonthStart } },
            ],
          },
        },
        _sum: { priceInCents: true },
      }),
    ]);

    const currentMRR = currentMRRResult._sum.priceInCents || 0;
    const lastMRR = lastMonthMRRResult._sum.priceInCents || 0;

    if (lastMRR > 0) {
      const dropPct = ((lastMRR - currentMRR) / lastMRR) * 100;
      if (dropPct > 5 && !(await hasCooldownAlert("SUBSCRIPTION_PAST_DUE"))) {
        await createAdminAlert({
          type: "SUBSCRIPTION_PAST_DUE",
          severity: "WARNING",
          title: `MRR dropped ${dropPct.toFixed(1)}% month-over-month (threshold: 5%)`,
          body: `MRR went from $${(lastMRR / 100).toFixed(0)} to $${(currentMRR / 100).toFixed(0)}.`,
          link: "/admin/revenue",
        });
        newAlerts++;
      }
    }
  } catch {
    // Silently continue
  }

  return newAlerts;
}
