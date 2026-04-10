import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminCustomers } from "@/lib/admin-data";
import { AdminCustomersClient } from "./customers-client";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; q?: string; status?: string; sort?: string; order?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const data = await getAdminCustomers({
    page: parseInt(params.page || "1", 10),
    limit: parseInt(params.limit || "25", 10),
    search: params.q,
    status: params.status,
    sort: params.sort,
    order: params.order as "asc" | "desc" | undefined,
  });

  return <AdminCustomersClient customers={data.rows} total={data.total} />;
}
