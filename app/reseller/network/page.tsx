export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getResellerSession } from "@/lib/reseller-auth";
import {
  getResellerNetwork,
  getResellerOverrideEarnings,
  getResellerTierProgress,
} from "@/lib/reseller-data";
import { NetworkClient } from "./network-client";

export default async function ResellerNetworkPage() {
  const session = await getResellerSession();
  if (!session) redirect("/reseller/login");

  const [network, overrideEarnings, tierProgress] = await Promise.all([
    getResellerNetwork(session.resellerId),
    getResellerOverrideEarnings(session.resellerId),
    getResellerTierProgress(session.resellerId),
  ]);

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  const signupLink = network.referralCode
    ? `${base}/reseller-signup?ref=${network.referralCode}`
    : null;

  return (
    <NetworkClient
      network={JSON.parse(JSON.stringify(network))}
      overrideEarnings={JSON.parse(JSON.stringify(overrideEarnings))}
      tierProgress={JSON.parse(JSON.stringify(tierProgress))}
      signupLink={signupLink}
    />
  );
}
