export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getResellerSession } from "@/lib/reseller-auth";
import { db } from "@/lib/db";
import { OnboardingClient } from "./onboarding-client";

export default async function ResellerOnboardingPage() {
  const session = await getResellerSession();
  if (!session) redirect("/reseller/login");

  const profile = await db.resellerProfile.findUnique({
    where: { id: session.resellerId },
    select: {
      id: true,
      displayName: true,
      contactEmail: true,
      onboardingStep: true,
      onboardingCompletedAt: true,
      complianceTrainingCompletedAt: true,
      agreementSignedAt: true,
      w9SubmittedAt: true,
      healthcareProviderAttestation: true,
    },
  });

  if (!profile) redirect("/reseller/login");

  // If onboarding is complete, redirect to main dashboard
  if (profile.onboardingCompletedAt) redirect("/reseller");

  return (
    <OnboardingClient
      resellerId={profile.id}
      displayName={profile.displayName}
      email={profile.contactEmail}
      currentStep={profile.onboardingStep}
    />
  );
}
