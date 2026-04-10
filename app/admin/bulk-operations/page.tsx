import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getBulkOperations } from "@/lib/admin-bulk-operations";
import { BulkOperationsClient } from "./bulk-operations-client";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BulkOperationsPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const { operations, total, limit } = await getBulkOperations(page);

  const serialized = operations.map((op) => ({
    ...op,
    targetFilter: op.targetFilter as Record<string, unknown> | null,
    errorDetails: op.errorDetails as string[] | null,
    createdAt: op.createdAt.toISOString(),
    updatedAt: op.updatedAt.toISOString(),
    startedAt: op.startedAt?.toISOString() || null,
    completedAt: op.completedAt?.toISOString() || null,
  }));

  return (
    <BulkOperationsClient
      operations={serialized}
      total={total}
      page={page}
      limit={limit}
    />
  );
}
