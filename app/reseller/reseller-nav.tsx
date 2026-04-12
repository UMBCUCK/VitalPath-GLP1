"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, BarChart3, Settings, FileCheck } from "lucide-react";

const navItems = [
  { href: "/reseller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/reseller/network", label: "My Network", icon: Users, exact: false },
  { href: "/reseller/marketing", label: "Marketing", icon: FileCheck, exact: false },
  { href: "/reseller/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/reseller/settings", label: "Settings", icon: Settings, exact: false },
];

export function ResellerNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (!pathname) return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="mx-auto max-w-6xl px-6">
      <div className="flex items-center gap-1 -mb-px overflow-x-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-teal text-teal"
                  : "border-transparent text-graphite-400 hover:text-navy hover:border-navy-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
