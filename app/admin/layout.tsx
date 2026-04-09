import Link from "next/link";
import {
  LayoutDashboard,
  ShieldCheck,
  Package,
  Users,
  BarChart3,
  Settings,
  Tag,
  Share2,
  ChefHat,
  MapPin,
  FileText,
  Calendar,
  Mail,
  DollarSign,
  Activity,
  Search,
  Send,
} from "lucide-react";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { label: "Retention", href: "/admin/retention", icon: Activity },
  { label: "Campaigns", href: "/admin/campaigns", icon: Send },
  { label: "SEO Pipeline", href: "/admin/seo", icon: Search },
  { label: "Claims Engine", href: "/admin/claims", icon: ShieldCheck },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Recipes", href: "/admin/recipes", icon: ChefHat },
  { label: "Meal Plans", href: "/admin/meal-plans", icon: Calendar },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "States", href: "/admin/states", icon: MapPin },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Referrals", href: "/admin/referrals", icon: Share2 },
  { label: "Emails", href: "/admin/email-preview", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-linen/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-navy-100/40 bg-white lg:block">
        <div className="flex h-16 items-center gap-2.5 border-b border-navy-100/40 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
            VP
          </div>
          <div>
            <p className="text-sm font-bold text-navy">VitalPath</p>
            <p className="text-[10px] text-graphite-400">Admin Panel</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-graphite-500 transition-colors hover:bg-navy-50 hover:text-navy"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b border-navy-100/40 bg-white px-6">
          <h1 className="text-lg font-bold text-navy">Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-graphite-400">admin@vitalpath.com</span>
            <div className="h-8 w-8 rounded-full bg-navy-100 flex items-center justify-center text-xs font-bold text-navy">
              A
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
