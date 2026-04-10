"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";
import { cn } from "@/lib/utils";

interface AdminMobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function AdminMobileNav({ open, onClose }: AdminMobileNavProps) {
  // Close on route change or escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full transition-transform duration-200 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative h-full">
          <AdminSidebar />
          <button
            onClick={onClose}
            className="absolute right-2 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-graphite-400 hover:bg-navy-50 hover:text-navy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
