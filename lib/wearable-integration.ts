import { db } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────

export type Platform = "APPLE_HEALTH" | "GOOGLE_FIT" | "FITBIT" | "WHOOP" | "OURA";
export type Metric = "STEPS" | "WEIGHT" | "HEART_RATE" | "SLEEP_HOURS" | "BLOOD_GLUCOSE" | "ACTIVE_CALORIES";

const METRIC_UNITS: Record<Metric, string> = {
  STEPS: "steps",
  WEIGHT: "lbs",
  HEART_RATE: "bpm",
  SLEEP_HOURS: "hours",
  BLOOD_GLUCOSE: "mg/dL",
  ACTIVE_CALORIES: "kcal",
};

// ── Connect Device ─────────────────────────────────────────────

export async function connectDevice(
  userId: string,
  platform: Platform,
  data?: { accessToken?: string; refreshToken?: string; expiresAt?: Date }
) {
  // Upsert — reconnecting an existing connection reactivates it
  const connection = await db.deviceConnection.upsert({
    where: {
      userId_platform: { userId, platform },
    },
    update: {
      isActive: true,
      accessToken: data?.accessToken || `mock_access_${platform}_${Date.now()}`,
      refreshToken: data?.refreshToken || `mock_refresh_${platform}_${Date.now()}`,
      expiresAt: data?.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastSyncAt: new Date(),
    },
    create: {
      userId,
      platform,
      isActive: true,
      accessToken: data?.accessToken || `mock_access_${platform}_${Date.now()}`,
      refreshToken: data?.refreshToken || `mock_refresh_${platform}_${Date.now()}`,
      expiresAt: data?.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastSyncAt: new Date(),
    },
  });

  return connection;
}

// ── Disconnect Device ──────────────────────────────────────────

export async function disconnectDevice(userId: string, platform: Platform) {
  const connection = await db.deviceConnection.updateMany({
    where: { userId, platform },
    data: { isActive: false },
  });

  return connection;
}

// ── Get User Devices ───────────────────────────────────────────

export async function getUserDevices(userId: string) {
  return db.deviceConnection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

// ── Ingest Data Point ──────────────────────────────────────────

export async function ingestDataPoint(
  userId: string,
  source: string,
  metric: Metric,
  value: number,
  unit?: string,
  recordedAt?: Date
) {
  const dataPoint = await db.deviceDataPoint.create({
    data: {
      userId,
      source,
      metric,
      value,
      unit: unit || METRIC_UNITS[metric] || "unknown",
      recordedAt: recordedAt || new Date(),
    },
  });

  // Update lastSyncAt on the connection
  await db.deviceConnection.updateMany({
    where: { userId, platform: source, isActive: true },
    data: { lastSyncAt: new Date() },
  });

  return dataPoint;
}

// ── Get User Health Data ───────────────────────────────────────

export async function getUserHealthData(
  userId: string,
  metric: Metric,
  days = 30
) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return db.deviceDataPoint.findMany({
    where: {
      userId,
      metric,
      recordedAt: { gte: since },
    },
    orderBy: { recordedAt: "asc" },
  });
}

// ── Admin Metrics ──────────────────────────────────────────────

export async function getWearableAdminMetrics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalConnections,
    activeConnections,
    appleHealth,
    googleFit,
    fitbit,
    whoop,
    oura,
    dataPointsToday,
    totalDataPoints,
  ] = await Promise.all([
    db.deviceConnection.count(),
    db.deviceConnection.count({ where: { isActive: true } }),
    db.deviceConnection.count({ where: { platform: "APPLE_HEALTH", isActive: true } }),
    db.deviceConnection.count({ where: { platform: "GOOGLE_FIT", isActive: true } }),
    db.deviceConnection.count({ where: { platform: "FITBIT", isActive: true } }),
    db.deviceConnection.count({ where: { platform: "WHOOP", isActive: true } }),
    db.deviceConnection.count({ where: { platform: "OURA", isActive: true } }),
    db.deviceDataPoint.count({ where: { createdAt: { gte: today } } }),
    db.deviceDataPoint.count(),
  ]);

  // Get recent connections for adoption table
  const connections = await db.deviceConnection.findMany({
    where: { isActive: true },
    select: {
      platform: true,
      userId: true,
      lastSyncAt: true,
    },
  });

  // Calculate active today (synced today)
  const activeTodayConnections = connections.filter(
    (c) => c.lastSyncAt && c.lastSyncAt >= today
  );

  // Data points per platform
  const platformDataPoints = await Promise.all(
    (["APPLE_HEALTH", "GOOGLE_FIT", "FITBIT", "WHOOP", "OURA"] as Platform[]).map(
      async (platform) => {
        const count = await db.deviceDataPoint.count({
          where: { source: platform },
        });
        return { platform, count };
      }
    )
  );

  return {
    totalConnections,
    activeConnections,
    activeToday: activeTodayConnections.length,
    dataPointsToday,
    totalDataPoints,
    byPlatform: {
      APPLE_HEALTH: appleHealth,
      GOOGLE_FIT: googleFit,
      FITBIT: fitbit,
      WHOOP: whoop,
      OURA: oura,
    },
    platformDataPoints,
  };
}
