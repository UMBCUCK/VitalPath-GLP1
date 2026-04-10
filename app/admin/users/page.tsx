import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [users, recentActivity] = await Promise.all([
    db.user.findMany({
      where: { role: { in: ["ADMIN", "SUPPORT"] } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        avatarUrl: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    }),
  ]);

  return (
    <UsersClient
      initialUsers={JSON.parse(JSON.stringify(users))}
      initialActivity={JSON.parse(JSON.stringify(recentActivity))}
    />
  );
}
