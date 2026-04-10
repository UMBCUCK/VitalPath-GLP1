import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getResellers, getResellerLeaderboard } from "@/lib/admin-resellers";
import { ResellersClient } from "./resellers-client";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function ResellersPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search || undefined;
  const status = params.status || undefined;

  const [resellersData, leaderboard] = await Promise.all([
    getResellers({ page, limit: 25, search, status }),
    getResellerLeaderboard(),
  ]);

  // Serialize dates
  const serializedResellers = resellersData.resellers.map((r) => ({
    ...r,
    lastSaleAt: r.lastSaleAt?.toISOString() || null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <ResellersClient
      resellers={serializedResellers}
      leaderboard={leaderboard}
      total={resellersData.total}
      page={resellersData.page}
      limit={resellersData.limit}
      searchQuery={search || ""}
      statusFilter={status || "all"}
    />
  );
}
