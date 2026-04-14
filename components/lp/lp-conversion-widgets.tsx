"use client";

import dynamic from "next/dynamic";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";

const ExitIntentModal = dynamic(
  () => import("@/components/marketing/exit-intent-modal").then((m) => m.ExitIntentModal),
  { loading: () => null }
);

const SocialProofToasts = dynamic(
  () => import("@/components/marketing/social-proof-toasts").then((m) => m.SocialProofToasts),
  { loading: () => null }
);

export function LpConversionWidgets() {
  return (
    <>
      <MobileStickyCta />
      <ExitIntentModal />
      <SocialProofToasts />
    </>
  );
}
