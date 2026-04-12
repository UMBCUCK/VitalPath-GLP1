"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle,
  Download,
  Eye,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────

interface AuditEntry {
  id: string;
  actorId: string;
  actorType: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  patientId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  actorName: string;
}

interface DataRequest {
  id: string;
  userId: string;
  type: string;
  status: string;
  requestedAt: string;
  completedAt: string | null;
  completedBy: string | null;
  notes: string | null;
  exportUrl: string | null;
  patientName: string;
  patientEmail: string;
}

interface Metrics {
  accessLogs30d: number;
  totalAccessLogs: number;
  pendingRequests: number;
  completedRequests: number;
  deniedRequests: number;
  totalRequests: number;
  complianceScore: number;
  actionBreakdown: { action: string; count: number }[];
}

interface Props {
  initialAuditEntries: AuditEntry[];
  initialAuditTotal: number;
  initialRequests: DataRequest[];
  initialRequestsTotal: number;
  metrics: Metrics;
}

const actionColors: Record<string, string> = {
  ACCESS: "bg-blue-100 text-blue-800",
  CREATE: "bg-emerald-100 text-emerald-800",
  UPDATE: "bg-amber-100 text-amber-800",
  DELETE: "bg-red-100 text-red-800",
  EXPORT: "bg-purple-100 text-purple-800",
  SHARE: "bg-indigo-100 text-indigo-800",
};

const requestTypeColors: Record<string, string> = {
  ACCESS: "bg-blue-100 text-blue-800",
  DELETION: "bg-red-100 text-red-800",
  EXPORT: "bg-purple-100 text-purple-800",
  AMENDMENT: "bg-amber-100 text-amber-800",
};

const requestStatusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  DENIED: "bg-red-100 text-red-800",
};

// ─── Component ─────────────────────────────────────────────

export function HipaaClient({
  initialAuditEntries,
  initialAuditTotal,
  initialRequests,
  initialRequestsTotal,
  metrics,
}: Props) {
  const [auditEntries, setAuditEntries] = useState(initialAuditEntries);
  const [auditTotal, setAuditTotal] = useState(initialAuditTotal);
  const [requests, setRequests] = useState(initialRequests);
  const [requestsTotal, setRequestsTotal] = useState(initialRequestsTotal);
  const [activeTab, setActiveTab] = useState<"audit" | "requests">("audit");
  const [actionFilter, setActionFilter] = useState("all");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");

  const handleProcessRequest = async (id: string, action: "PROCESSING" | "COMPLETED" | "DENIED") => {
    const res = await fetch("/api/admin/hipaa", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) await refreshRequests();
  };

  const refreshAudit = async () => {
    const params = new URLSearchParams();
    if (actionFilter !== "all") params.set("actionFilter", actionFilter);
    const res = await fetch(`/api/admin/hipaa?${params}`);
    if (res.ok) {
      const data = await res.json();
      setAuditEntries(data.entries);
      setAuditTotal(data.total);
    }
  };

  const refreshRequests = async () => {
    const params = new URLSearchParams({ action: "requests" });
    if (requestStatusFilter !== "all") params.set("status", requestStatusFilter);
    const res = await fetch(`/api/admin/hipaa?${params}`);
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests);
      setRequestsTotal(data.total);
    }
  };

  const handleActionFilterChange = async (filter: string) => {
    setActionFilter(filter);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("actionFilter", filter);
    const res = await fetch(`/api/admin/hipaa?${params}`);
    if (res.ok) {
      const data = await res.json();
      setAuditEntries(data.entries);
      setAuditTotal(data.total);
    }
  };

  const handleRequestFilterChange = async (filter: string) => {
    setRequestStatusFilter(filter);
    const params = new URLSearchParams({ action: "requests" });
    if (filter !== "all") params.set("status", filter);
    const res = await fetch(`/api/admin/hipaa?${params}`);
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests);
      setRequestsTotal(data.total);
    }
  };

  const scoreColor = metrics.complianceScore >= 90
    ? "text-emerald-600"
    : metrics.complianceScore >= 70
      ? "text-amber-600"
      : "text-red-600";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">HIPAA Compliance Center</h2>
          <p className="text-sm text-graphite-400">
            Audit logging, data requests, and compliance monitoring
          </p>
        </div>
        <Button
          variant="outline"
          className="text-xs"
          onClick={() => {
            // Export trigger — download audit as CSV
            window.open("/api/admin/hipaa?action=export", "_blank");
          }}
        >
          <Download className="mr-2 h-3.5 w-3.5" />
          Export Audit Trail
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Eye className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-graphite-400">Access Logs (30d)</p>
              <p className="text-xl font-bold text-navy">{metrics.accessLogs30d}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xs text-graphite-400">Pending Requests</p>
              <p className="text-xl font-bold text-navy">{metrics.pendingRequests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-graphite-400">Completed Requests</p>
              <p className="text-xl font-bold text-navy">{metrics.completedRequests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ShieldCheck className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Compliance Score</p>
              <p className={`text-xl font-bold ${scoreColor}`}>{metrics.complianceScore}/100</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 rounded-xl bg-navy-50/50 p-1">
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "audit"
              ? "bg-white text-navy shadow-sm"
              : "text-graphite-400 hover:text-navy"
          }`}
        >
          <FileText className="mr-2 inline-block h-4 w-4" />
          Audit Log ({auditTotal})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "requests"
              ? "bg-white text-navy shadow-sm"
              : "text-graphite-400 hover:text-navy"
          }`}
        >
          <ShieldCheck className="mr-2 inline-block h-4 w-4" />
          Data Requests ({requestsTotal})
        </button>
      </div>

      {/* Audit Log Table */}
      {activeTab === "audit" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Audit Log</CardTitle>
            <select
              value={actionFilter}
              onChange={(e) => handleActionFilterChange(e.target.value)}
              className="rounded-xl border border-navy-100/40 bg-white px-3 py-1.5 text-xs"
            >
              <option value="all">All Actions</option>
              <option value="ACCESS">Access</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="EXPORT">Export</option>
              <option value="SHARE">Share</option>
            </select>
          </CardHeader>
          <CardContent>
            {auditEntries.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No audit entries found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/30 text-left text-xs text-graphite-400">
                      <th className="pb-2 pr-4 font-medium">Timestamp</th>
                      <th className="pb-2 pr-4 font-medium">Actor</th>
                      <th className="pb-2 pr-4 font-medium">Action</th>
                      <th className="pb-2 pr-4 font-medium">Resource Type</th>
                      <th className="pb-2 pr-4 font-medium">Patient ID</th>
                      <th className="pb-2 font-medium">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/20">
                    {auditEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-navy-50/30">
                        <td className="py-3 pr-4 text-xs text-graphite-500">
                          {new Date(entry.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 pr-4">
                          <div>
                            <p className="text-xs font-medium text-navy">{entry.actorName}</p>
                            <p className="text-[10px] text-graphite-400">{entry.actorType}</p>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={actionColors[entry.action] || "bg-gray-100"}>
                            {entry.action}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-xs text-graphite-500">
                          {entry.resourceType}
                        </td>
                        <td className="py-3 pr-4 text-xs font-mono text-graphite-400">
                          {entry.patientId ? entry.patientId.slice(0, 12) + "..." : "-"}
                        </td>
                        <td className="py-3 text-xs font-mono text-graphite-400">
                          {entry.ipAddress || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Data Requests Table */}
      {activeTab === "requests" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Data Requests</CardTitle>
            <select
              value={requestStatusFilter}
              onChange={(e) => handleRequestFilterChange(e.target.value)}
              className="rounded-xl border border-navy-100/40 bg-white px-3 py-1.5 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="DENIED">Denied</option>
            </select>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No data requests found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/30 text-left text-xs text-graphite-400">
                      <th className="pb-2 pr-4 font-medium">Patient</th>
                      <th className="pb-2 pr-4 font-medium">Type</th>
                      <th className="pb-2 pr-4 font-medium">Status</th>
                      <th className="pb-2 pr-4 font-medium">Requested</th>
                      <th className="pb-2 pr-4 font-medium">Completed</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/20">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-navy-50/30">
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium text-navy">{req.patientName}</p>
                            <p className="text-[10px] text-graphite-400">{req.patientEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={requestTypeColors[req.type] || "bg-gray-100"}>
                            {req.type}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={requestStatusColors[req.status] || "bg-gray-100"}>
                            {req.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-xs text-graphite-500">
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-4 text-xs text-graphite-500">
                          {req.completedAt ? new Date(req.completedAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3">
                          {req.status === "PENDING" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleProcessRequest(req.id, "PROCESSING")}
                                className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-100"
                              >
                                Process
                              </button>
                              <button
                                onClick={() => handleProcessRequest(req.id, "DENIED")}
                                className="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100"
                              >
                                Deny
                              </button>
                            </div>
                          )}
                          {req.status === "PROCESSING" && (
                            <button
                              onClick={() => handleProcessRequest(req.id, "COMPLETED")}
                              className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
