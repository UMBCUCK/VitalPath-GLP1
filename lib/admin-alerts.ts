import { db } from "@/lib/db";

type AlertType =
  | "PAYMENT_FAILED"
  | "CREDENTIAL_EXPIRING"
  | "HIGH_CHURN"
  | "ADVERSE_EVENT"
  | "WEBHOOK_FAILURE"
  | "SUBSCRIPTION_PAST_DUE"
  | "INTAKE_QUEUE_HIGH"
  | "SYSTEM";

type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export async function createAdminAlert(params: {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  body?: string;
  link?: string;
  metadata?: Record<string, unknown>;
}) {
  return db.adminAlert.create({
    data: {
      type: params.type,
      severity: params.severity,
      title: params.title,
      body: params.body,
      link: params.link,
      metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
    },
  });
}

export async function getUnreadAlerts(limit = 20) {
  return db.adminAlert.findMany({
    where: { isDismissed: false },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUnreadAlertCount() {
  return db.adminAlert.count({
    where: { isRead: false, isDismissed: false },
  });
}

export async function markAlertRead(id: string) {
  return db.adminAlert.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function dismissAlert(id: string) {
  return db.adminAlert.update({
    where: { id },
    data: { isDismissed: true },
  });
}
