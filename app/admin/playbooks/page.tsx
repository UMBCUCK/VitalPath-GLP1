import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPlaybooks, getPlaybookMetrics } from "@/lib/admin-retention-playbooks";
import { PlaybooksClient } from "./playbooks-client";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PlaybooksPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ rows: playbooks, total }, metrics] = await Promise.all([
    getPlaybooks(page, 20),
    getPlaybookMetrics(),
  ]);

  return (
    <PlaybooksClient
      playbooks={playbooks}
      total={total}
      page={page}
      metrics={metrics}
    />
  );
}
