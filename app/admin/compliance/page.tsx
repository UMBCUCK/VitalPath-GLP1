export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileText, AlertTriangle, Activity } from "lucide-react";

function getActionBadgeVariant(
  action: string
): "success" | "destructive" | "default" | "secondary" | "warning" {
  if (action.includes("APPROVED")) return "success";
  if (action.includes("DENIED")) return "destructive";
  if (action.includes("PRESCRIPTION")) return "default";
  if (action.includes("REVIEW")) return "warning";
  return "secondary";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function truncate(text: string | null, length: number): string {
  if (!text) return "--";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export default async function AdminCompliancePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const logs = await db.complianceAuditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Fetch actor names for all unique actorIds
  const actorIds = [...new Set(logs.map((l) => l.actorId))];
  const actors = await db.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const actorMap = new Map(actors.map((a) => [a.id, a]));

  const totalLogs = logs.length;
  const approvedCount = logs.filter((l) => l.action.includes("APPROVED")).length;
  const deniedCount = logs.filter((l) => l.action.includes("DENIED")).length;
  const prescriptionCount = logs.filter((l) =>
    l.action.includes("PRESCRIPTION")
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Compliance Audit Log</h2>
        <p className="text-sm text-graphite-400">
          Review compliance actions, intake decisions, and prescription activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <FileText className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Total Entries</p>
              <p className="text-xl font-bold text-navy">{totalLogs}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-graphite-400">Approved</p>
              <p className="text-xl font-bold text-navy">{approvedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-xs text-graphite-400">Denied</p>
              <p className="text-xl font-bold text-navy">{deniedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Activity className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-graphite-400">Prescriptions</p>
              <p className="text-xl font-bold text-navy">{prescriptionCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Recent Activity (last 100 entries)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-6 py-3 text-left font-medium text-graphite-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Actor
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Patient ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    State
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Rationale
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-sm text-graphite-300"
                    >
                      No compliance audit entries found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const actor = actorMap.get(log.actorId);
                    const actorName = actor
                      ? `${actor.firstName || ""} ${actor.lastName || ""}`.trim() ||
                        actor.email
                      : log.actorId.slice(0, 8);

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-navy-50/20 transition-colors"
                      >
                        <td className="px-6 py-3 text-xs text-graphite-500 whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy text-xs">
                            {actorName}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-[10px]">
                            {log.actorRole}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getActionBadgeVariant(log.action)}>
                            {log.action.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-graphite-500 font-mono">
                          {log.patientId.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-graphite-500">
                          {log.stateCode || (
                            <span className="text-graphite-300">--</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-graphite-500 max-w-[200px]">
                          <span title={log.clinicalRationale || undefined}>
                            {truncate(log.clinicalRationale, 60)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
