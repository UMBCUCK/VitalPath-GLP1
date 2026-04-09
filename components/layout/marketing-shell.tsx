import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { StickyDesktopCta } from "@/components/marketing/sticky-desktop-cta";
import { SocialProofToasts } from "@/components/marketing/social-proof-toasts";
import { ExitIntentModal } from "@/components/marketing/exit-intent-modal";

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
