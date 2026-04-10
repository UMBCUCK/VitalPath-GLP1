import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";

// Lazy-load engagement widgets — not needed for initial render or LCP
const StickyDesktopCta = dynamic(() =>
  import("@/components/marketing/sticky-desktop-cta").then((m) => ({ default: m.StickyDesktopCta })),
  { ssr: false }
);
const SocialProofToasts = dynamic(() =>
  import("@/components/marketing/social-proof-toasts").then((m) => ({ default: m.SocialProofToasts })),
  { ssr: false }
);
const ExitIntentModal = dynamic(() =>
  import("@/components/marketing/exit-intent-modal").then((m) => ({ default: m.ExitIntentModal })),
  { ssr: false }
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
