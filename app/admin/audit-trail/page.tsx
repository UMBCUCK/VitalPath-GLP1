import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { searchAuditTrail, getAuditStats, getAuditFilterOptions } from "@/lib/admin-audit-trail";
import { AuditTrailClient } from "./audit-trail-client";

export default async function AuditTrailPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    adminId?: string;
    entity?: string;
    action?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  const searchParams2 = {
    page,
    limit: 25,
    search: params.search ?? undefined,
    adminId: params.adminId ?? undefined,
    entity: params.entity ?? undefined,
    action: params.action ?? undefined,
    from: params.from ? new Date(params.from) : undefined,
    to: params.to ? new Date(params.to) : undefined,
  };

  const [auditData, stats, filterOptions] = await Promise.all([
    searchAuditTrail(searchParams2),
    getAuditStats(searchParams2.from, searchParams2.to),
    getAuditFilterOptions(),
  ]);

  return (
    <AuditTrailClient
      entries={JSON.parse(JSON.stringify(auditData.entries))}
      total={auditData.total}
      page={auditData.page}
      limit={auditData.limit}
      stats={JSON.parse(JSON.stringify(stats))}
      filterOptions={JSON.parse(JSON.stringify(filterOptions))}
      currentFilters={{
        search: params.search,
        adminId: params.adminId,
        entity: params.entity,
        action: params.action,
        from: params.from,
        to: params.to,
      }}
    />
  );
}
