import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getInventoryRecords,
  getInventoryOverview,
  getRefillForecast,
  createInventoryRecord,
  updateInventoryRecord,
  calculateEstimatedRunout,
  checkLowStockAlerts,
} from "@/lib/admin-inventory";
import { safeError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "50");
    const status = url.searchParams.get("status") || undefined;

    const [records, overview, forecast] = await Promise.all([
      getInventoryRecords(page, limit, status),
      getInventoryOverview(),
      getRefillForecast(),
    ]);

    // Check for low stock alerts as a side effect
    await checkLowStockAlerts().catch(() => {});

    return NextResponse.json({ ...records, overview, forecast });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Inventory GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    // Handle special actions
    if (body.action === "calculate_runout" && body.id) {
      const result = await calculateEstimatedRunout(body.id);
      return NextResponse.json({ result });
    }

    if (body.action === "check_alerts") {
      const alerts = await checkLowStockAlerts();
      return NextResponse.json({ alerts });
    }

    const {
      medicationName,
      pharmacyVendor,
      currentStock,
      reorderThreshold,
      reorderQuantity,
      unitCostCents,
      notes,
    } = body;

    if (!medicationName || !pharmacyVendor) {
      return NextResponse.json(
        { error: "Medication name and pharmacy vendor are required" },
        { status: 400 }
      );
    }

    if (currentStock == null || reorderThreshold == null || reorderQuantity == null) {
      return NextResponse.json(
        { error: "Stock, threshold, and reorder quantity are required" },
        { status: 400 }
      );
    }

    const record = await createInventoryRecord({
      medicationName,
      pharmacyVendor,
      currentStock: Number(currentStock),
      reorderThreshold: Number(reorderThreshold),
      reorderQuantity: Number(reorderQuantity),
      unitCostCents: unitCostCents != null ? Number(unitCostCents) : null,
      notes: notes || null,
    });

    return NextResponse.json({ record });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Inventory POST]", error);
    return NextResponse.json(
      { error: "Failed to create inventory record" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Inventory record ID required" },
        { status: 400 }
      );
    }

    // Convert numeric strings
    if (data.currentStock != null) data.currentStock = Number(data.currentStock);
    if (data.reorderThreshold != null)
      data.reorderThreshold = Number(data.reorderThreshold);
    if (data.reorderQuantity != null)
      data.reorderQuantity = Number(data.reorderQuantity);
    if (data.unitCostCents != null)
      data.unitCostCents = Number(data.unitCostCents);

    // Handle restock action
    if (data.action === "restock") {
      data.lastRestockedAt = new Date();
      delete data.action;
    }

    const record = await updateInventoryRecord(id, data);
    return NextResponse.json({ record });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Inventory PUT]", error);
    return NextResponse.json(
      { error: "Failed to update inventory record" },
      { status: 500 }
    );
  }
}
