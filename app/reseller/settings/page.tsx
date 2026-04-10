import { redirect } from "next/navigation";
import { getResellerSession } from "@/lib/reseller-auth";
import {
  getResellerProfileData,
  getResellerPayoutSummary,
  getResellerTierProgress,
} from "@/lib/reseller-data";
import { SettingsClient } from "./settings-client";

export default async function ResellerSettingsPage() {
  const session = await getResellerSession();
  if (!session) redirect("/reseller/login");

  const [profile, payoutSummary, tierProgress] = await Promise.all([
    getResellerProfileData(session.resellerId),
    getResellerPayoutSummary(session.resellerId),
    getResellerTierProgress(session.resellerId),
  ]);

  return (
    <SettingsClient
      profile={JSON.parse(JSON.stringify(profile))}
      payoutSummary={JSON.parse(JSON.stringify(payoutSummary))}
      tierProgress={JSON.parse(JSON.stringify(tierProgress))}
    />
  );
}
