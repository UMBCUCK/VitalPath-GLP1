export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getRecentQueries } from "@/lib/admin-nl-query";
import { QueryClient } from "./query-client";

export default async function AdminQueryPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const recentQueries = await getRecentQueries(session.userId, 10);

  return <QueryClient recentQueries={recentQueries} />;
}
