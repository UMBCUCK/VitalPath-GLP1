"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, RefreshCw, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderRow {
  id: string;
  customer: string;
  email: string;
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
  status: string;
  items: string[];
  coupon: string | null;
  stripePaymentId: string | null;
  createdAt: Date;
}

const statusBadgeVariant: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
  DELIVERED: "success",
  SHIPPED: "default",
  PROCESSING: "warning",
  PENDING: "secondary",
  CANCELED: "destructive",
  REFUNDED: "destructive",
};

const columns: ColumnDef<OrderRow>[] = [
  {
    key: "customer",
    header: "Customer",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-navy">{row.customer}</p>
        <p className="text-xs text-graphite-400">{row.email}</p>
      </div>
    ),
  },
  {
    key: "items",
    header: "Items",
    render: (row) => (
      <div className="max-w-[200px]">
        <p className="text-sm text-graphite-500 truncate">{row.items.join(", ")}</p>
      </div>
    ),
  },
  {
    key: "total",
    header: "Total",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-navy">{formatPrice(row.total)}</p>
        {row.discount > 0 && (
          <p className="text-[10px] text-emerald-600">-{formatPrice(row.discount)} discount</p>
        )}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => (
      <Badge variant={statusBadgeVariant[row.status] || "secondary"}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: "coupon",
    header: "Coupon",
    render: (row) =>
      row.coupon ? (
        <span className="rounded bg-gold-50 px-2 py-0.5 font-mono text-xs font-medium text-gold-800">
          {row.coupon}
        </span>
      ) : (
        <span className="text-graphite-300">—</span>
      ),
  },
  {
    key: "createdAt",
    header: "Date",
    sortable: true,
    render: (row) => (
      <span className="text-sm text-graphite-500">
        {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    render: (row) => <PaymentActions order={row} />,
  },
];

function PaymentActions({ order }: { order: OrderRow }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRefund = async () => {
    if (!confirm(`Refund ${formatPrice(order.total)} to ${order.customer}?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (res.ok) router.refresh();
      else alert("Refund failed. Check Stripe configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (res.ok) router.refresh();
      else alert("Retry failed.");
    } finally {
      setLoading(false);
    }
  };

  if (order.status === "REFUNDED" || order.status === "CANCELED") return null;

  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleRefund} disabled={loading}>
        <RotateCcw className="mr-1 h-3 w-3" />
        Refund
      </Button>
      {order.status === "PENDING" && (
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleRetry} disabled={loading}>
          <RefreshCw className="mr-1 h-3 w-3" />
          Retry
        </Button>
      )}
    </div>
  );
}

interface Props {
  orders: OrderRow[];
  total: number;
  page: number;
  limit: number;
  currentStatus: string;
  currentSearch: string;
}

export function PaymentsClient({ orders, total, page, limit, currentStatus, currentSearch }: Props) {
  const router = useRouter();

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`/admin/payments?${params.toString()}`);
  };

  const handleExport = () => {
    exportToCSV(orders, [
      { key: "customer", header: "Customer", getValue: (r) => r.customer },
      { key: "email", header: "Email", getValue: (r) => r.email },
      { key: "total", header: "Total", getValue: (r) => (r.total / 100).toFixed(2) },
      { key: "status", header: "Status", getValue: (r) => r.status },
      { key: "items", header: "Items", getValue: (r) => r.items.join("; ") },
      { key: "date", header: "Date", getValue: (r) => new Date(r.createdAt).toISOString().slice(0, 10) },
    ], "payments");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Payments</h2>
        <p className="text-sm text-graphite-400">Order history, refunds, and payment management</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={orders}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            search={currentSearch}
            onPageChange={(p) => updateParams({ page: p })}
            onLimitChange={(l) => updateParams({ limit: l, page: 1 })}
            onSearchChange={(q) => updateParams({ q: q || null, page: 1 })}
            searchPlaceholder="Search by customer name or email..."
            onExportCSV={handleExport}
            getRowId={(r) => r.id}
            filters={[
              {
                key: "status",
                label: "All Statuses",
                options: [
                  { label: "Pending", value: "pending" },
                  { label: "Processing", value: "processing" },
                  { label: "Shipped", value: "shipped" },
                  { label: "Delivered", value: "delivered" },
                  { label: "Refunded", value: "refunded" },
                  { label: "Canceled", value: "canceled" },
                ],
              },
            ]}
            activeFilters={{ status: currentStatus }}
            onFilterChange={(key, value) => updateParams({ [key]: value || null, page: 1 })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
