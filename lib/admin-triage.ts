import { db } from "@/lib/db";

// ── Create Triage Alert ────────────────────────────────────────

export async function createTriageAlert(data: {
  patientId: string;
  providerId?: string;
  severity: "ROUTINE" | "URGENT" | "CRITICAL" | "EMERGENCY";
  triggerType: "SEVERE_SIDE_EFFECT" | "MISSED_DOSES" | "RAPID_WEIGHT_LOSS" | "PSYCHIATRIC" | "PATIENT_REQUEST";
  title: string;
  description: string;
}) {
  return db.triageAlert.create({
    data: {
      patientId: data.patientId,
      providerId: data.providerId || null,
      severity: data.severity,
      triggerType: data.triggerType,
      title: data.title,
      description: data.description,
      status: "OPEN",
    },
  });
}

// ── Get Triage Alerts ──────────────────────────────────────────

export async function getTriageAlerts(
  page = 1,
  limit = 25,
  severity?: string,
  status?: string
) {
  const where: Record<string, unknown> = {};
  if (severity && severity !== "all") where.severity = severity;
  if (status && status !== "all") where.status = status;

  const [rows, total] = await Promise.all([
    db.triageAlert.findMany({
      where,
      orderBy: [
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.triageAlert.count({ where }),
  ]);

  // Enrich with patient info
  const patientIds = [...new Set(rows.map((r) => r.patientId))];
  const patients = await db.user.findMany({
    where: { id: { in: patientIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const patientMap = new Map(patients.map((p) => [p.id, p]));

  const enriched = rows.map((r) => {
    const patient = patientMap.get(r.patientId);
    return {
      ...r,
      patientName: patient
        ? [patient.firstName, patient.lastName].filter(Boolean).join(" ") || patient.email
        : "Unknown",
      patientEmail: patient?.email || "",
    };
  });

  return { rows: enriched, total };
}

// ── Acknowledge Alert ──────────────────────────────────────────

export async function acknowledgeAlert(id: string, providerId: string) {
  return db.triageAlert.update({
    where: { id },
    data: {
      status: "ACKNOWLEDGED",
      providerId,
      acknowledgedAt: new Date(),
    },
  });
}

// ── Resolve Alert ──────────────────────────────────────────────

export async function resolveAlert(id: string, resolution: string) {
  return db.triageAlert.update({
    where: { id },
    data: {
      status: "RESOLVED",
      resolution,
      resolvedAt: new Date(),
    },
  });
}

// ── Escalate Alert ─────────────────────────────────────────────

export async function escalateAlert(
  id: string,
  toProviderId: string,
  reason: string
) {
  const alert = await db.triageAlert.findUnique({ where: { id } });
  if (!alert) throw new Error("Alert not found");

  // Create escalation record
  await db.escalationRecord.create({
    data: {
      triageAlertId: id,
      fromProvider: alert.providerId || null,
      toProvider: toProviderId,
      reason,
      autoEscalated: false,
    },
  });

  // Update alert
  return db.triageAlert.update({
    where: { id },
    data: {
      status: "ESCALATED",
      escalatedAt: new Date(),
      escalatedTo: toProviderId,
    },
  });
}

// ── Triage Metrics ─────────────────────────────────────────────

export async function getTriageMetrics() {
  const [
    openTotal,
    openEmergency,
    openCritical,
    openUrgent,
    openRoutine,
    totalResolved,
    totalEscalated,
    totalAlerts,
    resolvedAlerts,
  ] = await Promise.all([
    db.triageAlert.count({ where: { status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] } } }),
    db.triageAlert.count({ where: { severity: "EMERGENCY", status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] } } }),
    db.triageAlert.count({ where: { severity: "CRITICAL", status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] } } }),
    db.triageAlert.count({ where: { severity: "URGENT", status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] } } }),
    db.triageAlert.count({ where: { severity: "ROUTINE", status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] } } }),
    db.triageAlert.count({ where: { status: "RESOLVED" } }),
    db.triageAlert.count({ where: { status: "ESCALATED" } }),
    db.triageAlert.count(),
    db.triageAlert.findMany({
      where: { status: "RESOLVED", acknowledgedAt: { not: null } },
      select: { createdAt: true, acknowledgedAt: true },
    }),
  ]);

  // Calculate average response time (time from creation to acknowledgment)
  let avgResponseMinutes = 0;
  if (resolvedAlerts.length > 0) {
    const totalMinutes = resolvedAlerts.reduce((sum, a) => {
      if (!a.acknowledgedAt) return sum;
      const diff = a.acknowledgedAt.getTime() - a.createdAt.getTime();
      return sum + diff / (1000 * 60);
    }, 0);
    avgResponseMinutes = Math.round(totalMinutes / resolvedAlerts.length);
  }

  const escalationRate =
    totalAlerts > 0 ? Math.round((totalEscalated / totalAlerts) * 100) : 0;

  return {
    openTotal,
    openBySeverity: {
      EMERGENCY: openEmergency,
      CRITICAL: openCritical,
      URGENT: openUrgent,
      ROUTINE: openRoutine,
    },
    totalResolved,
    totalEscalated,
    totalAlerts,
    avgResponseMinutes,
    escalationRate,
  };
}

// ── Auto-Detect Triage Needs ───────────────────────────────────

export async function autoDetectTriageNeeds() {
  const created: string[] = [];
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // 1. Patients with 3+ days of missed medication
  const patientsWithTracking = await db.progressEntry.findMany({
    where: {
      date: { gte: sevenDaysAgo },
      medicationTaken: false,
    },
    select: { userId: true, date: true },
  });

  // Group by userId and count missed days
  const missedByUser = new Map<string, number>();
  for (const entry of patientsWithTracking) {
    missedByUser.set(entry.userId, (missedByUser.get(entry.userId) || 0) + 1);
  }

  for (const [userId, missedDays] of missedByUser) {
    if (missedDays >= 3) {
      // Check for existing open alert of same type
      const existing = await db.triageAlert.findFirst({
        where: {
          patientId: userId,
          triggerType: "MISSED_DOSES",
          status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] },
        },
      });

      if (!existing) {
        const alert = await createTriageAlert({
          patientId: userId,
          severity: "URGENT",
          triggerType: "MISSED_DOSES",
          title: `${missedDays} missed medication doses in 7 days`,
          description: `Patient has missed ${missedDays} doses in the past 7 days. Adherence intervention recommended.`,
        });
        created.push(alert.id);
      }
    }
  }

  // 2. Patients with rapid weight loss (>5 lbs/week)
  const recentProgress = await db.progressEntry.findMany({
    where: {
      date: { gte: sevenDaysAgo },
      weightLbs: { not: null },
    },
    orderBy: { date: "asc" },
    select: { userId: true, weightLbs: true, date: true },
  });

  const weightByUser = new Map<string, { earliest: number; latest: number; days: number }>();
  for (const entry of recentProgress) {
    if (!entry.weightLbs) continue;
    const existing = weightByUser.get(entry.userId);
    if (!existing) {
      weightByUser.set(entry.userId, {
        earliest: entry.weightLbs,
        latest: entry.weightLbs,
        days: 1,
      });
    } else {
      existing.latest = entry.weightLbs;
      existing.days++;
    }
  }

  for (const [userId, data] of weightByUser) {
    const weeklyLoss = data.earliest - data.latest;
    if (weeklyLoss > 5 && data.days >= 2) {
      const existing = await db.triageAlert.findFirst({
        where: {
          patientId: userId,
          triggerType: "RAPID_WEIGHT_LOSS",
          status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] },
        },
      });

      if (!existing) {
        const alert = await createTriageAlert({
          patientId: userId,
          severity: "CRITICAL",
          triggerType: "RAPID_WEIGHT_LOSS",
          title: `Rapid weight loss: ${weeklyLoss.toFixed(1)} lbs in 7 days`,
          description: `Patient lost ${weeklyLoss.toFixed(1)} lbs in the past week, exceeding the safe threshold of 5 lbs/week. Medical review required.`,
        });
        created.push(alert.id);
      }
    }
  }

  // 3. Severe adverse event reports
  const severeEvents = await db.adverseEventReport.findMany({
    where: {
      severity: { in: ["SEVERE", "LIFE_THREATENING"] },
      reportedAt: { gte: sevenDaysAgo },
      resolvedAt: null,
    },
    select: { id: true, userId: true, severity: true, description: true, medicationName: true },
  });

  for (const event of severeEvents) {
    const existing = await db.triageAlert.findFirst({
      where: {
        patientId: event.userId,
        triggerType: "SEVERE_SIDE_EFFECT",
        status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] },
      },
    });

    if (!existing) {
      const severity = event.severity === "LIFE_THREATENING" ? "EMERGENCY" : "CRITICAL";
      const alert = await createTriageAlert({
        patientId: event.userId,
        severity: severity as "EMERGENCY" | "CRITICAL",
        triggerType: "SEVERE_SIDE_EFFECT",
        title: `${event.severity} adverse event: ${event.medicationName || "medication"}`,
        description: event.description,
      });
      created.push(alert.id);
    }
  }

  return { alertsCreated: created.length, alertIds: created };
}
