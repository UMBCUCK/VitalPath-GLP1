"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminAlertData {
  id: string;
  type: string;
  severity: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const severityConfig = {
  CRITICAL: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
  WARNING: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  INFO: { icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
};

export function AdminNotificationBell() {
  const [alerts, setAlerts] = useState<AdminAlertData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/admin/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Silently fail
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dismiss = async (id: string) => {
    await fetch("/api/admin/alerts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "dismiss" }),
    });
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) {
            // Mark all as read
            fetch("/api/admin/alerts", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "read-all" }),
            });
            setUnreadCount(0);
          }
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-graphite-400 transition-colors hover:bg-navy-50 hover:text-navy"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-navy-100/60 bg-white shadow-premium">
          <div className="flex items-center justify-between border-b border-navy-100/40 px-4 py-3">
            <h3 className="text-sm font-semibold text-navy">Notifications</h3>
            {alerts.length > 0 && (
              <span className="text-xs text-graphite-400">{alerts.length} alerts</span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="py-8 text-center text-sm text-graphite-300">
                No notifications
              </div>
            ) : (
              alerts.map((alert) => {
                const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.INFO;
                const Icon = config.icon;
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex gap-3 border-b border-navy-100/20 px-4 py-3 last:border-0",
                      !alert.isRead && "bg-navy-50/30"
                    )}
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{alert.title}</p>
                      {alert.body && (
                        <p className="mt-0.5 text-xs text-graphite-400 line-clamp-2">{alert.body}</p>
                      )}
                      <p className="mt-1 text-[10px] text-graphite-300">{timeAgo(alert.createdAt)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(alert.id);
                      }}
                      className="shrink-0 text-graphite-300 hover:text-graphite-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
