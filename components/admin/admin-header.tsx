"use client";

import { usePathname } from "next/navigation";
import { Search, PanelLeftClose, PanelLeft } from "lucide-react";
import { AdminNotificationBell } from "./admin-notification-bell";
import { DarkModeToggle } from "./dark-mode-toggle";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

export function AdminHeader({ sidebarCollapsed, onToggleSidebar, onOpenCommandPalette }: AdminHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="flex h-14 items-center justify-between border-b border-navy-100/40 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-graphite-400 transition-colors hover:bg-navy-50 hover:text-navy lg:flex"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {i > 0 && <span className="text-graphite-200">/</span>}
              <span
                className={cn(
                  crumb.isLast
                    ? "font-medium text-navy"
                    : "text-graphite-400"
                )}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden items-center gap-2 rounded-xl border border-navy-100/60 bg-linen/30 px-3 py-1.5 text-sm text-graphite-400 transition-colors hover:border-navy-200 hover:bg-white sm:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="ml-4 rounded bg-navy-50 px-1.5 py-0.5 text-[10px] font-medium text-graphite-500">
            Ctrl+K
          </kbd>
        </button>

        <DarkModeToggle />
        <AdminNotificationBell />

        <div className="flex items-center gap-2 border-l border-navy-100/40 pl-3 ml-1">
          <div className="h-7 w-7 rounded-full bg-navy-100 flex items-center justify-center text-[10px] font-bold text-navy">
            A
          </div>
          <span className="hidden text-xs text-graphite-400 lg:block">admin@naturesjourneyhealth.com</span>
        </div>
      </div>
    </header>
  );
}
