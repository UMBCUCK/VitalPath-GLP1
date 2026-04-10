import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getReseller, getResellerPerformance, getCommissions } from "@/lib/admin-resellers";
import { ResellerDetailClient } from "./reseller-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResellerDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const { id } = await params;

  const [reseller, performance, commissionsData] = await Promise.all([
    getReseller(id),
    getResellerPerformance(id),
    getCommissions({ resellerId: id, page: 1, limit: 50 }),
  ]);

  if (!reseller) redirect("/admin/resellers");

  // Serialize dates
  const serializedReseller = {
    ...reseller,
    lastSaleAt: reseller.lastSaleAt?.toISOString() || null,
    createdAt: reseller.createdAt.toISOString(),
    updatedAt: reseller.updatedAt.toISOString(),
    commissions: reseller.commissions.map((c) => ({
      ...c,
      paidAt: c.paidAt?.toISOString() || null,
      periodStart: c.periodStart?.toISOString() || null,
      periodEnd: c.periodEnd?.toISOString() || null,
      createdAt: c.createdAt.toISOString(),
    })),
  };

  const serializedCommissions = commissionsData.commissions.map((c) => ({
    ...c,
    paidAt: c.paidAt?.toISOString() || null,
    periodStart: c.periodStart?.toISOString() || null,
    periodEnd: c.periodEnd?.toISOString() || null,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <ResellerDetailClient
      reseller={serializedReseller}
      performance={performance}
      commissions={serializedCommissions}
      commissionsTotal={commissionsData.total}
    />
  );
}
