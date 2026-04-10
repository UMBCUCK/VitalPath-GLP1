export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
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

            <section>
              <h2 className="text-lg font-bold text-navy">10. Dispute Resolution</h2>
              <p><strong>Informal Resolution:</strong> Before initiating any formal dispute proceedings, you agree to first contact VitalPath at care@vitalpath.com and allow a 30-day period for informal resolution. During this period, both parties will attempt in good faith to resolve the dispute through direct communication.</p>
              <p className="mt-2"><strong>Binding Arbitration:</strong> If informal resolution is unsuccessful, any dispute, controversy, or claim arising out of or relating to these Terms or your use of the Services shall be resolved through binding arbitration administered by the American Arbitration Association in accordance with its Consumer Arbitration Rules. The arbitration shall be conducted in the State of Delaware.</p>
              <p className="mt-2"><strong>Governing Law and Venue:</strong> These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any legal proceedings not subject to arbitration shall be brought exclusively in the state or federal courts located in Delaware.</p>
              <p className="mt-2"><strong>Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action. You waive any right to participate in a class action lawsuit or class-wide arbitration against VitalPath.</p>
              <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-800">[LEGAL REVIEW REQUIRED — arbitration clauses, class action waivers, and governing law provisions require legal counsel review for enforceability in all applicable jurisdictions]</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">11. Telehealth Limitations</h2>
              <p>VitalPath&apos;s telehealth services are only available to residents of states where we are licensed and operational. A current list of available states can be found on our <Link href="/states" className="text-teal underline hover:text-teal/80">States page</Link>.</p>
              <p className="mt-2">Telehealth services are not intended to replace in-person medical care when clinically indicated. Your assigned provider may determine that an in-person evaluation or examination is necessary and refer you to a local healthcare provider. In such cases, you are responsible for seeking and scheduling in-person care.</p>
              <p className="mt-2">By using VitalPath, you acknowledge that telehealth has inherent limitations, including the inability to perform a physical examination, and that your provider&apos;s recommendations are based on the information you provide.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">12. Emergency Situations</h2>
              <p className="font-semibold text-red-700">VitalPath is NOT an emergency medical service. Do not use VitalPath for medical emergencies.</p>
              <p className="mt-2">If you are experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. VitalPath does not provide emergency care, crisis intervention, or urgent medical services.</p>
              <p className="mt-2">If you experience severe side effects from any medication prescribed through VitalPath, contact your assigned provider immediately through the platform&apos;s messaging system during business hours, or call our care line at (888) 509-2745. For symptoms that are life-threatening or require immediate medical attention, call 911 without delay.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">13. Medication Policies</h2>
              <p>GLP-1 receptor agonist medications prescribed through VitalPath are not DEA-controlled substances and do not require special handling or monitoring associated with controlled substance prescriptions.</p>
              <p className="mt-2"><strong>Compounded Medications:</strong> Compounded versions of GLP-1 medications are prepared by state-licensed 503A and 503B compounding pharmacies pursuant to individual prescriptions from licensed healthcare providers. Compounded medications are not FDA-approved products. They are prepared in accordance with applicable federal and state compounding regulations.</p>
              <p className="mt-2"><strong>Branded Medications:</strong> Based on your provider&apos;s independent medical judgment, FDA-approved branded GLP-1 medications may be prescribed as an alternative to compounded formulations. Your provider will determine the most appropriate medication option based on your individual health profile and treatment goals.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">14. Corporate Practice of Medicine</h2>
              <p>VitalPath is a technology platform that facilitates access to independent, licensed healthcare providers. VitalPath does not practice medicine, render medical advice, or direct the clinical decisions of any healthcare provider.</p>
              <p className="mt-2">All medical decisions, including but not limited to diagnosis, treatment plans, medication selection, dosing, and ongoing care management, are made by your assigned healthcare provider in the exercise of their independent medical judgment. VitalPath does not interfere with, override, or influence the provider-patient relationship.</p>
              <p className="mt-2">Healthcare providers accessible through the VitalPath platform may be employed by, contracted with, or affiliated with independent medical groups or professional corporations that are separate legal entities from VitalPath.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">15. State-Specific Provisions</h2>
              <p>Certain states provide additional consumer rights and protections that may apply to your use of VitalPath&apos;s Services.</p>
              <p className="mt-2"><strong>California Residents:</strong> If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), including the right to know, delete, and opt out of the sale of personal information. For details, please see our <a href="/legal/privacy" className="text-teal underline hover:text-teal/80">Privacy Policy</a>.</p>
              <p className="mt-2"><strong>Telehealth Regulations:</strong> Telehealth laws and regulations vary by state. Patients are encouraged to review their state&apos;s telehealth regulations to understand any additional rights or limitations that may apply. VitalPath complies with all applicable state telehealth laws in the jurisdictions where we operate.</p>
            </section>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
