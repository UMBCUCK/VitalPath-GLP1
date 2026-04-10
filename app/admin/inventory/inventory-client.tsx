"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import {
  DataTable,
  type ColumnDef,
  exportToCSV,
} from "@/components/admin/data-table";
import { cn, formatPriceDecimal } from "@/lib/utils";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Truck,
  DollarSign,
  Plus,
  X,
  RefreshCw,
  Calculator,
  Clock,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface InventoryRecord {
  id: string;
  medicationName: string;
  pharmacyVendor: string;
  currentStock: number;
  reorderThreshold: number;
  reorderQuantity: number;
  unitCostCents: number | null;
  lastRestockedAt: string | null;
  estimatedRunout: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface InventoryOverview {
  totalMedications: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  onOrderCount: number;
  totalValueCents: number;
}

interface RefillForecastItem {
  medicationName: string;
  currentStock: number;
  upcomingRefills: number;
  projectedRemaining: number;
  status: "SUFFICIENT" | "TIGHT" | "INSUFFICIENT";
}

interface Props {
  initialRecords: InventoryRecord[];
  initialTotal: number;
  overview: InventoryOverview;
  forecast: RefillForecastItem[];
}

const statusConfig: Record<
  string,
  { label: string; variant: string; icon: typeof CheckCircle }
> = {
  IN_STOCK: { label: "In Stock", variant: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  LOW_STOCK: { label: "Low Stock", variant: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertTriangle },
  OUT_OF_STOCK: { label: "Out of Stock", variant: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  ON_ORDER: { label: "On Order", variant: "bg-blue-50 text-blue-700 border-blue-200", icon: Truck },
};

const forecastStatusColors: Record<string, string> = {
  SUFFICIENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  TIGHT: "bg-amber-50 text-amber-700 border-amber-200",
  INSUFFICIENT: "bg-red-50 text-red-700 border-red-200",
};

// ─── Component ──────────────────────────────────────────────

export function InventoryClient({
  initialRecords,
  initialTotal,
  overview,
  forecast,
}: Props) {
  const [records, setRecords] = useState(initialRecords);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InventoryRecord | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formMedName, setFormMedName] = useState("");
  const [formVendor, setFormVendor] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formThreshold, setFormThreshold] = useState("");
  const [formReorderQty, setFormReorderQty] = useState("");
  const [formUnitCost, setFormUnitCost] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const resetForm = useCallback(() => {
    setFormMedName("");
    setFormVendor("");
    setFormStock("");
    setFormThreshold("");
    setFormReorderQty("");
    setFormUnitCost("");
    setFormNotes("");
    setEditingRecord(null);
    setShowForm(false);
  }, []);

  const openEditForm = useCallback((record: InventoryRecord) => {
    setEditingRecord(record);
    setFormMedName(record.medicationName);
    setFormVendor(record.pharmacyVendor);
    setFormStock(String(record.currentStock));
    setFormThreshold(String(record.reorderThreshold));
    setFormReorderQty(String(record.reorderQuantity));
    setFormUnitCost(record.unitCostCents != null ? String(record.unitCostCents) : "");
    setFormNotes(record.notes || "");
    setShowForm(true);
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory?page=${page}`);
      const data = await res.json();
      if (data.records) {
        setRecords(data.records);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  const handleSubmit = useCallback(async () => {
    if (!formMedName.trim() || !formVendor.trim()) return;
    setLoading(true);

    try {
      const payload = {
        ...(editingRecord ? { id: editingRecord.id } : {}),
        medicationName: formMedName,
        pharmacyVendor: formVendor,
        currentStock: Number(formStock) || 0,
        reorderThreshold: Number(formThreshold) || 0,
        reorderQuantity: Number(formReorderQty) || 0,
        unitCostCents: formUnitCost ? Number(formUnitCost) : null,
        notes: formNotes || null,
      };

      const res = await fetch("/api/admin/inventory", {
        method: editingRecord ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchRecords();
      }
    } finally {
      setLoading(false);
    }
  }, [
    formMedName,
    formVendor,
    formStock,
    formThreshold,
    formReorderQty,
    formUnitCost,
    formNotes,
    editingRecord,
    resetForm,
    fetchRecords,
  ]);

  const handleRestock = useCallback(
    async (record: InventoryRecord) => {
      const qty = prompt(
        `Restock ${record.medicationName}. Enter quantity to add:`,
        String(record.reorderQuantity)
      );
      if (!qty) return;

      const newStock = record.currentStock + Number(qty);
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          currentStock: newStock,
          action: "restock",
        }),
      });

      if (res.ok) fetchRecords();
    },
    [fetchRecords]
  );

  const handleCalculateRunout = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "calculate_runout", id }),
        });

        if (res.ok) fetchRecords();
      } finally {
        setLoading(false);
      }
    },
    [fetchRecords]
  );

  const handleExportCSV = useCallback(() => {
    exportToCSV(
      records,
      [
        { key: "medicationName", header: "Medication", getValue: (r) => r.medicationName },
        { key: "pharmacyVendor", header: "Vendor", getValue: (r) => r.pharmacyVendor },
        { key: "currentStock", header: "Stock", getValue: (r) => String(r.currentStock) },
        { key: "reorderThreshold", header: "Reorder At", getValue: (r) => String(r.reorderThreshold) },
        { key: "status", header: "Status", getValue: (r) => r.status },
        {
          key: "unitCost",
          header: "Unit Cost",
          getValue: (r) => r.unitCostCents != null ? `$${(r.unitCostCents / 100).toFixed(2)}` : "",
        },
        {
          key: "estimatedRunout",
          header: "Est. Runout",
          getValue: (r) => r.estimatedRunout ? new Date(r.estimatedRunout).toLocaleDateString() : "",
        },
      ],
      "inventory"
    );
  }, [records]);

  // Check if any alerts needed
  const hasAlerts = overview.lowStockCount > 0 || overview.outOfStockCount > 0;

  // Table columns
  const columns: ColumnDef<InventoryRecord>[] = [
    {
      key: "medicationName",
      header: "Medication",
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.medicationName}</p>
          <p className="text-xs text-graphite-400">{row.pharmacyVendor}</p>
        </div>
      ),
    },
    {
      key: "currentStock",
      header: "Stock",
      render: (row) => (
        <span
          className={cn(
            "font-semibold",
            row.currentStock === 0
              ? "text-red-600"
              : row.currentStock <= row.reorderThreshold
                ? "text-amber-600"
                : "text-navy"
          )}
        >
          {row.currentStock}
        </span>
      ),
    },
    {
      key: "reorderThreshold",
      header: "Reorder At",
      render: (row) => (
        <span className="text-sm text-graphite-500">{row.reorderThreshold}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const cfg = statusConfig[row.status] || statusConfig.IN_STOCK;
        return <Badge className={cfg.variant}>{cfg.label}</Badge>;
      },
    },
    {
      key: "estimatedRunout",
      header: "Est. Runout",
      render: (row) => {
        if (!row.estimatedRunout) {
          return <span className="text-xs text-graphite-300">--</span>;
        }
        const runout = new Date(row.estimatedRunout);
        const daysUntil = Math.ceil(
          (runout.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return (
          <span
            className={cn(
              "text-sm",
              daysUntil < 14 ? "text-red-600 font-semibold" : "text-graphite-500"
            )}
          >
            {runout.toLocaleDateString()}
            {daysUntil < 14 && (
              <span className="block text-[10px]">({daysUntil}d left)</span>
            )}
          </span>
        );
      },
    },
    {
      key: "unitCost",
      header: "Unit Cost",
      render: (row) =>
        row.unitCostCents != null ? (
          <span className="text-sm">{formatPriceDecimal(row.unitCostCents)}</span>
        ) : (
          <span className="text-xs text-graphite-300">--</span>
        ),
    },
    {
      key: "lastRestocked",
      header: "Last Restocked",
      render: (row) =>
        row.lastRestockedAt ? (
          <span className="text-sm text-graphite-500">
            {new Date(row.lastRestockedAt).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-xs text-graphite-300">--</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditForm(row)}
            className="rounded p-1 text-graphite-400 hover:bg-navy-50 transition-colors"
            title="Edit"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleRestock(row)}
            className="rounded p-1 text-emerald-500 hover:bg-emerald-50 transition-colors"
            title="Restock"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleCalculateRunout(row.id)}
            className="rounded p-1 text-blue-500 hover:bg-blue-50 transition-colors"
            title="Calculate runout"
          >
            <Calculator className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Inventory &amp; Supply Chain
          </h1>
          <p className="text-sm text-graphite-400">
            Track medication stock levels, reorder thresholds, and refill forecasts
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Medication
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <KPICard
          title="Total Medications"
          value={String(overview.totalMedications)}
          icon={Package}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="In Stock"
          value={String(overview.inStockCount)}
          icon={CheckCircle}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Low Stock"
          value={String(overview.lowStockCount)}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Out of Stock"
          value={String(overview.outOfStockCount)}
          icon={XCircle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Total Value"
          value={formatPriceDecimal(overview.totalValueCents)}
          icon={DollarSign}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="On Order"
          value={String(overview.onOrderCount)}
          icon={Truck}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      {/* Alert Banner */}
      {hasAlerts && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">
                Inventory Attention Required
              </p>
              <p className="mt-0.5 text-sm text-amber-700">
                {overview.outOfStockCount > 0 && (
                  <span className="font-medium">
                    {overview.outOfStockCount} medication(s) out of stock.{" "}
                  </span>
                )}
                {overview.lowStockCount > 0 && (
                  <span>
                    {overview.lowStockCount} medication(s) running low on stock.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-navy">
                {editingRecord ? "Edit Inventory Record" : "Add New Medication"}
              </CardTitle>
              <button
                onClick={resetForm}
                className="rounded-lg p-1 hover:bg-navy-50 transition-colors"
              >
                <X className="h-5 w-5 text-graphite-400" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={formMedName}
                  onChange={(e) => setFormMedName(e.target.value)}
                  placeholder="e.g. Semaglutide 0.25mg"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Pharmacy Vendor *
                </label>
                <input
                  type="text"
                  value={formVendor}
                  onChange={(e) => setFormVendor(e.target.value)}
                  placeholder="e.g. 503A Compounding, Novo Nordisk"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Current Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Reorder Threshold *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formThreshold}
                  onChange={(e) => setFormThreshold(e.target.value)}
                  placeholder="50"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Reorder Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formReorderQty}
                  onChange={(e) => setFormReorderQty(e.target.value)}
                  placeholder="200"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Unit Cost (cents)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formUnitCost}
                  onChange={(e) => setFormUnitCost(e.target.value)}
                  placeholder="e.g. 1500 for $15.00"
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Notes
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional notes about this inventory record..."
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="rounded-lg border border-navy-100 px-4 py-2 text-sm font-medium text-graphite-500 hover:bg-linen/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formMedName.trim() || !formVendor.trim()}
                className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90 disabled:opacity-50 transition-colors"
              >
                {loading
                  ? "Saving..."
                  : editingRecord
                    ? "Update Record"
                    : "Add Medication"}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-navy">
            Medication Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={records}
            columns={columns}
            total={total}
            page={page}
            limit={50}
            onPageChange={setPage}
            onExportCSV={handleExportCSV}
            getRowId={(r) => r.id}
            emptyMessage="No inventory records found. Add a medication to get started."
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Refill Forecast */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-navy" />
            <CardTitle className="text-base font-semibold text-navy">
              30-Day Refill Forecast
            </CardTitle>
          </div>
          <p className="text-xs text-graphite-400 mt-1">
            Projected stock impact based on upcoming patient refills in the next 30 days
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {forecast.length === 0 ? (
            <div className="py-8 text-center text-graphite-300 text-sm">
              No forecast data available. Add inventory records and ensure patients have active treatment plans.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-500 uppercase tracking-wider">
                      Upcoming Refills (30d)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-500 uppercase tracking-wider">
                      Projected Remaining
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {forecast.map((item) => (
                    <tr key={item.medicationName} className="hover:bg-linen/20">
                      <td className="px-4 py-3 font-medium text-navy">
                        {item.medicationName}
                      </td>
                      <td className="px-4 py-3 text-graphite-500">
                        {item.upcomingRefills}
                      </td>
                      <td className="px-4 py-3 text-graphite-500">
                        {item.currentStock}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "font-semibold",
                            item.projectedRemaining === 0
                              ? "text-red-600"
                              : item.status === "TIGHT"
                                ? "text-amber-600"
                                : "text-emerald-600"
                          )}
                        >
                          {item.projectedRemaining}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            forecastStatusColors[item.status] ||
                            "bg-gray-100 text-gray-600"
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
