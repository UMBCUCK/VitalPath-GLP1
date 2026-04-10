"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import {
  History,
  Download,
  Search,
  Activity,
  UserCog,
  Database,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatarUrl?: string | null;
  };
}

interface TimelineEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

interface Stats {
  totalActions: number;
  actionsToday: number;
  mostActiveAdmin: { name: string; count: number };
  mostModifiedEntity: { name: string; count: number };
  actionsByType: Record<string, number>;
}

interface FilterOptions {
  admins: { id: string; name: string }[];
  entities: string[];
  actions: string[];
}

interface Props {
  entries: AuditEntry[];
  total: number;
  page: number;
  limit: number;
  stats: Stats;
  filterOptions: FilterOptions;
  currentFilters: {
    search?: string;
    adminId?: string;
    entity?: string;
    action?: string;
    from?: string;
    to?: string;
  };
}

// ─── Action badge colors ─────────────────────────────────────

const actionBadgeColors: Record<string, string> = {
  CREATE: "bg-teal-50 text-teal-700 border-teal-200",
  UPDATE: "bg-blue-50 text-blue-700 border-blue-200",
  DELETE: "bg-red-50 text-red-700 border-red-200",
  APPROVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REFUND: "bg-amber-50 text-amber-700 border-amber-200",
  LOGIN: "bg-purple-50 text-purple-700 border-purple-200",
  EXPORT: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

function getActionBadgeClass(action: string): string {
  const upper = action.toUpperCase();
  for (const [key, cls] of Object.entries(actionBadgeColors)) {
    if (upper.includes(key)) return cls;
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

// ─── Component ──────────────────────────────────────────────

export function AuditTrailClient({
  entries,
  total,
  page,
  limit,
  stats,
  filterOptions,
  currentFilters,
}: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(currentFilters.search ?? "");
  const [exporting, setExporting] = useState(false);

  // Timeline view
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineEntity, setTimelineEntity] = useState("");
  const [timelineEntityId, setTimelineEntityId] = useState("");
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // ─── Build filter URL ──────────────────────────────────────

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams();
      const merged = { ...currentFilters, ...overrides };
      for (const [key, value] of Object.entries(merged)) {
        if (value) params.set(key, value);
      }
      return `/admin/audit-trail?${params.toString()}`;
    },
    [currentFilters]
  );

  // ─── Handlers ──────────────────────────────────────────────

  const handleSearch = () => {
    router.push(buildUrl({ search: searchValue || undefined, page: "1" }));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      params.set("mode", "export");
      if (currentFilters.search) params.set("search", currentFilters.search);
      if (currentFilters.adminId) params.set("adminId", currentFilters.adminId);
      if (currentFilters.entity) params.set("entity", currentFilters.entity);
      if (currentFilters.action) params.set("action", currentFilters.action);
      if (currentFilters.from) params.set("from", currentFilters.from);
      if (currentFilters.to) params.set("to", currentFilters.to);

      const res = await fetch(`/api/admin/audit-trail?${params.toString()}`);
      const csv = await res.text();
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setExporting(false);
    }
  };

  const handleLoadTimeline = async () => {
    if (!timelineEntity || !timelineEntityId) return;
    setLoadingTimeline(true);
    try {
      const res = await fetch(
        `/api/admin/audit-trail?mode=timeline&entity=${timelineEntity}&entityId=${timelineEntityId}`
      );
      const data = await res.json();
      setTimelineEntries(data);
    } finally {
      setLoadingTimeline(false);
    }
  };

  // ─── Table columns ─────────────────────────────────────────

  const columns: ColumnDef<AuditEntry>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (row) => (
        <div className="text-xs">
          <p className="font-medium text-navy">
            {new Date(row.createdAt).toLocaleDateString()}
          </p>
          <p className="text-graphite-400">
            {new Date(row.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "admin",
      header: "Admin",
      render: (row) => {
        const name = [row.user.firstName, row.user.lastName]
          .filter(Boolean)
          .join(" ");
        const initials = [row.user.firstName?.[0], row.user.lastName?.[0]]
          .filter(Boolean)
          .join("")
          .toUpperCase();
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy">
              {initials || "?"}
            </div>
            <div>
              <p className="text-sm font-medium text-navy">{name || row.user.email}</p>
              <p className="text-xs text-graphite-400">{row.user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <Badge
          variant="outline"
          className={getActionBadgeClass(row.action)}
        >
          {row.action}
        </Badge>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      render: (row) => (
        <div>
          <span className="font-medium text-navy">{row.entity}</span>
          {row.entityId && (
            <span className="ml-1 text-xs text-graphite-400">
              #{row.entityId.slice(0, 8)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "details",
      header: "Details",
      render: (row) => {
        if (!row.details) return <span className="text-graphite-300">-</span>;
        const summary = JSON.stringify(row.details);
        return (
          <span className="text-xs text-graphite-500 max-w-[200px] truncate block">
            {summary.length > 60 ? summary.slice(0, 60) + "..." : summary}
          </span>
        );
      },
    },
    {
      key: "ip",
      header: "IP",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.ipAddress ?? "-"}
        </span>
      ),
    },
    {
      key: "expand",
      header: "",
      render: (row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setExpandedId(expandedId === row.id ? null : row.id);
          }}
        >
          {expandedId === row.id ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      ),
    },
  ];

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Audit Trail Explorer</h2>
          <p className="text-sm text-graphite-400">
            Search, filter, and export all admin actions for compliance
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={exporting}
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Exporting..." : "Export for Compliance"}
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Actions"
          value={String(stats.totalActions)}
          icon={Activity}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Actions Today"
          value={String(stats.actionsToday)}
          icon={Clock}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Most Active Admin"
          value={stats.mostActiveAdmin.name}
          icon={UserCog}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Most Modified Entity"
          value={stats.mostModifiedEntity.name}
          icon={Database}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Search + Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="mb-1 block text-xs font-medium text-graphite-500">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-300" />
                <Input
                  placeholder="Search actions, entities, admins..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Admin filter */}
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Admin</label>
              <select
                value={currentFilters.adminId ?? ""}
                onChange={(e) =>
                  router.push(buildUrl({ adminId: e.target.value || undefined, page: "1" }))
                }
                className="rounded-lg border border-navy-100 px-3 py-2 text-sm"
              >
                <option value="">All Admins</option>
                {filterOptions.admins.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Entity filter */}
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Entity</label>
              <select
                value={currentFilters.entity ?? ""}
                onChange={(e) =>
                  router.push(buildUrl({ entity: e.target.value || undefined, page: "1" }))
                }
                className="rounded-lg border border-navy-100 px-3 py-2 text-sm"
              >
                <option value="">All Entities</option>
                {filterOptions.entities.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            {/* Action filter */}
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Action</label>
              <select
                value={currentFilters.action ?? ""}
                onChange={(e) =>
                  router.push(buildUrl({ action: e.target.value || undefined, page: "1" }))
                }
                className="rounded-lg border border-navy-100 px-3 py-2 text-sm"
              >
                <option value="">All Actions</option>
                {filterOptions.actions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">From</label>
              <Input
                type="date"
                value={currentFilters.from ?? ""}
                onChange={(e) =>
                  router.push(buildUrl({ from: e.target.value || undefined, page: "1" }))
                }
                className="w-36"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">To</label>
              <Input
                type="date"
                value={currentFilters.to ?? ""}
                onChange={(e) =>
                  router.push(buildUrl({ to: e.target.value || undefined, page: "1" }))
                }
                className="w-36"
              />
            </div>

            <Button onClick={handleSearch} size="sm">
              Apply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/audit-trail")}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results table */}
      <DataTable
        data={entries}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        onPageChange={(p) => router.push(buildUrl({ page: String(p) }))}
        emptyMessage="No audit entries found matching your filters."
      />

      {/* Expanded detail */}
      {expandedId && (
        <ExpandedDetail
          entry={entries.find((e) => e.id === expandedId)!}
        />
      )}

      {/* Entity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5 text-teal" /> Entity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Entity Type</label>
              <select
                value={timelineEntity}
                onChange={(e) => setTimelineEntity(e.target.value)}
                className="rounded-lg border border-navy-100 px-3 py-2 text-sm"
              >
                <option value="">Select...</option>
                {filterOptions.entities.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Entity ID</label>
              <Input
                placeholder="abc123..."
                value={timelineEntityId}
                onChange={(e) => setTimelineEntityId(e.target.value)}
                className="w-48"
              />
            </div>
            <Button
              onClick={handleLoadTimeline}
              disabled={loadingTimeline || !timelineEntity || !timelineEntityId}
              size="sm"
            >
              {loadingTimeline ? "Loading..." : "Load Timeline"}
            </Button>
            {showTimeline && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTimeline(false);
                  setTimelineEntries([]);
                }}
              >
                Clear
              </Button>
            )}
          </div>

          {timelineEntries.length > 0 && (
            <div className="relative border-l-2 border-navy-100/40 pl-6 space-y-4">
              {timelineEntries.map((entry, i) => {
                const name = [entry.user.firstName, entry.user.lastName]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <div key={entry.id} className="relative">
                    {/* Timeline marker */}
                    <div className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-teal">
                      <div className="h-2 w-2 rounded-full bg-teal" />
                    </div>

                    <div className="rounded-lg border border-navy-100/40 bg-white p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getActionBadgeClass(entry.action)}
                          >
                            {entry.action}
                          </Badge>
                          <span className="text-sm font-medium text-navy">
                            {name || entry.user.email}
                          </span>
                        </div>
                        <span className="text-xs text-graphite-400">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {entry.details && (
                        <pre className="mt-2 max-h-32 overflow-auto rounded bg-linen/30 p-2 text-xs text-graphite-600">
                          {JSON.stringify(entry.details, null, 2)}
                        </pre>
                      )}
                      {entry.ipAddress && (
                        <p className="mt-1 text-xs text-graphite-300">
                          IP: {entry.ipAddress}
                        </p>
                      )}
                    </div>

                    {/* Connector arrow */}
                    {i < timelineEntries.length - 1 && (
                      <div className="absolute -left-[23px] top-12 text-graphite-200">
                        <ArrowRight className="h-3 w-3 rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {timelineEntries.length === 0 && timelineEntity && timelineEntityId && !loadingTimeline && (
            <p className="text-sm text-graphite-300">
              No timeline entries found for {timelineEntity} #{timelineEntityId}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Expanded detail view ────────────────────────────────────

function ExpandedDetail({ entry }: { entry: AuditEntry }) {
  if (!entry) return null;

  const details = entry.details;
  const hasBefore = details && "before" in details;
  const hasAfter = details && "after" in details;

  return (
    <Card className="border-blue-200 bg-blue-50/20">
      <CardHeader>
        <CardTitle className="text-base">
          Audit Detail &mdash; {entry.action} on {entry.entity}
          {entry.entityId && ` #${entry.entityId.slice(0, 8)}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-graphite-500 mb-1">Admin</p>
            <p className="text-sm text-navy">
              {[entry.user.firstName, entry.user.lastName].filter(Boolean).join(" ") || entry.user.email}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-graphite-500 mb-1">Timestamp</p>
            <p className="text-sm text-navy">{new Date(entry.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-graphite-500 mb-1">IP Address</p>
            <p className="text-sm text-navy">{entry.ipAddress ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-graphite-500 mb-1">Entity ID</p>
            <p className="text-sm text-navy font-mono">{entry.entityId ?? "N/A"}</p>
          </div>
        </div>

        {/* Before/After comparison */}
        {(hasBefore || hasAfter) && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {hasBefore && (
              <div>
                <p className="text-xs font-semibold text-red-500 mb-1">Before</p>
                <pre className="max-h-48 overflow-auto rounded bg-red-50/50 p-3 text-xs text-graphite-600">
                  {JSON.stringify((details as Record<string, unknown>).before, null, 2)}
                </pre>
              </div>
            )}
            {hasAfter && (
              <div>
                <p className="text-xs font-semibold text-emerald-500 mb-1">After</p>
                <pre className="max-h-48 overflow-auto rounded bg-emerald-50/50 p-3 text-xs text-graphite-600">
                  {JSON.stringify((details as Record<string, unknown>).after, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Full details JSON */}
        {details && !hasBefore && !hasAfter && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-graphite-500 mb-1">Full Details</p>
            <pre className="max-h-64 overflow-auto rounded bg-linen/30 p-3 text-xs text-graphite-600">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
