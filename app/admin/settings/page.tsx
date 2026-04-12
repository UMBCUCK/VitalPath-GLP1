export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const referralSettings = await db.referralSetting.findFirst({ where: { isActive: true } });

  return <AdminSettingsClient referralSettings={referralSettings} />;
}
