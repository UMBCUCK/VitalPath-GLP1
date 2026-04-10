"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  DollarSign,
  CreditCard,
  Wallet,
  Users,
  Stethoscope,
  UsersRound,
  BarChart3,
  Send,
  Share2,
  Tag,
  FileText,
  ChefHat,
  Calendar,
  ShieldCheck,
  ClipboardCheck,
  MapPin,
  AlertTriangle,
  Webhook,
  Settings,
  UserCog,
  ChevronDown,
  Code2,
  GitCompareArrows,
  Zap,
  Gauge,
  Route,
  FlaskConical,
  FileBarChart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Activity Feed", href: "/admin/activity", icon: Activity },
    ],
  },
  {
    title: "Financial",
    items: [
      { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: Wallet },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    title: "Patients",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Providers", href: "/admin/providers", icon: Stethoscope },
      { label: "Segments", href: "/admin/segments", icon: UsersRound },
    ],
  },
  {
    title: "Growth",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Campaigns", href: "/admin/campaigns", icon: Send },
      { label: "Referrals", href: "/admin/referrals", icon: Share2 },
      { label: "Cohorts", href: "/admin/cohorts", icon: GitCompareArrows },
      { label: "Widgets", href: "/admin/widgets", icon: Code2 },
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
      { label: "Journey", href: "/admin/journey", icon: Route },
      { label: "Experiments", href: "/admin/experiments", icon: FlaskConical },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Recipes", href: "/admin/recipes", icon: ChefHat },
      { label: "Meal Plans", href: "/admin/meal-plans", icon: Calendar },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Claims Engine", href: "/admin/claims", icon: ShieldCheck },
      { label: "Compliance Log", href: "/admin/compliance", icon: ClipboardCheck },
      { label: "States", href: "/admin/states", icon: MapPin },
      { label: "Adverse Events", href: "/admin/adverse-events", icon: AlertTriangle },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Operations", href: "/admin/operations", icon: Gauge },
      { label: "Bulk Operations", href: "/admin/bulk-operations", icon: Zap },
      { label: "Automations", href: "/admin/automations", icon: Zap },
      { label: "Webhooks", href: "/admin/webhooks", icon: Webhook },
      { label: "Reports", href: "/admin/reports", icon: FileBarChart },
      { label: "Admin Users", href: "/admin/users", icon: UserCog },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-navy-100/40 bg-white transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-navy-100/40 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
          VP
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-navy">VitalPath</p>
            <p className="text-[10px] text-graphite-400">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navGroups.map((group) => {
          const isGroupCollapsed = collapsedGroups.has(group.title);
          return (
            <div key={group.title}>
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-graphite-300 hover:text-graphite-500 transition-colors"
                >
                  {group.title}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                </button>
              )}
              {!isGroupCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150",
                          active
                            ? "bg-teal-50 text-teal-800 shadow-sm"
                            : "text-graphite-500 hover:bg-navy-50/70 hover:text-navy"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-teal" : "text-graphite-400"
                          )}
                        />
                        {!collapsed && item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export { navGroups };
