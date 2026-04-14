import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionShell } from "@/components/shared/section-shell";

export const metadata: Metadata = {
  title: "Accessibility Statement | Nature's Journey",
  description:
    "Nature's Journey Health is committed to making our website and services accessible to all users, including those with disabilities. Learn about our accessibility practices and how to request accommodations.",
};

export default function AccessibilityPage() {
  return (
    <MarketingShell>
      <section className="py-16 lg:py-24">
        <SectionShell>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-navy">Accessibility Statement</h1>
            <p className="mt-2 text-sm text-graphite-400">Last updated: April 2026</p>

            <div className="mt-10 space-y-8 text-sm leading-relaxed text-graphite-600">

              <section>
                <h2 className="text-lg font-bold text-navy">Our Commitment</h2>
                <p className="mt-2">
                  Nature&apos;s Journey Health is committed to ensuring that our website and digital services are
                  accessible to all users, including individuals with disabilities. We strive to conform to the
                  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards published by the World Wide
                  Web Consortium (W3C).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy">Current Accessibility Features</h2>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Keyboard navigation support across all interactive elements</li>
                  <li>ARIA labels and roles for screen reader compatibility</li>
                  <li>Skip-to-content link at the top of each page</li>
                  <li>Sufficient color contrast ratios for text and interface elements</li>
                  <li>Descriptive alt text for images and visual content</li>
                  <li>Responsive design that supports browser text resizing up to 200%</li>
                  <li>Form fields with associated labels and descriptive error messages</li>
                  <li>Focus indicators visible on interactive elements</li>
                  <li>Structured headings (H1–H6) for logical page hierarchy</li>
                  <li>No flashing or strobing content that could trigger photosensitive conditions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy">Known Limitations</h2>
                <p className="mt-2">
                  While we aim for full WCAG 2.1 Level AA conformance, some areas of our platform are still
                  being improved. These include:
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Certain third-party embedded components (e.g., payment widgets) whose accessibility depends on the vendor</li>
                  <li>Some PDF documents that may not be fully optimized for screen readers</li>
                  <li>Legacy content in our blog archive that is being reviewed and updated</li>
                </ul>
                <p className="mt-3">
                  We are actively working to address these limitations and improve accessibility across the platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy">Requesting Accommodations</h2>
                <p className="mt-2">
                  If you have difficulty accessing any content or functionality on our website, or if you need
                  information in an alternative format, please contact us. We will make reasonable accommodations
                  to assist you.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-teal" />
                    <a href="mailto:accessibility@naturesjourneyhealth.com" className="text-teal hover:underline">
                      accessibility@naturesjourneyhealth.com
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-teal" />
                    <a href="tel:18885092745" className="text-teal hover:underline">
                      (888) 509-2745
                    </a>
                    <span className="text-graphite-400">— Monday–Friday, 9am–5pm ET</span>
                  </p>
                </div>
                <p className="mt-3">
                  When contacting us, please describe the specific page or feature you&apos;re having difficulty
                  with, and we will respond within 2 business days.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy">Feedback</h2>
                <p className="mt-2">
                  We welcome feedback on the accessibility of our website. If you encounter accessibility barriers,
                  please let us know by contacting us at the email or phone number above. Your feedback helps us
                  prioritize improvements.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy">Third-Party Content</h2>
                <p className="mt-2">
                  Our website may contain links to or embed content from third-party services. We cannot guarantee
                  the accessibility of external websites or content not under our direct control. We encourage you
                  to review the accessibility statements of any third-party services you use in connection with
                  our platform.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy">Technical Specifications</h2>
                <p className="mt-2">
                  Our website is built using semantic HTML5, CSS, and JavaScript. It is designed to be compatible
                  with the following assistive technologies and browsers:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>NVDA + Firefox (Windows)</li>
                  <li>JAWS + Chrome (Windows)</li>
                  <li>VoiceOver + Safari (macOS, iOS)</li>
                  <li>TalkBack + Chrome (Android)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-navy">Updates to This Statement</h2>
                <p className="mt-2">
                  We review and update this accessibility statement as we make improvements to our platform.
                  This statement was last reviewed in April 2026.
                </p>
              </section>

            </div>
          </div>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
