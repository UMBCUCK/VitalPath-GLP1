"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

interface Credential {
  id: string;
  licenseNumber: string;
  licenseState: string;
  licenseType: string;
  deaNumber: string | null;
  expiresAt: string;
  isActive: boolean;
}

interface Provider {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: string;
  credentials: Credential[];
}

function getCredentialStatus(expiresAt: string): "active" | "expiring" | "expired" {
  const now = new Date();
  const expires = new Date(expiresAt);
  const sixtyDaysFromNow = new Date();
  sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);

  if (expires < now) return "expired";
  if (expires < sixtyDaysFromNow) return "expiring";
  return "active";
}

export function ProvidersClient({ providers }: { providers: Provider[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const totalCredentials = providers.reduce(
    (sum, p) => sum + p.credentials.length,
    0
  );
  const expiringCount = providers.reduce(
    (sum, p) =>
      sum +
      p.credentials.filter(
        (c) => getCredentialStatus(c.expiresAt) === "expiring"
      ).length,
    0
  );
  const expiredCount = providers.reduce(
    (sum, p) =>
      sum +
      p.credentials.filter(
        (c) => getCredentialStatus(c.expiresAt) === "expired"
      ).length,
    0
  );

  const filtered = providers.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const name = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
    return name.includes(q) || p.email.toLowerCase().includes(q);
  });

  function getProviderStatus(provider: Provider): "active" | "expiring" | "expired" | "none" {
    if (provider.credentials.length === 0) return "none";
    const hasExpired = provider.credentials.some(
      (c) => getCredentialStatus(c.expiresAt) === "expired"
    );
    if (hasExpired) return "expired";
    const hasExpiring = provider.credentials.some(
      (c) => getCredentialStatus(c.expiresAt) === "expiring"
    );
    if (hasExpiring) return "expiring";
    return "active";
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">
          Provider Credentials
        </h2>
        <p className="text-sm text-graphite-400">
          Manage provider licenses, DEA numbers, and credential expirations
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Providers</p>
              <p className="text-xl font-bold text-navy">{providers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-graphite-400">Credentials</p>
              <p className="text-xl font-bold text-navy">{totalCredentials}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={expiringCount > 0 ? "border-amber-200 bg-amber-50/30" : ""}>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xs text-graphite-400">Expiring Soon</p>
              <p className="text-xl font-bold text-navy">{expiringCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={expiredCount > 0 ? "border-red-200 bg-red-50/30" : ""}>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-xs text-graphite-400">Expired</p>
              <p className="text-xl font-bold text-navy">{expiredCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2 max-w-xs">
        <Search className="h-4 w-4 text-graphite-400" />
        <input
          type="text"
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm outline-none text-navy placeholder:text-graphite-300"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-6 py-3 text-left font-medium text-graphite-400">
                    Provider
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Licensed States
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Credentials
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-sm text-graphite-300"
                    >
                      No providers found
                    </td>
                  </tr>
                ) : (
                  filtered.map((provider) => {
                    const status = getProviderStatus(provider);
                    const isExpanded = expandedId === provider.id;

                    return (
                      <tr key={provider.id} className="group">
                        <td colSpan={6} className="p-0">
                          <div
                            className={`hover:bg-navy-50/20 transition-colors ${
                              isExpanded ? "bg-navy-50/10" : ""
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex-1 grid grid-cols-6 items-center">
                                <div className="px-6 py-3">
                                  <p className="font-medium text-navy">
                                    {provider.firstName} {provider.lastName}
                                  </p>
                                </div>
                                <div className="px-4 py-3 text-graphite-500">
                                  {provider.email}
                                </div>
                                <div className="px-4 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {provider.credentials.length > 0 ? (
                                      provider.credentials.map((c) => (
                                        <Badge
                                          key={c.id}
                                          variant={
                                            getCredentialStatus(c.expiresAt) ===
                                            "expired"
                                              ? "destructive"
                                              : getCredentialStatus(
                                                  c.expiresAt
                                                ) === "expiring"
                                              ? "warning"
                                              : "secondary"
                                          }
                                          className="text-[10px] px-1.5 py-0.5"
                                        >
                                          {c.licenseState}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-xs text-graphite-300">
                                        None
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="px-4 py-3 text-graphite-500">
                                  {provider.credentials.length}
                                </div>
                                <div className="px-4 py-3">
                                  <Badge
                                    variant={
                                      status === "expired"
                                        ? "destructive"
                                        : status === "expiring"
                                        ? "warning"
                                        : status === "active"
                                        ? "success"
                                        : "secondary"
                                    }
                                  >
                                    {status === "expired"
                                      ? "Expired"
                                      : status === "expiring"
                                      ? "Expiring Soon"
                                      : status === "active"
                                      ? "Active"
                                      : "No Credentials"}
                                  </Badge>
                                </div>
                                <div className="px-4 py-3 text-right">
                                  <button
                                    onClick={() =>
                                      setExpandedId(
                                        isExpanded ? null : provider.id
                                      )
                                    }
                                    className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>

                            {isExpanded &&
                              provider.credentials.length > 0 && (
                                <div className="border-t border-navy-100/30 bg-navy-50/20 px-6 py-4">
                                  <p className="mb-3 text-xs font-semibold text-graphite-400 uppercase tracking-wide">
                                    Credential Details
                                  </p>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="border-b border-navy-100/30">
                                          <th className="px-3 py-2 text-left font-medium text-graphite-400">
                                            State
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-graphite-400">
                                            License #
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-graphite-400">
                                            Type
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-graphite-400">
                                            DEA #
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-graphite-400">
                                            Expires
                                          </th>
                                          <th className="px-3 py-2 text-left font-medium text-graphite-400">
                                            Status
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-navy-100/20">
                                        {provider.credentials.map((cred) => {
                                          const credStatus =
                                            getCredentialStatus(
                                              cred.expiresAt
                                            );
                                          return (
                                            <tr key={cred.id}>
                                              <td className="px-3 py-2 font-medium text-navy">
                                                {cred.licenseState}
                                              </td>
                                              <td className="px-3 py-2 text-graphite-500 font-mono">
                                                {cred.licenseNumber}
                                              </td>
                                              <td className="px-3 py-2">
                                                <Badge
                                                  variant="secondary"
                                                  className="text-[10px] px-1.5 py-0.5"
                                                >
                                                  {cred.licenseType}
                                                </Badge>
                                              </td>
                                              <td className="px-3 py-2 text-graphite-500 font-mono">
                                                {cred.deaNumber || (
                                                  <span className="text-graphite-300">
                                                    --
                                                  </span>
                                                )}
                                              </td>
                                              <td className="px-3 py-2 text-graphite-500">
                                                {new Date(
                                                  cred.expiresAt
                                                ).toLocaleDateString()}
                                              </td>
                                              <td className="px-3 py-2">
                                                <Badge
                                                  variant={
                                                    !cred.isActive
                                                      ? "secondary"
                                                      : credStatus ===
                                                        "expired"
                                                      ? "destructive"
                                                      : credStatus ===
                                                        "expiring"
                                                      ? "warning"
                                                      : "success"
                                                  }
                                                >
                                                  {!cred.isActive
                                                    ? "Inactive"
                                                    : credStatus === "expired"
                                                    ? "Expired"
                                                    : credStatus === "expiring"
                                                    ? "Expiring Soon"
                                                    : "Active"}
                                                </Badge>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                          </div>
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
