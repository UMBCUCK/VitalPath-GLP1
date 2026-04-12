export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getInventoryRecords,
  getInventoryOverview,
  getRefillForecast,
} from "@/lib/admin-inventory";
import { InventoryClient } from "./inventory-client";

export default async function InventoryPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [recordsData, overview, forecast] = await Promise.all([
    getInventoryRecords(1, 50),
    getInventoryOverview(),
    getRefillForecast(),
  ]);

  return (
    <InventoryClient
      initialRecords={JSON.parse(JSON.stringify(recordsData.records))}
      initialTotal={recordsData.total}
      overview={overview}
      forecast={JSON.parse(JSON.stringify(forecast))}
    />
  );
}
