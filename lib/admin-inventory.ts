import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────────

export interface InventoryOverview {
  totalMedications: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  onOrderCount: number;
  totalValueCents: number;
}

export interface RefillForecastItem {
  medicationName: string;
  currentStock: number;
  upcomingRefills: number;
  projectedRemaining: number;
  status: "SUFFICIENT" | "TIGHT" | "INSUFFICIENT";
}

// ─── Queries ────────────────────────────────────────────────────

export async function getInventoryRecords(
  page = 1,
  limit = 50,
  status?: string
) {
  const where: Record<string, unknown> = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  const [records, total] = await Promise.all([
    db.inventoryRecord.findMany({
      where,
      orderBy: [{ status: "asc" }, { medicationName: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.inventoryRecord.count({ where }),
  ]);

  return { records, total, page, limit };
}

export async function getInventoryOverview(): Promise<InventoryOverview> {
  const records = await db.inventoryRecord.findMany({
    select: {
      status: true,
      currentStock: true,
      unitCostCents: true,
    },
  });

  let inStockCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let onOrderCount = 0;
  let totalValueCents = 0;

  for (const r of records) {
    switch (r.status) {
      case "IN_STOCK":
        inStockCount++;
        break;
      case "LOW_STOCK":
        lowStockCount++;
        break;
      case "OUT_OF_STOCK":
        outOfStockCount++;
        break;
      case "ON_ORDER":
        onOrderCount++;
        break;
    }
    if (r.unitCostCents) {
      totalValueCents += r.currentStock * r.unitCostCents;
    }
  }

  return {
    totalMedications: records.length,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    onOrderCount,
    totalValueCents,
  };
}

export async function calculateEstimatedRunout(inventoryId: string) {
  const record = await db.inventoryRecord.findUnique({
    where: { id: inventoryId },
  });

  if (!record) return null;

  // Count active DosageSchedules for this medication
  const activeSchedules = await db.dosageSchedule.count({
    where: {
      medicationName: record.medicationName,
      status: "ACTIVE",
    },
  });

  if (activeSchedules === 0 || record.currentStock === 0) {
    const estimatedRunout =
      record.currentStock === 0 ? new Date() : null;

    await db.inventoryRecord.update({
      where: { id: inventoryId },
      data: { estimatedRunout },
    });

    return { ...record, estimatedRunout, activePatients: activeSchedules };
  }

  // Estimate monthly consumption: most GLP-1 schedules are weekly (4 doses/month)
  const monthlyConsumption = activeSchedules * 4;
  const monthsRemaining = record.currentStock / monthlyConsumption;
  const weeksRemaining = monthsRemaining * 4.33;

  const estimatedRunout = new Date();
  estimatedRunout.setDate(
    estimatedRunout.getDate() + Math.floor(weeksRemaining * 7)
  );

  await db.inventoryRecord.update({
    where: { id: inventoryId },
    data: { estimatedRunout },
  });

  return {
    ...record,
    estimatedRunout,
    activePatients: activeSchedules,
    monthlyConsumption,
    weeksRemaining: Math.round(weeksRemaining * 10) / 10,
  };
}

export async function getRefillForecast(): Promise<RefillForecastItem[]> {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // Get all inventory records
  const inventoryRecords = await db.inventoryRecord.findMany({
    select: {
      medicationName: true,
      currentStock: true,
    },
  });

  // For each unique medication, count upcoming refills
  const forecast: RefillForecastItem[] = [];

  for (const inv of inventoryRecords) {
    const upcomingRefills = await db.treatmentPlan.count({
      where: {
        medicationName: inv.medicationName,
        nextRefillDate: {
          gte: new Date(),
          lte: thirtyDaysFromNow,
        },
        status: { in: ["ACTIVE", "PRESCRIBED"] },
      },
    });

    const projectedRemaining = inv.currentStock - upcomingRefills;

    let status: "SUFFICIENT" | "TIGHT" | "INSUFFICIENT";
    if (projectedRemaining > inv.currentStock * 0.3) {
      status = "SUFFICIENT";
    } else if (projectedRemaining > 0) {
      status = "TIGHT";
    } else {
      status = "INSUFFICIENT";
    }

    forecast.push({
      medicationName: inv.medicationName,
      currentStock: inv.currentStock,
      upcomingRefills,
      projectedRemaining: Math.max(0, projectedRemaining),
      status,
    });
  }

  // Sort: insufficient first, then tight, then sufficient
  const statusOrder = { INSUFFICIENT: 0, TIGHT: 1, SUFFICIENT: 2 };
  forecast.sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  return forecast;
}

export async function checkLowStockAlerts() {
  const lowStockRecords = await db.inventoryRecord.findMany({
    where: {
      OR: [
        { status: "LOW_STOCK" },
        { status: "OUT_OF_STOCK" },
      ],
    },
  });

  const alerts: Awaited<ReturnType<typeof db.adminAlert.create>>[] = [];

  for (const record of lowStockRecords) {
    // Check if there is already a recent alert for this medication (within last 24h)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const existingAlert = await db.adminAlert.findFirst({
      where: {
        type: "LOW_STOCK",
        title: { contains: record.medicationName },
        createdAt: { gte: oneDayAgo },
      },
    });

    if (!existingAlert) {
      const severity =
        record.status === "OUT_OF_STOCK" ? "CRITICAL" : "WARNING";

      const alert = await db.adminAlert.create({
        data: {
          type: "LOW_STOCK",
          severity,
          title: `${record.status === "OUT_OF_STOCK" ? "Out of stock" : "Low stock"}: ${record.medicationName}`,
          body: `${record.medicationName} from ${record.pharmacyVendor} has ${record.currentStock} units remaining (threshold: ${record.reorderThreshold}).`,
          link: "/admin/inventory",
        },
      });
      alerts.push(alert);
    }
  }

  return alerts;
}

// ─── Mutations ──────────────────────────────────────────────────

export async function createInventoryRecord(data: {
  medicationName: string;
  pharmacyVendor: string;
  currentStock: number;
  reorderThreshold: number;
  reorderQuantity: number;
  unitCostCents?: number | null;
  notes?: string | null;
  status?: string;
}) {
  // Determine status based on stock level
  let status = data.status || "IN_STOCK";
  if (data.currentStock === 0) {
    status = "OUT_OF_STOCK";
  } else if (data.currentStock <= data.reorderThreshold) {
    status = "LOW_STOCK";
  }

  return db.inventoryRecord.create({
    data: {
      ...data,
      status,
      lastRestockedAt: new Date(),
    },
  });
}

export async function updateInventoryRecord(
  id: string,
  data: {
    medicationName?: string;
    pharmacyVendor?: string;
    currentStock?: number;
    reorderThreshold?: number;
    reorderQuantity?: number;
    unitCostCents?: number | null;
    notes?: string | null;
    status?: string;
    lastRestockedAt?: Date | null;
  }
) {
  // Auto-determine status if stock changed
  if (data.currentStock !== undefined) {
    const existing = await db.inventoryRecord.findUnique({
      where: { id },
      select: { reorderThreshold: true },
    });
    const threshold = data.reorderThreshold ?? existing?.reorderThreshold ?? 0;

    if (data.currentStock === 0) {
      data.status = "OUT_OF_STOCK";
    } else if (data.currentStock <= threshold) {
      data.status = "LOW_STOCK";
    } else if (!data.status || data.status === "OUT_OF_STOCK" || data.status === "LOW_STOCK") {
      data.status = "IN_STOCK";
    }
  }

  return db.inventoryRecord.update({ where: { id }, data });
}
