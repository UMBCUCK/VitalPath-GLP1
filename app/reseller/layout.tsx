import Link from "next/link";
import { getResellerSession } from "@/lib/reseller-auth";
import { ResellerLogoutButton } from "./logout-button";
import { ResellerNav } from "./reseller-nav";

export default async function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getResellerSession();

  return (
    <div className="min-h-screen bg-linen/30">
      {/* Header */}
      <header className="border-b border-navy-100/40 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/reseller" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic text-xs font-bold text-white">
              VP
            </div>
            <div>
              <p className="text-sm font-bold text-navy">Nature's Journey</p>
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

        {/* Navigation */}
        {session && <ResellerNav />}
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}
