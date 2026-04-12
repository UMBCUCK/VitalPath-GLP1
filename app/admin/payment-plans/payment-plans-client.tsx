"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Users, AlertTriangle, Download } from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────

interface InstallmentRow {
  id: string;
  sequenceNum: number;
  amountCents: number;
  status: string;
  dueDate: string | Date;
  paidAt: string | Date | null;
}

interface PlanRow {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  installments: number;
  installmentCents: number;
  paidCount: number;
  remainingCents: number;
  status: string;
  nextPaymentDate: string | Date | null;
  createdAt: string | Date;
  payments: InstallmentRow[];
}

interface PaymentPlansClientProps {
  plans: PlanRow[];
  total: number;
  page: number;
  limit: number;
  currentStatus: string;
}

// ─── Status badge colors ───────────────────────────────────

const statusBadgeVariant: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
  ACTIVE: "default",
  COMPLETED: "success",
  DEFAULTED: "destructive",
  CANCELED: "secondary",
};

// ─── Columns ───────────────────────────────────────────────

const columns: ColumnDef<PlanRow>[] = [
  {
    key: "customer",
    header: "Customer",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-navy">{row.customerName}</p>
        <p className="text-xs text-graphite-400">{row.customerEmail}</p>
      </div>
    ),
  },
  {
    key: "totalCents",
    header: "Total",
    sortable: true,
    render: (row) => (
      <p className="font-medium text-navy">{formatPrice(row.totalCents)}</p>
    ),
  },
  {
    key: "installments",
    header: "Installments",
    render: (row) => (
      <div className="text-sm">
        <p className="text-navy">{row.installments}x {formatPrice(row.installmentCents)}</p>
      </div>
    ),
  },
  {
    key: "progress",
    header: "Paid / Remaining",
    render: (row) => (
      <div className="text-sm">
        <p className="text-navy">
          {row.paidCount}/{row.installments} paid
        </p>
        <p className="text-xs text-graphite-400">
          {formatPrice(row.remainingCents)} remaining
        </p>
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
    key: "nextPaymentDate",
    header: "Next Payment",
    sortable: true,
    render: (row) => (
      <p className="text-sm text-graphite-500">
        {row.nextPaymentDate
          ? new Date(row.nextPaymentDate).toLocaleDateString()
          : row.status === "COMPLETED"
            ? "Done"
            : "-"}
      </p>
    ),
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    render: (row) => (
      <p className="text-sm text-graphite-500">
        {new Date(row.createdAt).toLocaleDateString()}
      </p>
    ),
  },
];

// ─── Component ─────────────────────────────────────────────

export function PaymentPlansClient({ plans, total, page, limit, currentStatus }: PaymentPlansClientProps) {
  const router = useRouter();
  const [, setSelectedIds] = useState<string[]>([]);

  // Summary stats
  const activePlans = plans.filter((p) => p.status === "ACTIVE").length;
  const totalCollected = plans.reduce((sum, p) => sum + (p.totalCents - p.remainingCents), 0);
  const totalOutstanding = plans.reduce((sum, p) => sum + p.remainingCents, 0);
  const defaultedPlans = plans.filter((p) => p.status === "DEFAULTED").length;

  const navigate = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (params.page) sp.set("page", params.page);
    if (params.limit) sp.set("limit", params.limit);
    if (params.status) sp.set("status", params.status);
    router.push(`/admin/payment-plans?${sp.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Payment Plans</h1>
          <p className="text-sm text-graphite-500">Manage installment-based payment plans</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() =>
            exportToCSV(
              plans,
              [
                { key: "customer", header: "Customer", getValue: (r) => r.customerName },
                { key: "email", header: "Email", getValue: (r) => r.customerEmail },
                { key: "total", header: "Total", getValue: (r) => formatPrice(r.totalCents) },
                { key: "installments", header: "Installments", getValue: (r) => String(r.installments) },
                { key: "paid", header: "Paid", getValue: (r) => String(r.paidCount) },
                { key: "remaining", header: "Remaining", getValue: (r) => formatPrice(r.remainingCents) },
                { key: "status", header: "Status", getValue: (r) => r.status },
              ],
              "payment-plans"
            )
          }
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <CreditCard className="h-5 w-5 text-teal" />
            </div>
            <div>
              <p className="text-xs text-graphite-400">Active Plans</p>
              <p className="text-xl font-bold text-navy">{activePlans}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-graphite-400">Collected</p>
              <p className="text-xl font-bold text-navy">{formatPrice(totalCollected)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-graphite-400">Outstanding</p>
              <p className="text-xl font-bold text-navy">{formatPrice(totalOutstanding)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-graphite-400">Defaulted</p>
              <p className="text-xl font-bold text-navy">{defaultedPlans}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={plans}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        onPageChange={(p) => navigate({ page: String(p), limit: String(limit), status: currentStatus })}
        onLimitChange={(l) => navigate({ page: "1", limit: String(l), status: currentStatus })}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "All", value: "" },
              { label: "Active", value: "ACTIVE" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Defaulted", value: "DEFAULTED" },
              { label: "Canceled", value: "CANCELED" },
            ],
          },
        ]}
        activeFilters={{ status: currentStatus }}
        onFilterChange={(key, value) => {
          if (key === "status") {
            navigate({ page: "1", limit: String(limit), status: value });
          }
        }}
        selectable
        getRowId={(row) => row.id}
        onSelectionChange={setSelectedIds}
        emptyMessage="No payment plans found"
      />
    </div>
  );
}
