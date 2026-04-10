"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface LiveActivityIndicatorProps {
  onActivityEvent?: (data: unknown) => void;
  onCountsUpdate?: (counts: { unreadNotifications: number; activeAlerts: number }) => void;
  className?: string;
}

export function LiveActivityIndicator({
  onActivityEvent,
  onCountsUpdate,
  className,
}: LiveActivityIndicatorProps) {
  const [status, setStatus] = useState<"connected" | "connecting" | "disconnected">("connecting");
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxRetries = 10;
  const baseDelay = 1000; // 1 second

  const connect = useCallback(() => {
    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setStatus("connecting");

    const es = new EventSource("/api/admin/events/stream");
    eventSourceRef.current = es;

    es.onopen = () => {
      setStatus("connected");
      retryCountRef.current = 0;
    };

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "activity" && onActivityEvent) {
          onActivityEvent(parsed.data);
        }

        if (parsed.type === "counts" && onCountsUpdate) {
          onCountsUpdate(parsed.data);
        }
      } catch {
        // Ignore malformed events
      }
    };

    es.onerror = () => {
      es.close();
      setStatus("disconnected");

      // Exponential backoff reconnect
      if (retryCountRef.current < maxRetries) {
        const delay = Math.min(
          baseDelay * Math.pow(2, retryCountRef.current),
          30000 // Max 30 seconds
        );
        retryCountRef.current++;

        retryTimerRef.current = setTimeout(() => {
          connect();
        }, delay);
      }
    };
  }, [onActivityEvent, onCountsUpdate]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, [connect]);

  const statusColors: Record<string, string> = {
    connected: "bg-emerald-500",
    connecting: "bg-amber-400 animate-pulse",
    disconnected: "bg-gray-300",
  };

  const statusLabels: Record<string, string> = {
    connected: "Live",
    connecting: "Reconnecting...",
    disconnected: "Offline",
  };

  return (
    <div
      className={cn("group relative inline-flex items-center gap-1.5", className)}
    >
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          statusColors[status]
        )}
      />
      <span className="text-xs font-medium text-graphite-400">
        {statusLabels[status]}
      </span>

      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {status === "connected"
          ? "Real-time updates active"
          : status === "connecting"
            ? `Reconnecting (attempt ${retryCountRef.current}/${maxRetries})...`
            : "Connection lost. Will retry automatically."}
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-navy" />
      </div>
    </div>
  );
}
