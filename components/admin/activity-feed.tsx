"use client";

import {
  CreditCard,
  UserPlus,
  ClipboardCheck,
  Scale,
  ShoppingCart,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "subscription" | "order" | "intake" | "progress" | "alert";
  title: string;
  description: string;
  timestamp: string;
}

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  subscription: { icon: CreditCard, color: "text-teal", bg: "bg-teal-50" },
  order: { icon: ShoppingCart, color: "text-navy", bg: "bg-navy-50" },
  intake: { icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-50" },
  progress: { icon: Scale, color: "text-emerald-600", bg: "bg-emerald-50" },
  alert: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
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

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-graphite-300">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const config = typeConfig[item.type] || typeConfig.alert;
        const Icon = config.icon;
        return (
          <div key={item.id} className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-linen/30">
            <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", config.bg)}>
              <Icon className={cn("h-3.5 w-3.5", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy truncate">{item.title}</p>
              <p className="text-xs text-graphite-400 truncate">{item.description}</p>
            </div>
            <span className="shrink-0 text-[10px] text-graphite-300 whitespace-nowrap">
              {timeAgo(item.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
