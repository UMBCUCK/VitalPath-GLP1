"use client";

import { useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { CommandPalette } from "@/components/admin/command-palette";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);

  // Cmd+K / Ctrl+K to open command palette
  useKeyboardShortcut({ key: "k", meta: true }, openCommandPalette);

  return (
    <div className="flex h-screen bg-linen/30">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile nav */}
      <AdminMobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => {
            // On mobile, toggle mobile nav. On desktop, toggle sidebar collapse
            if (window.innerWidth < 1024) {
              setMobileNavOpen(true);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          onOpenCommandPalette={openCommandPalette}
        />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Command palette */}
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
