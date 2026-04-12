export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCurrencies, getTaxRules } from "@/lib/admin-currency";
import { CurrencyClient } from "./currency-client";

export default async function CurrencyPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [currencies, taxRules] = await Promise.all([
    getCurrencies(),
    getTaxRules(),
  ]);

  return (
    <CurrencyClient
      currencies={JSON.parse(JSON.stringify(currencies))}
      taxRules={JSON.parse(JSON.stringify(taxRules))}
    />
  );
}
