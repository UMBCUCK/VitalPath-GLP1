export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMarketingAssets, getAssetAnalytics } from "@/lib/admin-marketing-assets";
import { MarketingAssetsClient } from "./marketing-assets-client";

export default async function MarketingAssetsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [assetsData, analytics] = await Promise.all([
    getMarketingAssets(1, 50),
    getAssetAnalytics(),
  ]);

  return (
    <MarketingAssetsClient
      initialAssets={JSON.parse(JSON.stringify(assetsData.assets))}
      initialTotal={assetsData.total}
      analytics={analytics}
    />
  );
}
