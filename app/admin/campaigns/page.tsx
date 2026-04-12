export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CampaignsClient } from "./campaigns-client";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; type?: string }>;
}

export default async function CampaignsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 20;
  const statusFilter = params.status || "all";
  const typeFilter = params.type || "all";

  const where: Record<string, unknown> = {};
  if (statusFilter !== "all") where.status = statusFilter;
  if (typeFilter !== "all") where.type = typeFilter;

  const [campaigns, total] = await Promise.all([
    db.campaign.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.campaign.count({ where }),
  ]);

  // Compute summary KPIs
  const allCampaigns = await db.campaign.aggregate({
    _sum: {
      sentCount: true,
      openedCount: true,
      clickedCount: true,
      convertedCount: true,
      revenueGenerated: true,
    },
  });

  const summary = {
    totalSent: allCampaigns._sum.sentCount || 0,
    totalOpened: allCampaigns._sum.openedCount || 0,
    totalClicked: allCampaigns._sum.clickedCount || 0,
    totalConverted: allCampaigns._sum.convertedCount || 0,
    totalRevenue: allCampaigns._sum.revenueGenerated || 0,
  };

  const serialized = campaigns.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    startedAt: c.startedAt?.toISOString() || null,
    pausedAt: c.pausedAt?.toISOString() || null,
  }));

  return (
    <CampaignsClient
      campaigns={serialized}
      total={total}
      page={page}
      limit={limit}
      statusFilter={statusFilter}
      typeFilter={typeFilter}
      summary={summary}
    />
  );
}
