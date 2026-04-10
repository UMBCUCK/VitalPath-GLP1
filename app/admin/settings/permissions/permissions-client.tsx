"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, UserCog, Info } from "lucide-react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────

type AdminRole = "SUPER_ADMIN" | "MANAGER" | "EDITOR" | "VIEWER";

interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  adminRole: AdminRole;
  pages: string[] | null;
  actions: string[] | null;
  permissionId: string | null;
}

const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "EDITOR", label: "Editor" },
  { value: "VIEWER", label: "Viewer" },
];

const ROLE_BADGE_VARIANT: Record<AdminRole, "destructive" | "default" | "secondary" | "outline"> = {
  SUPER_ADMIN: "destructive",
  MANAGER: "default",
  EDITOR: "secondary",
  VIEWER: "outline",
};

const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Full access to everything including system settings and user management",
  MANAGER: "Read and write access to all content and operations, except system settings",
  EDITOR: "Read and write access to content pages (customers, blog, recipes, products)",
  VIEWER: "Read-only access to all pages, no editing or deletion",
};

const ALL_PAGES = [
  "dashboard", "analytics", "customers", "products", "claims",
  "coupons", "meal-plans", "recipes", "referrals", "states",
  "blog", "experiments", "settings",
];

// ─── Component ──────────────────────────────────────────────

export function PermissionsClient({
  admins: initialAdmins,
  currentUserId,
}: {
  admins: AdminUser[];
  currentUserId: string;
}) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [saving, setSaving] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const updateRole = useCallback(async (userId: string, role: AdminRole) => {
    setSaving(userId);
    try {
      const res = await fetch("/api/admin/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      if (res.ok) {
        setAdmins((prev) =>
          prev.map((a) => (a.id === userId ? { ...a, adminRole: role } : a))
        );
      }
    } finally {
      setSaving(null);
    }
  }, []);

  const updatePages = useCallback(async (userId: string, pages: string[]) => {
    const admin = admins.find((a) => a.id === userId);
    if (!admin) return;

    setSaving(userId);
    try {
      const res = await fetch("/api/admin/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: admin.adminRole,
          pages: pages.length > 0 ? pages : null,
        }),
      });

      if (res.ok) {
        setAdmins((prev) =>
          prev.map((a) =>
            a.id === userId ? { ...a, pages: pages.length > 0 ? pages : null } : a
          )
        );
      }
    } finally {
      setSaving(null);
    }
  }, [admins]);

  const togglePage = useCallback(
    (userId: string, page: string) => {
      const admin = admins.find((a) => a.id === userId);
      if (!admin || admin.adminRole === "SUPER_ADMIN") return;

      const current = admin.pages || [];
      const updated = current.includes(page)
        ? current.filter((p) => p !== page)
        : [...current, page];
      updatePages(userId, updated);
    },
    [admins, updatePages]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal" />
            Admin Permissions
          </h2>
          <p className="text-sm text-graphite-400">
            Manage access levels for admin team members
          </p>
        </div>
        <Link href="/admin/settings">
          <Button variant="outline" size="sm">
            Back to Settings
          </Button>
        </Link>
      </div>

      {/* Role legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-graphite-400" />
            Role Hierarchy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-4">
            {ROLE_OPTIONS.map((r) => (
              <div
                key={r.value}
                className="rounded-xl border border-navy-100/40 p-3"
              >
                <Badge variant={ROLE_BADGE_VARIANT[r.value]} className="mb-2">
                  {r.label}
                </Badge>
                <p className="text-[11px] text-graphite-400 leading-relaxed">
                  {ROLE_DESCRIPTIONS[r.value]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin users table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserCog className="h-4 w-4 text-teal" />
            Admin Users ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Page Access
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {admins.map((admin) => {
                  const name =
                    [admin.firstName, admin.lastName]
                      .filter(Boolean)
                      .join(" ") || admin.email;
                  const isSelf = admin.id === currentUserId;
                  const isSuperAdmin = admin.adminRole === "SUPER_ADMIN";

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-linen/20 transition-colors"
                    >
                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal font-bold text-sm">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-navy">
                              {name}
                              {isSelf && (
                                <span className="ml-1.5 text-[10px] text-graphite-300">
                                  (you)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-graphite-400">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role dropdown */}
                      <td className="px-4 py-3">
                        <div className="relative">
                          <select
                            value={admin.adminRole}
                            onChange={(e) =>
                              updateRole(
                                admin.id,
                                e.target.value as AdminRole
                              )
                            }
                            disabled={saving === admin.id || isSelf}
                            className="appearance-none rounded-lg border border-navy-100/60 bg-white px-3 py-1.5 pr-8 text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-teal/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            onMouseEnter={() => setTooltip(admin.id)}
                            onMouseLeave={() => setTooltip(null)}
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                          {tooltip === admin.id && (
                            <div className="absolute left-0 top-full mt-1 z-10 w-56 rounded-lg border border-navy-100/40 bg-white p-2 shadow-lg text-[10px] text-graphite-400">
                              {ROLE_DESCRIPTIONS[admin.adminRole]}
                            </div>
                          )}
                        </div>
                        {saving === admin.id && (
                          <span className="text-[10px] text-teal ml-2">
                            Saving...
                          </span>
                        )}
                      </td>

                      {/* Page access chips */}
                      <td className="px-4 py-3">
                        {isSuperAdmin ? (
                          <span className="text-xs text-graphite-300 italic">
                            All pages (unrestricted)
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {ALL_PAGES.map((page) => {
                              const active = admin.pages
                                ? admin.pages.includes(page)
                                : true;
                              return (
                                <button
                                  key={page}
                                  onClick={() => togglePage(admin.id, page)}
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                    active
                                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                                      : "bg-navy-50/50 text-graphite-300 border border-navy-100/40"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* Joined date */}
                      <td className="px-4 py-3 text-xs text-graphite-400">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
