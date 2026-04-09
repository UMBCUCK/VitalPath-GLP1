import type { Metadata } from "next";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "HIPAA Notice of Privacy Practices",
  description: "VitalPath HIPAA Notice of Privacy Practices describing how your protected health information is used and disclosed.",
};

export default function HipaaPage() {
  return (
    <section className="py-16">
      <SectionShell className="max-w-3xl">
        <Badge variant="secondary" className="mb-4 gap-1.5"><Shield className="h-3 w-3" /> HIPAA Compliant</Badge>
        <h1 className="text-3xl font-bold text-navy">Notice of Privacy Practices</h1>
        <p className="mt-2 text-sm text-graphite-400">Effective Date: April 1, 2026</p>

        <div className="mt-8 rounded-2xl border border-teal/20 bg-teal-50/30 p-6">
          <p className="text-sm font-semibold text-navy">THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-graphite-600">
          <section>
            <h2 className="text-lg font-bold text-navy">Our Commitment to Your Privacy</h2>
            <p>VitalPath is committed to protecting the privacy of your health information. This Notice of Privacy Practices describes how we may use and disclose your Protected Health Information (PHI) and your rights regarding that information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Uses and Disclosures of PHI</h2>
            <p><strong>Treatment:</strong> We may use and disclose your PHI to provide, coordinate, and manage your healthcare, including sharing information with your assigned providers, pharmacies, and laboratories.</p>
            <p className="mt-2"><strong>Payment:</strong> We may use and disclose your PHI for billing and payment activities, including verifying insurance coverage and processing subscription payments.</p>
            <p className="mt-2"><strong>Healthcare Operations:</strong> We may use and disclose your PHI for operational activities such as quality assessment, care coordination, and business planning.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Your Rights</h2>
            <ul className="mt-2 space-y-2">
              <li><strong>Right to Access:</strong> You have the right to inspect and obtain a copy of your PHI maintained by VitalPath.</li>
              <li><strong>Right to Amend:</strong> You may request amendments to your PHI if you believe it is incorrect or incomplete.</li>
              <li><strong>Right to an Accounting of Disclosures:</strong> You may request a list of certain disclosures we have made of your PHI.</li>
              <li><strong>Right to Restrict:</strong> You may request restrictions on how we use or disclose your PHI for treatment, payment, or healthcare operations.</li>
              <li><strong>Right to Confidential Communications:</strong> You may request that we communicate with you through specific channels or at specific locations.</li>
              <li><strong>Right to a Paper Copy:</strong> You have the right to receive a paper copy of this Notice upon request.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Safeguards</h2>
            <p>We maintain administrative, technical, and physical safeguards to protect your PHI, including encrypted data storage, secure messaging systems, role-based access controls, regular security assessments, and workforce training on privacy and security practices.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Complaints</h2>
            <p>If you believe your privacy rights have been violated, you may file a complaint with VitalPath at privacy@vitalpath.com or with the U.S. Department of Health and Human Services Office for Civil Rights. You will not be penalized for filing a complaint.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Contact Information</h2>
            <p>VitalPath Privacy Officer<br />Email: privacy@vitalpath.com<br />Phone: (888) 509-2745</p>
          </section>
        </div>
      </SectionShell>
    </section>
  );
}
