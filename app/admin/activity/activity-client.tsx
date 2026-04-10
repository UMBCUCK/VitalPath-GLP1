"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard, ShoppingCart, ClipboardCheck, Scale, Shield,
  AlertCircle, AlertTriangle, Info, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedItem {
  id: string;
  type: "subscription" | "order" | "intake" | "progress" | "audit";
  title: string;
  description: string;
  timestamp: string;
}

interface AlertItem {
  id: string;
  type: string;
  severity: string;
  title: string;
  body: string | null;
  isRead: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: typeof CreditCard; color: string; bg: string; label: string }> = {
  subscription: { icon: CreditCard, color: "text-teal", bg: "bg-teal-50", label: "Subscription" },
  order: { icon: ShoppingCart, color: "text-navy", bg: "bg-navy-50", label: "Order" },
  intake: { icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-50", label: "Intake" },
  progress: { icon: Scale, color: "text-emerald-600", bg: "bg-emerald-50", label: "Progress" },
  audit: { icon: Shield, color: "text-indigo-600", bg: "bg-indigo-50", label: "Admin" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityClient({ feed, alerts }: { feed: FeedItem[]; alerts: AlertItem[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filters = [
    { key: "all", label: "All Activity" },
    { key: "subscription", label: "Subscriptions" },
    { key: "order", label: "Orders" },
    { key: "intake", label: "Intakes" },
    { key: "progress", label: "Progress" },
    { key: "audit", label: "Admin Actions" },
  ];

  const filtered = filter === "all" ? feed : feed.filter((f) => f.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Activity Feed</h2>
        <p className="text-sm text-graphite-400">Real-time platform activity stream</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter tabs */}
          <div className="flex gap-1 rounded-xl bg-linen/50 p-1 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === f.key ? "bg-white text-navy shadow-sm" : "text-graphite-400 hover:text-graphite-600"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Card>
            <CardContent className="p-0 divide-y divide-navy-100/30">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-graphite-300">No activity found</div>
              ) : (
                filtered.map((item) => {
                  const config = typeConfig[item.type] || typeConfig.audit;
                  const Icon = config.icon;
                  return (
                    <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-linen/20 transition-colors">
                      <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-navy truncate">{item.title}</p>
                          <Badge variant="secondary" className="text-[9px] shrink-0">{config.label}</Badge>
                        </div>
                        <p className="text-xs text-graphite-400 truncate">{item.description}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-graphite-300 whitespace-nowrap">{timeAgo(item.timestamp)}</span>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="py-4 text-center text-sm text-graphite-300">No active alerts</p>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => {
                    const severityConfig = {
                      CRITICAL: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
                      WARNING: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
                      INFO: { icon: Info, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
                    };
                    const sc = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.INFO;
                    const SevIcon = sc.icon;
                    return (
                      <div key={alert.id} className={cn("flex items-start gap-2.5 rounded-xl border p-3", sc.border, sc.bg)}>
                        <SevIcon className={cn("h-4 w-4 mt-0.5 shrink-0", sc.color)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-navy">{alert.title}</p>
                          {alert.body && <p className="text-[10px] text-graphite-400 mt-0.5 line-clamp-2">{alert.body}</p>}
                          <p className="text-[9px] text-graphite-300 mt-1">{timeAgo(alert.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
