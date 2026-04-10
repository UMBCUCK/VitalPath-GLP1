"use client";

import { useState, useCallback } from "react";
import {
  Search,
  Loader2,
  Clock,
  ArrowRight,
  Users,
  CreditCard,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────

interface SavedQueryItem {
  id: string;
  query: string;
  resultCount: number | null;
  createdAt: Date | string;
}

interface ParsedInfo {
  entity: string;
  description: string;
}

interface QueryResultRow {
  [key: string]: unknown;
}

// ─── Example queries ───────────────────────────────────────────

const exampleQueries = [
  {
    text: "patients with health score below 40",
    icon: Users,
    description: "Find at-risk patients",
  },
  {
    text: "patients who lost more than 10 lbs",
    icon: Users,
    description: "High-performing patients",
  },
  {
    text: "active subscriptions over $300",
    icon: CreditCard,
    description: "Premium subscribers",
  },
  {
    text: "orders in last 30 days",
    icon: ShoppingCart,
    description: "Recent order activity",
  },
  {
    text: "patients inactive for 14 days",
    icon: Users,
    description: "Re-engagement targets",
  },
];

// ─── Column configs for each entity ───────────────────────────

function getEntityIcon(entity: string) {
  switch (entity) {
    case "patients":
      return Users;
    case "subscriptions":
      return CreditCard;
    case "orders":
      return ShoppingCart;
    default:
      return Users;
  }
}

function formatCellValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return "--";
  if (key === "total" || key === "monthlyAmount") return formatPrice(value as number);
  if (key === "weightLoss") return `${value} lbs`;
  if (key === "healthScore" || key === "churnRisk") return `${value}`;
  if (key === "joinedAt" || key === "createdAt" || key === "periodEnd") {
    return new Date(value as string).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return String(value);
}

function getDisplayColumns(entity: string): { key: string; label: string }[] {
  switch (entity) {
    case "patients":
      return [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "healthScore", label: "Health Score" },
        { key: "churnRisk", label: "Churn Risk" },
        { key: "subscriptionStatus", label: "Status" },
        { key: "weightLoss", label: "Weight Loss" },
        { key: "state", label: "State" },
      ];
    case "subscriptions":
      return [
        { key: "customer", label: "Customer" },
        { key: "plan", label: "Plan" },
        { key: "monthlyAmount", label: "Monthly" },
        { key: "status", label: "Status" },
        { key: "interval", label: "Interval" },
        { key: "createdAt", label: "Started" },
      ];
    case "orders":
      return [
        { key: "customer", label: "Customer" },
        { key: "items", label: "Items" },
        { key: "total", label: "Total" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Date" },
      ];
    default:
      return [];
  }
}

function statusBadgeVariant(
  status: string
): "success" | "warning" | "destructive" | "default" | "secondary" {
  switch (status) {
    case "ACTIVE":
    case "DELIVERED":
      return "success";
    case "PAST_DUE":
    case "PENDING":
      return "warning";
    case "CANCELED":
    case "EXPIRED":
    case "REFUNDED":
      return "destructive";
    case "TRIALING":
    case "PROCESSING":
    case "SHIPPED":
      return "default";
    default:
      return "secondary";
  }
}

// ─── Component ─────────────────────────────────────────────────

export function QueryClient({
  recentQueries: initialRecent,
}: {
  recentQueries: SavedQueryItem[];
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedInfo | null>(null);
  const [results, setResults] = useState<QueryResultRow[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [recentQueries, setRecentQueries] = useState(initialRecent);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setParsed(null);
    setResults([]);
    setCount(null);

    try {
      const res = await fetch("/api/admin/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Query failed");
      }

      const data = await res.json();
      setParsed(data.parsed);
      setResults(data.results);
      setCount(data.count);

      // Refresh recent queries
      const historyRes = await fetch("/api/admin/query");
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setRecentQueries(historyData.recentQueries);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery(query);
  };

  const handleExampleClick = (text: string) => {
    setQuery(text);
    executeQuery(text);
  };

  const handleRecentClick = (q: string) => {
    setQuery(q);
    executeQuery(q);
  };

  const columns = parsed ? getDisplayColumns(parsed.entity) : [];
  const EntityIcon = parsed ? getEntityIcon(parsed.entity) : Users;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Query Engine</h2>
        <p className="text-sm text-graphite-400">
          Search your data using natural language
        </p>
      </div>

      {/* Search input */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-300" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything... e.g., 'patients with churn risk over 70'"
                  className="pl-10 text-base h-12"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !query.trim()}
                className="h-12 px-6"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Parsed description */}
      {parsed && (
        <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3">
          <EntityIcon className="h-4 w-4 text-teal" />
          <span className="text-sm text-graphite-500">Parsed as:</span>
          <span className="text-sm font-medium text-navy">
            {parsed.description}
          </span>
          <Badge variant="default" className="ml-auto">
            {count} result{count !== 1 ? "s" : ""}
          </Badge>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Results */}
        <div className="lg:col-span-3">
          {results.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-navy-100/40 bg-linen/30">
                        {columns.map((col) => (
                          <th
                            key={col.key}
                            className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-100/30">
                      {results.map((row, i) => (
                        <tr
                          key={(row.id as string) || i}
                          className="transition-colors hover:bg-linen/20"
                        >
                          {columns.map((col) => (
                            <td key={col.key} className="px-4 py-3">
                              {col.key === "subscriptionStatus" ||
                              col.key === "status" ? (
                                <Badge
                                  variant={statusBadgeVariant(
                                    String(row[col.key] ?? "")
                                  )}
                                >
                                  {String(row[col.key] ?? "--")}
                                </Badge>
                              ) : col.key === "healthScore" ||
                                col.key === "churnRisk" ? (
                                <span
                                  className={
                                    col.key === "churnRisk" &&
                                    (row[col.key] as number) > 70
                                      ? "font-semibold text-red-600"
                                      : col.key === "healthScore" &&
                                        (row[col.key] as number) < 40
                                      ? "font-semibold text-amber-600"
                                      : "text-navy"
                                  }
                                >
                                  {formatCellValue(col.key, row[col.key])}
                                </span>
                              ) : (
                                <span className="text-navy">
                                  {formatCellValue(col.key, row[col.key])}
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : count !== null && count === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-graphite-400">
                  No results found for this query.
                </p>
              </CardContent>
            </Card>
          ) : !loading && count === null ? (
            /* Example queries */
            <div>
              <h3 className="mb-3 text-sm font-semibold text-graphite-400 uppercase tracking-wider">
                Try an example
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {exampleQueries.map((ex) => (
                  <button
                    key={ex.text}
                    onClick={() => handleExampleClick(ex.text)}
                    className="flex items-start gap-3 rounded-xl border border-navy-100/60 bg-white p-4 text-left transition-all hover:border-teal/40 hover:shadow-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50">
                      <ex.icon className="h-4 w-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {ex.text}
                      </p>
                      <p className="mt-0.5 text-xs text-graphite-400">
                        {ex.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Loading skeleton */}
          {loading && (
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-4 border-b border-navy-100/30 px-4 py-4 last:border-0"
                    >
                      <div className="h-4 w-32 animate-pulse rounded bg-navy-50" />
                      <div className="h-4 w-48 animate-pulse rounded bg-navy-50" />
                      <div className="h-4 w-20 animate-pulse rounded bg-navy-50" />
                      <div className="h-4 w-16 animate-pulse rounded bg-navy-50" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent queries sidebar */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-graphite-400" />
                Recent Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentQueries.length === 0 ? (
                <p className="py-4 text-center text-xs text-graphite-300">
                  No queries yet
                </p>
              ) : (
                recentQueries.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleRecentClick(q.query)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-linen/30"
                  >
                    <Search className="h-3 w-3 shrink-0 text-graphite-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-navy">
                        {q.query}
                      </p>
                      <p className="text-[10px] text-graphite-300">
                        {q.resultCount !== null
                          ? `${q.resultCount} results`
                          : ""}
                        {" \u00b7 "}
                        {new Date(q.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <ArrowRight className="h-3 w-3 shrink-0 text-graphite-300" />
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
