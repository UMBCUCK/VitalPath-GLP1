export const dynamic = "force-dynamic";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, Pill, Utensils, Share2, Settings,
  MessageCircle, Camera, ClipboardCheck, ShoppingBag, Users,
} from "lucide-react";
import { LeafIcon } from "@/components/layout/brand-logo";
import { siteConfig } from "@/lib/site";
import { NotificationBell } from "@/app/dashboard/notification-bell";
import { StreakBadges } from "@/components/dashboard/streak-badges";
import { UserAvatarDropdown } from "@/components/shared/user-avatar-dropdown";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav";

const dashboardNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
  { label: "Check-In", href: "/dashboard/check-in", icon: ClipboardCheck },
  { label: "Treatment", href: "/dashboard/treatment", icon: Pill },
  { label: "Meals & Recipes", href: "/dashboard/meals", icon: Utensils },
  { label: "Shop", href: "/dashboard/shop", icon: ShoppingBag },
  { label: "Photos", href: "/dashboard/photos", icon: Camera },
  { label: "Community", href: "/dashboard/community", icon: Users },
  { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
  { label: "Referrals", href: "/dashboard/referrals", icon: Share2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, unreadMessages, unreadNotifications, recentProgress] = await Promise.all([
    db.user.findUnique({
      where: { id: session.userId },
      select: { firstName: true, lastName: true, email: true },
    }),
    db.message.count({ where: { userId: session.userId, isRead: false, direction: "INBOUND" } }),
    db.notification.count({ where: { userId: session.userId, isRead: false } }),
    // Only fetch the last 90 days worth of dates — enough to compute a streak
    // without over-fetching. Uses a raw date boundary instead of take:90 so
    // the DB can use the (userId, date) index more efficiently.
    db.progressEntry.findMany({
      where: {
        userId: session.userId,
        date: { gte: new Date(Date.now() - 90 * 86400000) },
      },
      orderBy: { date: "desc" },
      select: { date: true, moodRating: true },
    }),
  ]);

  // Calculate streak
  let trackingStreak = 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dayMs = 86400000;
  for (let i = 0; i < recentProgress.length; i++) {
    const d = new Date(recentProgress[i].date); d.setHours(0, 0, 0, 0);
    const expected = new Date(today.getTime() - i * dayMs); expected.setHours(0, 0, 0, 0);
    if (d.getTime() === expected.getTime()) trackingStreak++;
    else break;
  }
  const checkInStreak = recentProgress.filter((e) => e.moodRating !== null).length;

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "VP";
  const displayName = user?.firstName || user?.email?.split("@")[0] || "Member";

  return (
    <div className="flex min-h-dvh bg-background overscroll-y-none">
      {/* Skip-to-content for keyboard / SR users */}
      <a href="#dashboard-main" className="skip-to-content">Skip to content</a>

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LeafIcon className="h-8 w-8" />
            <div>
              <p className="text-sm font-bold text-card-foreground">{siteConfig.name}</p>
              <p className="text-[10px] text-muted-foreground">Member Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1" aria-label="Dashboard navigation">
          {dashboardNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
              {item.label === "Messages" && unreadMessages > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{unreadMessages}</span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-border bg-card/95 backdrop-blur-xl px-3 sm:px-6">
          {/* Mobile: brand logo + drawer. Desktop: welcome + streaks. */}
          <div className="flex items-center gap-2 min-w-0 lg:hidden">
            <DashboardMobileNav
              displayName={displayName}
              unreadMessages={unreadMessages}
              initials={initials}
              email={user?.email ?? null}
            />
            <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
              <LeafIcon className="h-7 w-7 shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-card-foreground leading-tight">Hi, {displayName}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Member Dashboard</p>
              </div>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <p className="truncate text-base font-bold text-card-foreground">{displayName}</p>
            </div>
            <StreakBadges trackingStreak={trackingStreak} checkInStreak={Math.min(checkInStreak, 10)} />
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <NotificationBell initialCount={unreadNotifications} />
            <Link href="/dashboard/messages" className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors" aria-label={`Messages${unreadMessages > 0 ? `, ${unreadMessages} unread` : ""}`}>
              <MessageCircle className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{unreadMessages}</span>
              )}
            </Link>
            <UserAvatarDropdown
              initials={initials}
              displayName={displayName}
              email={user?.email}
              settingsHref="/dashboard/settings"
            />
          </div>
        </header>

        {/* Main content: extra bottom padding on mobile to clear the bottom tab bar */}
        <main id="dashboard-main" tabIndex={-1} className="p-4 pb-24 sm:p-6 lg:pb-6 focus:outline-none">{children}</main>
      </div>

      {/* Mobile bottom tab bar — thumb-reachable primary nav */}
      <nav
        aria-label="Primary mobile navigation"
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-border bg-card/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5">
          {[
            { label: "Home", href: "/dashboard", icon: LayoutDashboard },
            { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
            { label: "Treatment", href: "/dashboard/treatment", icon: Pill },
            { label: "Meals", href: "/dashboard/meals", icon: Utensils },
            { label: "Messages", href: "/dashboard/messages", icon: MessageCircle, badge: unreadMessages },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground hover:text-primary active:bg-primary/5 transition-colors"
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute right-4 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </nav>

      {/* Tier 7.8 — surface PWA install prompt only inside the dashboard,
          where engagement is highest and installing pays off for the user. */}
      <PWAInstallPrompt />
    </div>
  );
}
