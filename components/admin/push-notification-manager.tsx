"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bell, X } from "lucide-react";
import { NotificationToastContainer } from "./notification-toast";

interface SSEAlert {
  type: string;
  data: {
    logs?: Array<{
      id: string;
      action: string;
      entity: string;
      entityId?: string;
      userName: string;
      timestamp: string;
    }>;
    unreadNotifications?: number;
    activeAlerts?: number;
    timestamp?: string;
  };
}

interface ToastItem {
  id: string;
  title: string;
  body?: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  link?: string;
}

const MAX_TOASTS = 3;
const ALERT_FETCH_INTERVAL = 30000; // 30s

export function PushNotificationManager() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">("default");
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const lastAlertCheckRef = useRef<string>(new Date().toISOString());
  const toastQueueRef = useRef<ToastItem[]>([]);
  const processingRef = useRef(false);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) {
      setPermissionState("unsupported");
      return;
    }
    setPermissionState(Notification.permission);
    if (Notification.permission === "default") {
      setShowPermissionBanner(true);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      setShowPermissionBanner(false);
    } catch {
      setShowPermissionBanner(false);
    }
  }, []);

  const dismissPermissionBanner = useCallback(() => {
    setShowPermissionBanner(false);
  }, []);

  // Send browser push notification for critical alerts
  const sendBrowserNotification = useCallback(
    (title: string, body?: string, link?: string) => {
      if (
        typeof window === "undefined" ||
        !("Notification" in window) ||
        Notification.permission !== "granted"
      ) {
        return;
      }
      try {
        const notification = new Notification(title, {
          body: body || "",
          icon: "/favicon.ico",
          tag: "vitalpath-admin",
        });
        if (link) {
          notification.onclick = () => {
            window.focus();
            window.location.href = link;
            notification.close();
          };
        }
      } catch {
        // Browser may not support Notification constructor (e.g. some mobile)
      }
    },
    []
  );

  // Process toast queue to avoid overwhelming the user
  const processQueue = useCallback(() => {
    if (processingRef.current) return;
    processingRef.current = true;

    const next = toastQueueRef.current.shift();
    if (next) {
      setToasts((prev) => {
        const updated = [next, ...prev].slice(0, MAX_TOASTS);
        return updated;
      });
    }

    processingRef.current = false;
  }, []);

  const addToast = useCallback(
    (toast: ToastItem) => {
      toastQueueRef.current.push(toast);
      processQueue();
    },
    [processQueue]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch new admin alerts periodically
  const fetchNewAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/alerts");
      if (!res.ok) return;
      const data = await res.json();
      const alerts = data.alerts || [];

      for (const alert of alerts) {
        if (new Date(alert.createdAt) > new Date(lastAlertCheckRef.current)) {
          const severity = (alert.severity || "INFO") as "CRITICAL" | "WARNING" | "INFO";

          addToast({
            id: alert.id,
            title: alert.title,
            body: alert.body || undefined,
            severity,
            link: alert.link || undefined,
          });

          // Browser notification for critical alerts
          if (severity === "CRITICAL") {
            sendBrowserNotification(
              alert.title,
              alert.body || undefined,
              alert.link || undefined
            );
          }
        }
      }

      lastAlertCheckRef.current = new Date().toISOString();
    } catch {
      // Silent failure
    }
  }, [addToast, sendBrowserNotification]);

  // Connect to SSE stream and listen for events
  useEffect(() => {
    const es = new EventSource("/api/admin/events/stream");
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const parsed: SSEAlert = JSON.parse(event.data);

        if (parsed.type === "activity" && parsed.data.logs) {
          for (const log of parsed.data.logs) {
            // Show toast for important activity
            if (
              log.action === "PAYMENT_FAILED" ||
              log.action === "ADVERSE_EVENT" ||
              log.action === "SUBSCRIPTION_CANCELED"
            ) {
              addToast({
                id: log.id,
                title: `${log.userName}: ${log.action.replace(/_/g, " ").toLowerCase()}`,
                body: `${log.entity} ${log.entityId || ""}`.trim(),
                severity: log.action === "ADVERSE_EVENT" ? "CRITICAL" : "WARNING",
              });

              if (log.action === "ADVERSE_EVENT") {
                sendBrowserNotification(
                  "Adverse Event Reported",
                  `${log.userName} reported an adverse event`
                );
              }
            }
          }
        }

        if (parsed.type === "counts" && parsed.data.activeAlerts) {
          // If there are active alerts, fetch details
          if (parsed.data.activeAlerts > 0) {
            fetchNewAlerts();
          }
        }
      } catch {
        // Ignore malformed events
      }
    };

    // Periodic alert check
    const alertInterval = setInterval(fetchNewAlerts, ALERT_FETCH_INTERVAL);

    return () => {
      es.close();
      eventSourceRef.current = null;
      clearInterval(alertInterval);
    };
  }, [addToast, sendBrowserNotification, fetchNewAlerts]);

  return (
    <>
      {/* Permission banner */}
      {showPermissionBanner && permissionState === "default" && (
        <div className="fixed bottom-4 left-4 z-[9998] flex max-w-sm items-center gap-3 rounded-xl border border-navy-100/60 bg-white p-4 shadow-lg">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50">
            <Bell className="h-4.5 w-4.5 text-teal" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">
              Enable notifications
            </p>
            <p className="text-xs text-graphite-400">
              Get instant alerts for critical events like payment failures and
              adverse events.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={requestPermission}
                className="rounded-lg bg-teal px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-teal-700"
              >
                Enable
              </button>
              <button
                onClick={dismissPermissionBanner}
                className="rounded-lg px-3 py-1 text-xs font-medium text-graphite-400 transition-colors hover:bg-gray-100"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={dismissPermissionBanner}
            className="shrink-0 self-start rounded-lg p-1 transition-colors hover:bg-gray-100"
          >
            <X className="h-3.5 w-3.5 text-graphite-400" />
          </button>
        </div>
      )}

      {/* Toast container */}
      <NotificationToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
