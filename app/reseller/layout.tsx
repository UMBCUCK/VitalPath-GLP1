import Link from "next/link";
import { redirect } from "next/navigation";
import { getResellerSession } from "@/lib/reseller-auth";
import { db } from "@/lib/db";
import { ResellerLogoutButton } from "./logout-button";
import { ResellerNav } from "./reseller-nav";
import { headers } from "next/headers";

export default async function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getResellerSession();

  // Gate all reseller pages (except login and onboarding) behind onboarding completion
  if (session) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
    const isOnboardingPage = pathname.includes("/onboarding");
    const isLoginPage = pathname.includes("/login");

    if (!isOnboardingPage && !isLoginPage) {
      const profile = await db.resellerProfile.findUnique({
        where: { id: session.resellerId },
        select: { onboardingCompletedAt: true },
      });
      if (profile && !profile.onboardingCompletedAt) {
        redirect("/reseller/onboarding");
      }
    }
  }

  return (
    <div className="min-h-dvh bg-linen/30">
      {/* Header */}
      <header className="border-b border-navy-100/40 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/reseller" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic text-xs font-bold text-white">
              VP
            </div>
            <div>
              <p className="text-sm font-bold text-navy">VitalPath</p>
              <p className="text-[10px] text-graphite-400">Reseller Portal</p>
            </div>
          </Link>

          {session && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-navy">
                {session.displayName}
              </span>
              <ResellerLogoutButton />
            </div>
          )}
        </div>

        {/* Navigation — only show if onboarding is complete */}
        {session && <ResellerNav />}
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}
