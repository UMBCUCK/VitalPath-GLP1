export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPayments } from "@/lib/admin-financial";
import { db } from "@/lib/db";
import { PaymentsClient } from "./payments-client";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; status?: string; q?: string; from?: string; to?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "25", 10);

  const [data, totalRevenueAgg, totalRefundedAgg, pendingCount, processingCount, recentOrders] = await Promise.all([
    getPayments({
      page,
      limit,
      status: params.status,
      search: params.q,
      from: params.from ? new Date(params.from) : undefined,
      to: params.to ? new Date(params.to) : undefined,
    }),
    db.order.aggregate({
      where: { status: { in: ["PROCESSING", "SHIPPED", "DELIVERED"] } },
      _sum: { totalCents: true },
    }),
    db.order.aggregate({
      where: { status: "REFUNDED" },
      _sum: { totalCents: true },
    }),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.count({ where: { status: "PROCESSING" } }),
    db.order.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
        status: { in: ["PROCESSING", "SHIPPED", "DELIVERED"] },
      },
      select: { createdAt: true, totalCents: true },
    }),
  ]);

  return (
    <PaymentsClient
      orders={data.orders}
      total={data.total}
      page={page}
      limit={limit}
      currentStatus={params.status || ""}
      currentSearch={params.q || ""}
      totalRevenue={totalRevenueAgg._sum.totalCents || 0}
      totalRefunded={totalRefundedAgg._sum.totalCents || 0}
      pendingCount={pendingCount}
      processingCount={processingCount}
      recentOrders={recentOrders}
    />
  );
}
