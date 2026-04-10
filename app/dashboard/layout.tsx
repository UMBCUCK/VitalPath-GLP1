import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  LayoutDashboard, TrendingUp, Pill, Utensils, Share2, Settings,
  MessageCircle, Camera, ClipboardCheck, ShoppingBag,
} from "lucide-react";
import { NotificationBell } from "@/app/dashboard/notification-bell";
import { StreakBadges } from "@/components/dashboard/streak-badges";

const dashboardNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
  { label: "Check-In", href: "/dashboard/check-in", icon: ClipboardCheck },
  { label: "Treatment", href: "/dashboard/treatment", icon: Pill },
  { label: "Meals & Recipes", href: "/dashboard/meals", icon: Utensils },
  { label: "Shop", href: "/dashboard/shop", icon: ShoppingBag },
  { label: "Photos", href: "/dashboard/photos", icon: Camera },
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
    <div className="flex min-h-screen bg-linen/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-navy-100/40 bg-white lg:block">
        <div className="flex h-16 items-center gap-2.5 border-b border-navy-100/40 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic text-xs font-bold text-white">VP</div>
            <div>
              <p className="text-sm font-bold text-navy">VitalPath</p>
              <p className="text-[10px] text-graphite-400">Member Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1" aria-label="Dashboard navigation">
          {dashboardNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-graphite-500 transition-colors hover:bg-teal-50 hover:text-teal-800"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
              {item.label === "Messages" && unreadMessages > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">{unreadMessages}</span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b border-navy-100/40 bg-white px-6">
          <div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-graphite-400">Welcome back</p>
                <p className="text-base font-bold text-navy">{displayName}</p>
              </div>
              <StreakBadges trackingStreak={trackingStreak} checkInStreak={Math.min(checkInStreak, 10)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell initialCount={unreadNotifications} />
            <Link href="/dashboard/messages" className="relative rounded-lg p-2 text-graphite-400 hover:bg-navy-50 transition-colors" aria-label={`Messages${unreadMessages > 0 ? `, ${unreadMessages} unread` : ""}`}>
              <MessageCircle className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">{unreadMessages}</span>
              )}
            </Link>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal to-atlantic flex items-center justify-center text-xs font-bold text-white" aria-label="Account">
              {initials}
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
