import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPayments } from "@/lib/admin-financial";
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

  const data = await getPayments({
    page,
    limit,
    status: params.status,
    search: params.q,
    from: params.from ? new Date(params.from) : undefined,
    to: params.to ? new Date(params.to) : undefined,
  });

  return (
    <PaymentsClient
      orders={data.orders}
      total={data.total}
      page={page}
      limit={limit}
      currentStatus={params.status || ""}
      currentSearch={params.q || ""}
    />
  );
}
