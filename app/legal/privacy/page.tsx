import type { Metadata } from "next";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "VitalPath Privacy Policy describing how we collect, use, and protect your personal and health information.",
};

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <SectionShell className="max-w-3xl">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-3xl font-bold text-navy">Privacy Policy</h1>
        <p className="mt-2 text-sm text-graphite-400">Last updated: April 1, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-graphite-600">
          <section>
            <h2 className="text-lg font-bold text-navy">1. Information We Collect</h2>
            <p>We collect information you provide directly, including: name, email, phone number, date of birth, health information (height, weight, medical history, medications, allergies), payment information (processed by Stripe), and communication with your care team.</p>
            <p className="mt-2">We also collect usage data including pages visited, features used, device information, and IP address to improve our services and personalize your experience.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">2. How We Use Your Information</h2>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>To provide healthcare services through our platform</li>
              <li>To facilitate provider evaluations and treatment plans</li>
              <li>To process prescriptions and pharmacy fulfillment</li>
              <li>To process payments and manage subscriptions</li>
              <li>To communicate with you about your care and account</li>
              <li>To improve our platform and develop new features</li>
              <li>To comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">3. HIPAA Compliance</h2>
            <p>VitalPath operates as a HIPAA-compliant platform. Protected Health Information (PHI) is handled in accordance with the Health Insurance Portability and Accountability Act. We maintain administrative, technical, and physical safeguards to protect your health information.</p>
            <p className="mt-2">For detailed information about how we handle PHI, please see our HIPAA Notice of Privacy Practices.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">4. Data Security</h2>
            <p>We use industry-standard security measures including 256-bit TLS encryption for data in transit, AES-256 encryption for data at rest, role-based access controls, regular security audits, and secure cloud infrastructure.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">5. Information Sharing</h2>
            <p>We do not sell your personal information. We share information only with: your assigned healthcare providers, licensed pharmacies fulfilling your prescriptions, payment processors (Stripe), and service providers who assist us in operating our platform, all under appropriate agreements and safeguards.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">6. Your Rights</h2>
            <p>You have the right to: access your personal and health information, request correction of inaccurate information, request deletion of your account and data (subject to legal retention requirements), opt out of marketing communications, and request a copy of your health records.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">7. Contact Us</h2>
            <p>For privacy-related questions or to exercise your rights, contact us at privacy@vitalpath.com or (888) 509-2745.</p>
          </section>
        </div>
      </SectionShell>
    </section>
  );
}
