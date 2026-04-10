"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function ResellerLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/reseller/auth", { method: "DELETE" });
    router.push("/reseller/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
