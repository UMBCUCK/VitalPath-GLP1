export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProvidersClient } from "./providers-client";

export default async function AdminProvidersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const providers = await db.user.findMany({
    where: { role: "PROVIDER" },
    orderBy: { lastName: "asc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      credentials: {
        orderBy: { licenseState: "asc" },
        select: {
          id: true,
          licenseNumber: true,
          licenseState: true,
          licenseType: true,
          deaNumber: true,
          expiresAt: true,
          isActive: true,
        },
      },
    },
  });

  const serialized = providers.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    credentials: p.credentials.map((c) => ({
      ...c,
      expiresAt: c.expiresAt.toISOString(),
    })),
  }));

  return <ProvidersClient providers={serialized} />;
}
