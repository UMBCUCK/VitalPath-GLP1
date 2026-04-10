"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { CommandPalette } from "@/components/admin/command-palette";
import { KeyboardShortcutsModal } from "@/components/admin/keyboard-shortcuts-modal";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const router = useRouter();

  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);

  // Cmd+K / Ctrl+K to open command palette
  useKeyboardShortcut({ key: "k", meta: true }, openCommandPalette);

  // ? to show shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // G-then-X navigation shortcuts
  useEffect(() => {
    let gPressed = false;
    let timeout: NodeJS.Timeout;

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        gPressed = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => { gPressed = false; }, 1000);
        return;
      }

      if (gPressed) {
        gPressed = false;
        const routes: Record<string, string> = {
          d: "/admin",
          c: "/admin/customers",
          r: "/admin/revenue",
          s: "/admin/settings",
          a: "/admin/analytics",
          p: "/admin/payments",
        };
        if (routes[e.key]) {
          e.preventDefault();
          router.push(routes[e.key]);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex h-screen bg-linen/30 dark:bg-navy-900">
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

      {/* Modals */}
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
