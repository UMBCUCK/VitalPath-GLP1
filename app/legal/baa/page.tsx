import type { Metadata } from "next";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Business Associate Agreements",
  description: "VitalPath Business Associate Agreement (BAA) policy for HIPAA-compliant vendor relationships and protected health information handling.",
};

export default function BaaPage() {
  return (
    <section className="py-16">
      <SectionShell className="max-w-3xl">
        <Badge variant="secondary" className="mb-4 gap-1.5"><Shield className="h-3 w-3" /> HIPAA Compliant</Badge>
        <h1 className="text-3xl font-bold text-navy">Business Associate Agreements</h1>
        <p className="mt-2 text-sm text-graphite-400">Effective Date: April 1, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-graphite-600">
          <section>
            <h2 className="text-lg font-bold text-navy">What Is a Business Associate Agreement?</h2>
            <p>A Business Associate Agreement (BAA) is a legally binding contract required under the Health Insurance Portability and Accountability Act (HIPAA) between a covered entity (such as VitalPath) and a business associate — any third-party vendor or service provider that creates, receives, maintains, or transmits Protected Health Information (PHI) on behalf of the covered entity.</p>
            <p className="mt-2">BAAs establish the permitted and required uses and disclosures of PHI by the business associate, require the business associate to implement appropriate safeguards to prevent unauthorized use or disclosure of PHI, and ensure that both parties understand their responsibilities for protecting patient health information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Why BAAs Matter</h2>
            <p>BAAs are a cornerstone of HIPAA compliance. Without a properly executed BAA, sharing PHI with a third-party vendor would constitute a HIPAA violation, regardless of what safeguards that vendor has in place. BAAs ensure that every entity in the chain of PHI handling is contractually obligated to protect patient information to the same standards required by HIPAA.</p>
            <p className="mt-2">For patients, this means that your health information is protected not only by VitalPath directly, but also by every vendor that touches your data as part of delivering your care.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">VitalPath&apos;s BAA Policy</h2>
            <p>VitalPath requires all vendors and service providers that handle, access, store, or transmit Protected Health Information to execute a Business Associate Agreement before any PHI is shared. No exceptions are made to this policy.</p>
            <p className="mt-2">Our BAA template includes provisions for:</p>
            <ul className="mt-2 space-y-2">
              <li>Permitted uses and disclosures of PHI, limited to the minimum necessary for the vendor to perform their contracted services</li>
              <li>Requirements for administrative, technical, and physical safeguards</li>
              <li>Breach notification obligations, including timelines for reporting security incidents</li>
              <li>Requirements for the return or destruction of PHI upon termination of the agreement</li>
              <li>Provisions for subcontractor management, ensuring that any downstream entities also comply with HIPAA requirements</li>
              <li>Audit and compliance monitoring rights</li>
            </ul>
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-800">[LEGAL REVIEW REQUIRED — BAA template and policy provisions should be reviewed by legal counsel to ensure compliance with current HIPAA regulations and state requirements]</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Vendors That Require BAAs</h2>
            <p>VitalPath maintains executed BAAs with all categories of vendors that handle PHI in the course of delivering our services, including:</p>
            <ul className="mt-2 space-y-2">
              <li><strong>Telehealth Platform Providers:</strong> Technology vendors that power the virtual consultations between patients and healthcare providers, including video, messaging, and clinical workflow systems.</li>
              <li><strong>Compounding Pharmacies:</strong> State-licensed 503A and 503B compounding pharmacies that prepare and dispense medications based on provider prescriptions, requiring access to patient prescription and health information.</li>
              <li><strong>Email and Communication Services:</strong> Vendors that facilitate patient communications, including appointment reminders, care notifications, and secure messaging, where PHI may be transmitted.</li>
              <li><strong>Cloud Infrastructure Providers:</strong> Hosting and cloud storage providers where PHI is stored, processed, or transmitted, including database hosting, file storage, and application hosting services.</li>
              <li><strong>Payment Processors:</strong> Vendors that process subscription payments and billing, which may handle limited PHI in connection with healthcare payment transactions.</li>
            </ul>
            <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-800">[LEGAL REVIEW REQUIRED — vendor categories and BAA coverage should be reviewed periodically to ensure all PHI-handling vendors are identified and covered]</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Requesting a Copy of Our BAA</h2>
            <p>If you are a vendor or service provider seeking to work with VitalPath and will handle Protected Health Information, you may request a copy of our BAA template for review. Please contact our compliance team to initiate the BAA process:</p>
            <p className="mt-2">VitalPath Compliance Team<br />Email: compliance@vitalpath.com<br />Phone: (888) 509-2745</p>
            <p className="mt-2">All BAA requests are reviewed by our compliance and legal teams. VitalPath reserves the right to require additional security documentation or certifications before executing a BAA, depending on the nature and scope of PHI access involved.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy">Questions</h2>
            <p>For questions about VitalPath&apos;s BAA policy or HIPAA compliance practices, please contact us at compliance@vitalpath.com or (888) 509-2745.</p>
          </section>
        </div>
      </SectionShell>
    </section>
  );
}
