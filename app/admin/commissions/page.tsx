/**
 * /admin/commissions
 * ─────────────────────────────────────────────────────────────
 * Tier 11.2 — Admin commission ledger. Lists every Commission row
 * with the reseller, customer, status, and inline approve/reject/pay
 * actions. Pairs with the existing PUT /api/admin/commissions endpoint.
 *
 * Default filter: status = PENDING (the queue admin actually needs to
 * work). Status filter chips let admin switch to APPROVED, PAID, etc.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommissionRowActions } from "./commission-row-actions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string; reseller?: string }>;
}

const STATUSES = ["PENDING", "APPROVED", "PAID", "REJECTED", "CLAWBACK"] as const;

export default async function CommissionsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const status = (params.status?.toUpperCase() as (typeof STATUSES)[number]) || "PENDING";
  const validStatus = STATUSES.includes(status) ? status : "PENDING";

  const [rows, totals] = await Promise.all([
    db.commission.findMany({
      where: {
        status: validStatus,
        ...(params.reseller ? { resellerId: params.reseller } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        type: true,
        amountCents: true,
        status: true,
        createdAt: true,
        paidAt: true,
        notes: true,
        customerId: true,
        subscriptionId: true,
        reseller: {
          select: {
            id: true,
            displayName: true,
            companyName: true,
            contactEmail: true,
          },
        },
      },
    }),
    // Per-status counts for the filter chips
    db.commission.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { amountCents: true },
    }),
  ]);

  const totalsByStatus = new Map(
    totals.map((t) => [t.status, { count: t._count._all, sum: t._sum.amountCents ?? 0 }]),
  );

  const totalCents = rows.reduce((sum, r) => sum + r.amountCents, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Reseller commissions</h1>
          <p className="text-sm text-graphite-400">
            {rows.length} {validStatus.toLowerCase()} ·{" "}
            ${(totalCents / 100).toLocaleString()} total
          </p>
        </div>
        <Link
          href="/admin/resellers"
          className="text-sm font-semibold text-teal hover:underline"
        >
          Manage resellers →
        </Link>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const tot = totalsByStatus.get(s);
          const isActive = s === validStatus;
          return (
            <Link
              key={s}
              href={`/admin/commissions?status=${s.toLowerCase()}`}
              className={
                isActive
                  ? "rounded-full bg-navy px-4 py-1.5 text-xs font-bold text-white"
                  : "rounded-full border border-navy-100/60 bg-white px-4 py-1.5 text-xs font-medium text-navy hover:border-teal hover:text-teal transition-colors"
              }
            >
              {s} {tot ? `(${tot.count})` : ""}
            </Link>
          );
        })}
      </div>

      {/* Ledger table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commission ledger</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="py-12 text-center text-graphite-400">
              No commissions in {validStatus.toLowerCase()} status.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 text-left text-xs text-graphite-400">
                    <th className="py-2 font-semibold">Reseller</th>
                    <th className="py-2 font-semibold">Type</th>
                    <th className="py-2 font-semibold text-right">Amount</th>
                    <th className="py-2 font-semibold">Created</th>
                    <th className="py-2 font-semibold">Status</th>
                    <th className="py-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {rows.map((c) => (
                    <tr key={c.id} className="text-navy">
                      <td className="py-3">
                        <p className="text-sm font-semibold">
                          {c.reseller?.displayName || c.reseller?.companyName || "—"}
                        </p>
                        <p className="text-[11px] text-graphite-400">
                          {c.reseller?.contactEmail}
                        </p>
                      </td>
                      <td className="py-3 text-xs">
                        <code className="rounded bg-navy-50/60 px-2 py-0.5">
                          {c.type}
                        </code>
                      </td>
                      <td className="py-3 text-right font-semibold">
                        ${(c.amountCents / 100).toFixed(2)}
                      </td>
                      <td className="py-3 text-xs text-graphite-500">
                        {c.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3">
                        <CommissionStatusBadge status={c.status} />
                      </td>
                      <td className="py-3 text-right">
                        <CommissionRowActions id={c.id} status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-xs text-graphite-400">
            Auto-approval cron flips PENDING commissions to APPROVED after a
            14-day clean hold window. Override commissions (TIER1/2/3) are
            blocked from payout for AKS/FTC compliance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function CommissionStatusBadge({ status }: { status: string }) {
  const variant =
    status === "PENDING"
      ? "warning"
      : status === "APPROVED"
        ? "default"
        : status === "PAID"
          ? "success"
          : status === "REJECTED" || status === "CLAWBACK"
            ? "destructive"
            : "secondary";
  return (
    <Badge variant={variant} className="text-[10px]">
      {status}
    </Badge>
  );
}
