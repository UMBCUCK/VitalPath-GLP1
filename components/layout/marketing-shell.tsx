import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";

// Lazy-load engagement widgets — deferred JS chunk, not needed for initial render.
// loading: () => null prevents these from triggering a Suspense fallback.
const StickyDesktopCta = dynamic(
  () => import("@/components/marketing/sticky-desktop-cta").then((m) => ({ default: m.StickyDesktopCta })),
  { loading: () => null }
);
const SocialProofToasts = dynamic(
  () => import("@/components/marketing/social-proof-toasts").then((m) => ({ default: m.SocialProofToasts })),
  { loading: () => null }
);
const ExitIntentModal = dynamic(
  () => import("@/components/marketing/exit-intent-modal").then((m) => ({ default: m.ExitIntentModal })),
  { loading: () => null }
);

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <MobileStickyCta />
      <StickyDesktopCta />
      <SocialProofToasts />
      <ExitIntentModal />
    </>
  );
}
