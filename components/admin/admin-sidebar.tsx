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
  Search,
  Lightbulb,
  ScanLine,
  HeartPulse,
  Brain,
  Store,
  ShoppingBag,
  Target,
  Handshake,
  BadgeDollarSign,
  Scale,
  MessageCircle,
  Pill,
  Globe,
  Globe2,
  Sparkles,
  History,
  Award,
  Image,
  Package,
  MousePointerClick,
  BookOpen,
  PieChart,
  Layers,
  Filter,
  GitBranch,
  Watch,
  ShieldAlert,
  Building2,
  RefreshCw,
  FileHeart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LeafIcon } from "@/components/layout/brand-logo";
import { siteConfig } from "@/lib/site";

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
      { label: "Query Engine", href: "/admin/query", icon: Search },
      { label: "AI Insights", href: "/admin/insights", icon: Lightbulb },
      { label: "AI Reports", href: "/admin/ai-reports", icon: Brain },
    ],
  },
  {
    title: "Financial",
    items: [
      { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
      { label: "Sales", href: "/admin/sales", icon: ShoppingBag },
      { label: "Products & Pricing", href: "/admin/products", icon: CreditCard },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: Wallet },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Pricing", href: "/admin/pricing", icon: BadgeDollarSign },
      { label: "Reconciliation", href: "/admin/reconciliation", icon: Scale },
      { label: "Payment Plans", href: "/admin/payment-plans", icon: Calendar },
      { label: "Currency & Tax", href: "/admin/currency", icon: Globe2 },
      { label: "Organizations", href: "/admin/organizations", icon: Building2 },
    ],
  },
  {
    title: "Patients",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Telehealth", href: "/admin/telehealth", icon: HeartPulse },
      { label: "Providers", href: "/admin/providers", icon: Stethoscope },
      { label: "Segments", href: "/admin/segments", icon: UsersRound },
      { label: "Communications", href: "/admin/communications", icon: MessageCircle },
      { label: "Medication", href: "/admin/medication", icon: Pill },
      { label: "Scorecards", href: "/admin/provider-scorecards", icon: Award },
      { label: "Segments+", href: "/admin/advanced-segments", icon: Filter },
      { label: "Playbooks", href: "/admin/playbooks", icon: BookOpen },
      { label: "Dose Intelligence", href: "/admin/dose-intelligence", icon: Brain },
      { label: "Wearables", href: "/admin/wearables", icon: Watch },
      { label: "Triage", href: "/admin/triage", icon: ShieldAlert },
      { label: "Behavioral Health", href: "/admin/behavioral-health", icon: FileHeart },
      { label: "Retention Engine", href: "/admin/retention-engine", icon: RefreshCw },
    ],
  },
  {
    title: "Growth",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Attribution", href: "/admin/attribution", icon: MousePointerClick },
      { label: "Conversion", href: "/admin/conversion", icon: Target },
      { label: "Campaigns", href: "/admin/campaigns", icon: Send },
      { label: "Referrals", href: "/admin/referrals", icon: Share2 },
      { label: "Resellers", href: "/admin/resellers", icon: Handshake },
      { label: "Cohorts", href: "/admin/cohorts", icon: GitCompareArrows },
      { label: "Widgets", href: "/admin/widgets", icon: Code2 },
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
      { label: "Journey", href: "/admin/journey", icon: Route },
      { label: "Experiments", href: "/admin/experiments", icon: FlaskConical },
      { label: "Geo Intel", href: "/admin/geographic", icon: Globe },
      { label: "Content ROI", href: "/admin/revenue-attribution", icon: PieChart },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Recipes", href: "/admin/recipes", icon: ChefHat },
      { label: "Meal Plans", href: "/admin/meal-plans", icon: Calendar },
      { label: "Media Library", href: "/admin/media", icon: Image },
      { label: "Intelligence", href: "/admin/content-intelligence", icon: Sparkles },
      { label: "Marketing Assets", href: "/admin/marketing-assets", icon: Image },
      { label: "Landing Pages", href: "/admin/landing-pages", icon: Layers },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Claims Engine", href: "/admin/claims", icon: ShieldCheck },
      { label: "Compliance Log", href: "/admin/compliance", icon: ClipboardCheck },
      { label: "Scanner", href: "/admin/compliance/scanner", icon: ScanLine },
      { label: "States", href: "/admin/states", icon: MapPin },
      { label: "Adverse Events", href: "/admin/adverse-events", icon: AlertTriangle },
      { label: "Outcomes", href: "/admin/outcomes", icon: Award },
      { label: "Score", href: "/admin/compliance-dashboard", icon: ShieldCheck },
      { label: "HIPAA Center", href: "/admin/hipaa", icon: ShieldCheck },
      { label: "Reseller Compliance", href: "/admin/reseller-compliance", icon: ShieldAlert },
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
      { label: "Audit Trail", href: "/admin/audit-trail", icon: History },
      { label: "Inventory", href: "/admin/inventory", icon: Package },
      { label: "Health", href: "/admin/health", icon: HeartPulse },
    ],
  },
];

// Build icon lookup from default navGroups so customized config can resolve icons by href
const iconMap = new Map<string, LucideIcon>();
navGroups.forEach((g) => g.items.forEach((i) => iconMap.set(i.href, i.icon)));

function getIcon(href: string): LucideIcon {
  return iconMap.get(href) || LayoutDashboard;
}

export function AdminSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Load nav config from localStorage (customized order/visibility/names)
  const [navConfig, setNavConfig] = useState<null | {
    groups: Array<{
      id: string; title: string; visible: boolean; order: number;
      items: Array<{ id: string; label: string; visible: boolean; order: number }>;
    }>;
  }>(null);

  // Load on mount
  useState(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("vp-admin-nav-config");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === 1) setNavConfig(parsed);
      }
    } catch { /* use defaults */ }
  });

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  // Resolve which groups/items to render
  const displayGroups = navConfig
    ? navConfig.groups
        .filter((g) => g.visible)
        .sort((a, b) => a.order - b.order)
        .map((g) => ({
          title: g.title,
          id: g.id,
          items: g.items
            .filter((i) => i.visible)
            .sort((a, b) => a.order - b.order)
            .map((i) => ({
              label: i.label,
              href: i.id,
              icon: getIcon(i.id),
            })),
        }))
    : navGroups.map((g) => ({ title: g.title, id: g.title.toLowerCase(), items: g.items }));

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-4">
        <LeafIcon className="h-8 w-8" />
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-card-foreground">{siteConfig.name}</p>
            <p className="text-[10px] text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {displayGroups.map((group) => {
          const isGroupCollapsed = collapsedGroups.has(group.title);
          return (
            <div key={group.id}>
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
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
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-primary" : "text-muted-foreground"
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
