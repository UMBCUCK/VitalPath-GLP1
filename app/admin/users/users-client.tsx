"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Users, Shield, HeadsetIcon, UserPlus, Clock, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────

interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
  avatarUrl: string | null;
}

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
    role: string;
  };
}

interface Props {
  initialUsers: AdminUser[];
  initialActivity: AuditEntry[];
}

// ── Helpers ─────────────────────────────────────────────────

const actionColor = (action: string) => {
  if (action.startsWith("CREATE")) return "text-emerald-600 bg-emerald-50";
  if (action.startsWith("DELETE")) return "text-red-600 bg-red-50";
  if (action.startsWith("STATUS_APPROVED")) return "text-emerald-600 bg-emerald-50";
  if (action.startsWith("STATUS_REJECTED")) return "text-red-600 bg-red-50";
  return "text-navy bg-navy-50";
};

const formatAction = (action: string) =>
  action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

// ── Component ───────────────────────────────────────────────

export function UsersClient({ initialUsers, initialActivity }: Props) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [activity] = useState<AuditEntry[]>(initialActivity);
  const [page, setPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "SUPPORT" as "ADMIN" | "SUPPORT",
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const supportCount = users.filter((u) => u.role === "SUPPORT").length;
  const limit = 25;

  // ── Create new admin user ─────────────────────────────────
  const handleCreate = async () => {
    setError("");
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create user");
        return;
      }
      setUsers((prev) => [data.user, ...prev]);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "SUPPORT",
      });
      setShowCreateForm(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // ── User table columns ────────────────────────────────────
  const userColumns: ColumnDef<AdminUser>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy">
            {(row.firstName?.[0] || "").toUpperCase()}
            {(row.lastName?.[0] || "").toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-navy">
              {row.firstName || ""} {row.lastName || ""}
            </p>
            <p className="text-xs text-graphite-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (row) => (
        <Badge
          variant={row.role === "ADMIN" ? "destructive" : "secondary"}
          className="gap-1"
        >
          {row.role === "ADMIN" ? (
            <Shield className="h-3 w-3" />
          ) : (
            <HeadsetIcon className="h-3 w-3" />
          )}
          {row.role}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // ── Activity log columns ──────────────────────────────────
  const activityColumns: ColumnDef<AuditEntry>[] = [
    {
      key: "user",
      header: "User",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-navy">
            {row.user.firstName || ""} {row.user.lastName || ""}
          </p>
          <p className="text-[10px] text-graphite-400">{row.user.email}</p>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
            actionColor(row.action)
          )}
        >
          {formatAction(row.action)}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      render: (row) => (
        <div>
          <p className="text-sm text-graphite-500">{row.entity}</p>
          {row.entityId && (
            <p className="text-[10px] text-graphite-300 font-mono">
              {row.entityId.length > 16
                ? `${row.entityId.slice(0, 16)}...`
                : row.entityId}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "When",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-xs text-graphite-500">
            {formatTimeAgo(row.createdAt)}
          </p>
          <p className="text-[10px] text-graphite-300">
            {new Date(row.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Admin Users</h2>
          <p className="text-sm text-graphite-400">
            Manage team members and monitor admin activity
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <UserPlus className="h-4 w-4" /> New Admin User
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          title="Total Team"
          value={String(users.length)}
          icon={Users}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Admins"
          value={String(adminCount)}
          icon={Shield}
          iconColor="text-red-500"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Support"
          value={String(supportCount)}
          icon={HeadsetIcon}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-teal-200 bg-teal-50/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-teal" />
              Create New Admin User
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="Smith"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="jane@naturesjourneyhealth.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "ADMIN" | "SUPPORT",
                    })
                  }
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
                >
                  <option value="SUPPORT">Support</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <div className="flex gap-2">
                  <Button onClick={handleCreate} disabled={creating}>
                    {creating ? "Creating..." : "Create User"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Users Table */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-navy flex items-center gap-2">
          <Users className="h-5 w-5 text-teal" />
          Team Members
        </h3>
        <DataTable
          data={users}
          columns={userColumns}
          total={users.length}
          page={page}
          limit={limit}
          onPageChange={setPage}
          getRowId={(r) => r.id}
          emptyMessage="No admin users found"
        />
      </div>

      {/* Activity Log */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-navy flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal" />
          Recent Admin Activity
        </h3>
        {activity.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-graphite-300">
              No admin activity recorded yet
            </CardContent>
          </Card>
        ) : (
          <DataTable
            data={activity}
            columns={activityColumns}
            total={activity.length}
            page={activityPage}
            limit={limit}
            onPageChange={setActivityPage}
            getRowId={(r) => r.id}
            emptyMessage="No activity records found"
          />
        )}
      </div>
    </div>
  );
}
