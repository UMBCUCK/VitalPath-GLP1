"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell({ initialCount }: { initialCount: number }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function loadNotifications() {
    if (loaded) return;
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setLoaded(true);
    }
  }

  function toggleOpen() {
    if (!open) loadNotifications();
    setOpen(!open);
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: "all" }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case "REFILL_REMINDER": return "💊";
      case "MILESTONE": return "🎉";
      case "CHECK_IN": return "📋";
      case "SHIPMENT_UPDATE": return "📦";
      case "PROVIDER_MESSAGE": return "🩺";
      case "OFFER": return "🎁";
      default: return "🔔";
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        className="relative rounded-lg p-2 text-graphite-400 hover:bg-navy-50 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-navy-100/60 bg-white shadow-premium-xl z-50" role="menu">
          <div className="flex items-center justify-between border-b border-navy-100/40 px-4 py-3">
            <p className="text-sm font-bold text-navy">Notifications</p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-teal hover:underline">
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-graphite-400 hover:text-navy">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-graphite-200" />
                <p className="mt-2 text-sm text-graphite-400">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <a
                  key={n.id}
                  href={n.link || "#"}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-navy-50/50",
                    !n.isRead && "bg-teal-50/20"
                  )}
                  role="menuitem"
                >
                  <span className="mt-0.5 text-base">{typeIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", !n.isRead ? "font-semibold text-navy" : "text-graphite-600")}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mt-0.5 text-xs text-graphite-400 line-clamp-2">{n.body}</p>
                    )}
                    <p className="mt-1 text-[10px] text-graphite-300">
                      {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  {!n.isRead && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal" />}
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
