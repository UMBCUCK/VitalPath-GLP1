export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminPaymentPlans } from "@/lib/payment-plans";
import { PaymentPlansClient } from "./payment-plans-client";

export default async function AdminPaymentPlansPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; status?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const limit = parseInt(params.limit || "25", 10);

  const data = await getAdminPaymentPlans(page, limit, params.status);

  return (
    <PaymentPlansClient
      plans={data.plans}
      total={data.total}
      page={page}
      limit={limit}
      currentStatus={params.status || ""}
    />
  );
}
