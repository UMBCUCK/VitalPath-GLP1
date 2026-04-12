export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getAvailableCohorts,
  getCohortComparison,
} from "@/lib/admin-cohort-compare";
import { CohortsClient } from "./cohorts-client";

interface PageProps {
  searchParams: Promise<{ cohortA?: string; cohortB?: string }>;
}

export default async function CohortsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const availableCohorts = await getAvailableCohorts();

  let comparison: Awaited<ReturnType<typeof getCohortComparison>> | null = null;
  if (params.cohortA && params.cohortB) {
    comparison = await getCohortComparison(params.cohortA, params.cohortB);
  }

  return (
    <CohortsClient
      availableCohorts={availableCohorts}
      comparison={comparison}
      initialCohortA={params.cohortA || ""}
      initialCohortB={params.cohortB || ""}
    />
  );
}
