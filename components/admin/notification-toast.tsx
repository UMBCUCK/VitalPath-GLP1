"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationToastProps {
  id: string;
  title: string;
  body?: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  link?: string;
  onDismiss: (id: string) => void;
}

const severityConfig = {
  CRITICAL: {
    icon: AlertCircle,
    border: "border-red-300",
    bg: "bg-red-50",
    iconColor: "text-red-500",
    titleColor: "text-red-800",
    bodyColor: "text-red-600",
    progressColor: "bg-red-400",
  },
  WARNING: {
    icon: AlertTriangle,
    border: "border-amber-300",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
    titleColor: "text-amber-800",
    bodyColor: "text-amber-600",
    progressColor: "bg-amber-400",
  },
  INFO: {
    icon: Info,
    border: "border-blue-300",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800",
    bodyColor: "text-blue-600",
    progressColor: "bg-blue-400",
  },
};

export function NotificationToast({
  id,
  title,
  body,
  severity,
  link,
  onDismiss,
}: NotificationToastProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const config = severityConfig[severity] || severityConfig.INFO;
  const Icon = config.icon;

  useEffect(() => {
    // Slide in after mount
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto-dismiss after 5 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDismiss() {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300);
  }

  function handleClick() {
    if (link) {
      router.push(link);
      handleDismiss();
    }
  }

  return (
    <div
      className={cn(
        "pointer-events-auto w-80 rounded-xl border shadow-lg transition-all duration-300",
        config.border,
        config.bg,
        isVisible && !isExiting
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0",
        link && "cursor-pointer"
      )}
      onClick={link ? handleClick : undefined}
      role={link ? "button" : undefined}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 shrink-0">
          <Icon className={cn("h-5 w-5", config.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-semibold", config.titleColor)}>
            {title}
          </p>
          {body && (
            <p className={cn("mt-0.5 text-xs line-clamp-2", config.bodyColor)}>
              {body}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="shrink-0 rounded-lg p-1 transition-colors hover:bg-black/5"
        >
          <X className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>
      {/* Auto-dismiss progress bar */}
      <div className="h-0.5 w-full overflow-hidden rounded-b-xl bg-black/5">
        <div
          className={cn("h-full rounded-full transition-all", config.progressColor)}
          style={{
            animation: "shrink-bar 5s linear forwards",
          }}
        />
      </div>
      <style jsx>{`
        @keyframes shrink-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

/** Container for stacking multiple toasts */
export function NotificationToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Array<{
    id: string;
    title: string;
    body?: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
    link?: string;
  }>;
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          body={toast.body}
          severity={toast.severity}
          link={toast.link}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}
