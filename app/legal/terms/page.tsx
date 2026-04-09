import type { Metadata } from "next";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "VitalPath Terms of Service governing use of our telehealth platform and services.",
};

export default function TermsPage() {
  return (
    <section className="py-16">
      <SectionShell className="max-w-3xl">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-3xl font-bold text-navy">Terms of Service</h1>
        <p className="mt-2 text-sm text-graphite-400">Last updated: April 1, 2026</p>

        <div className="mt-10 prose prose-navy prose-sm max-w-none">
          <div className="space-y-8 text-sm leading-relaxed text-graphite-600">
            <section>
              <h2 className="text-lg font-bold text-navy">1. Overview</h2>
              <p>These Terms of Service ("Terms") govern your access to and use of the VitalPath platform, including our website, mobile applications, telehealth services, and related products (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">2. Eligibility</h2>
              <p>You must be at least 18 years of age and a resident of a state where our Services are available to use VitalPath. Treatment eligibility is determined by a licensed medical provider and is not guaranteed by creating an account or subscribing to a plan.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">3. Medical Services</h2>
              <p>VitalPath facilitates access to licensed healthcare providers through telehealth technology. All medical decisions, including treatment plans and prescriptions, are made by licensed providers in their independent medical judgment. VitalPath does not practice medicine and is not responsible for specific medical decisions made by providers.</p>
              <p className="mt-2">Compounded medications, if prescribed, are not FDA-approved products. They are prepared by state-licensed compounding pharmacies based on individual prescriptions from licensed providers.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">4. Subscriptions and Billing</h2>
              <p>VitalPath offers subscription-based membership plans. By subscribing, you authorize us to charge your payment method on a recurring basis. You may cancel, pause, or modify your subscription at any time from your dashboard. Cancellation takes effect at the end of your current billing period.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">5. Refund Policy</h2>
              <p>If you are not satisfied with your membership, please contact our support team within 30 days of your initial subscription for potential refund options. Refunds for medication already shipped and delivered are handled on a case-by-case basis.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">6. Privacy and Data Protection</h2>
              <p>Your use of VitalPath is also governed by our Privacy Policy and HIPAA Notice of Privacy Practices. We are committed to protecting your health information in compliance with applicable federal and state laws.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">7. Intellectual Property</h2>
              <p>All content, features, and functionality of the VitalPath platform are owned by VitalPath and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">8. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, VitalPath shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Services. Our total liability shall not exceed the amount you paid for Services in the twelve months preceding the claim.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">9. Contact</h2>
              <p>Questions about these Terms should be directed to our support team at care@vitalpath.com or (888) 509-2745.</p>
            </section>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
