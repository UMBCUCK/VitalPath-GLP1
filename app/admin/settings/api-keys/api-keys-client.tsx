"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Key,
  Plus,
  Copy,
  AlertTriangle,
  Shield,
  Activity,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt: string | null;
  usageCount: number;
  expiresAt: string | null;
  createdBy: string;
  createdAt: string;
}

interface Props {
  initialKeys: ApiKeyItem[];
}

const AVAILABLE_SCOPES = [
  { value: "customers:read", label: "Customers (Read)" },
  { value: "orders:read", label: "Orders (Read)" },
  { value: "subscriptions:read", label: "Subscriptions (Read)" },
  { value: "analytics:read", label: "Analytics (Read)" },
  { value: "products:read", label: "Products (Read)" },
];

// ── Component ───────────────────────────────────────────────

export function ApiKeysClient({ initialKeys }: Props) {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyRevealed, setNewKeyRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null);

  // Create form state
  const [formName, setFormName] = useState("");
  const [formScopes, setFormScopes] = useState<string[]>([]);
  const [formRateLimit, setFormRateLimit] = useState("1000");
  const [formExpiresAt, setFormExpiresAt] = useState("");

  const limit = 50;

  // Stats
  const activeKeys = keys.filter((k) => k.isActive).length;
  const totalKeys = keys.length;
  const totalUsage = keys.reduce((acc, k) => acc + k.usageCount, 0);

  // Filtered keys
  const filtered = keys.filter((k) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      k.name.toLowerCase().includes(q) ||
      k.keyPrefix.toLowerCase().includes(q) ||
      k.scopes.some((s) => s.toLowerCase().includes(q))
    );
  });

  // ── Time ago helper ───────────────────────────────────────
  function timeAgo(dateStr: string | null): string {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  // ── Key status helper ─────────────────────────────────────
  function getKeyStatus(key: ApiKeyItem): {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  } {
    if (!key.isActive) {
      return {
        label: "Revoked",
        variant: "destructive",
        className: "bg-red-100 text-red-700 border-red-200",
      };
    }
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
      return {
        label: "Expired",
        variant: "secondary",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      };
    }
    return {
      label: "Active",
      variant: "default",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  }

  // ── Create API Key ────────────────────────────────────────
  async function handleCreate() {
    if (!formName.trim() || formScopes.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          scopes: formScopes,
          rateLimit: parseInt(formRateLimit) || 1000,
          expiresAt: formExpiresAt || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.key) {
        setNewKeyRevealed(data.key.fullKey);
        // Add to local list
        setKeys((prev) => [
          {
            id: data.key.id,
            name: data.key.name,
            keyPrefix: data.key.keyPrefix,
            scopes: data.key.scopes,
            rateLimit: data.key.rateLimit,
            isActive: true,
            lastUsedAt: null,
            usageCount: 0,
            expiresAt: data.key.expiresAt,
            createdBy: "",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        // Reset form
        setFormName("");
        setFormScopes([]);
        setFormRateLimit("1000");
        setFormExpiresAt("");
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Revoke API Key ────────────────────────────────────────
  async function handleRevoke(id: string) {
    try {
      const res = await fetch(`/api/admin/api-keys?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setKeys((prev) =>
          prev.map((k) => (k.id === id ? { ...k, isActive: false } : k))
        );
      }
    } finally {
      setRevokeConfirm(null);
    }
  }

  // ── Copy to clipboard ─────────────────────────────────────
  function copyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Toggle scope ──────────────────────────────────────────
  function toggleScope(scope: string) {
    setFormScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  }

  // ── Column definitions ────────────────────────────────────
  const columns: ColumnDef<ApiKeyItem>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-navy">{row.name}</span>
      ),
    },
    {
      key: "keyPrefix",
      header: "Key Prefix",
      render: (row) => (
        <code className="rounded bg-navy-50 px-2 py-0.5 font-mono text-xs text-graphite-600">
          {row.keyPrefix}...
        </code>
      ),
    },
    {
      key: "scopes",
      header: "Scopes",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.scopes.map((scope) => (
            <Badge
              key={scope}
              variant="secondary"
              className="text-[10px] font-mono"
            >
              {scope}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "rateLimit",
      header: "Rate Limit",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-500">
          {row.rateLimit.toLocaleString()}/hr
        </span>
      ),
    },
    {
      key: "usageCount",
      header: "Usage",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-navy">
          {row.usageCount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "lastUsedAt",
      header: "Last Used",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {timeAgo(row.lastUsedAt)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const status = getKeyStatus(row);
        return (
          <Badge variant={status.variant} className={cn("text-[10px]", status.className)}>
            {status.label}
          </Badge>
        );
      },
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) =>
        row.isActive ? (
          revokeConfirm === row.id ? (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRevoke(row.id);
                }}
              >
                <Check className="h-3 w-3 mr-1" />
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setRevokeConfirm(null);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                setRevokeConfirm(row.id);
              }}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Revoke
            </Button>
          )
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">API Keys</h2>
          <p className="text-sm text-graphite-400">
            Manage programmatic access to the Nature's Journey API
          </p>
        </div>
        <Button
          className="gap-2 bg-navy hover:bg-navy-600"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setNewKeyRevealed(null);
          }}
        >
          <Plus className="h-4 w-4" />
          Create Key
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          title="Total Keys"
          value={String(totalKeys)}
          icon={Key}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Active Keys"
          value={String(activeKeys)}
          icon={Shield}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Total Requests"
          value={totalUsage.toLocaleString()}
          icon={Activity}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
      </div>

      {/* Revealed New Key */}
      {newKeyRevealed && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  Save your API key now
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  This key will only be displayed once. Copy and store it
                  securely. It cannot be retrieved after you close this panel.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <code className="flex-1 rounded-lg border border-amber-300 bg-white px-4 py-2.5 font-mono text-sm text-navy break-all">
                    {newKeyRevealed}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-1.5"
                    onClick={() => copyKey(newKeyRevealed)}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => setNewKeyRevealed(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Form */}
      {showCreateForm && !newKeyRevealed && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-navy mb-4">
              Create New API Key
            </h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-graphite-500 mb-1 block">
                  Key Name
                </label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Production Backend, Analytics Dashboard"
                  className="max-w-md"
                />
              </div>

              {/* Scopes */}
              <div>
                <label className="text-xs font-medium text-graphite-500 mb-2 block">
                  Scopes
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SCOPES.map((scope) => (
                    <button
                      key={scope.value}
                      type="button"
                      onClick={() => toggleScope(scope.value)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                        formScopes.includes(scope.value)
                          ? "border-teal bg-teal-50 text-teal-800"
                          : "border-navy-100 bg-white text-graphite-500 hover:border-navy-200"
                      )}
                    >
                      {formScopes.includes(scope.value) && (
                        <Check className="inline h-3 w-3 mr-1" />
                      )}
                      {scope.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate Limit & Expiry */}
              <div className="flex gap-4">
                <div>
                  <label className="text-xs font-medium text-graphite-500 mb-1 block">
                    Rate Limit (req/hr)
                  </label>
                  <Input
                    type="number"
                    value={formRateLimit}
                    onChange={(e) => setFormRateLimit(e.target.value)}
                    className="w-36"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-graphite-500 mb-1 block">
                    Expiry Date (optional)
                  </label>
                  <Input
                    type="date"
                    value={formExpiresAt}
                    onChange={(e) => setFormExpiresAt(e.target.value)}
                    className="w-48"
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  className="gap-2 bg-navy hover:bg-navy-600"
                  onClick={handleCreate}
                  disabled={loading || !formName.trim() || formScopes.length === 0}
                >
                  {loading ? "Creating..." : "Create API Key"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DataTable */}
      <DataTable
        data={filtered}
        columns={columns}
        total={filtered.length}
        page={page}
        limit={limit}
        search={search}
        onPageChange={setPage}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(1);
        }}
        searchPlaceholder="Search by name, prefix, or scope..."
        getRowId={(r) => r.id}
        emptyMessage="No API keys created yet"
      />
    </div>
  );
}
