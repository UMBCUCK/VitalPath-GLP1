import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminPermissions } from "@/lib/admin-permissions";
import { PermissionsClient } from "./permissions-client";

export default async function PermissionsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const admins = await getAdminPermissions();

  return <PermissionsClient admins={admins} currentUserId={session.userId} />;
}
