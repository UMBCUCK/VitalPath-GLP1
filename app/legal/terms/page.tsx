import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Nature's Journey Terms of Service governing use of our telehealth weight management platform, medication programs, and related services.",
};

export default function TermsPage() {
  return (
    <section className="py-16">
        <SectionShell className="max-w-3xl">
          <Badge variant="secondary" className="mb-4">Legal</Badge>
          <h1 className="text-3xl font-bold text-navy">Terms of Service</h1>
          <p className="mt-2 text-sm text-graphite-400">Last updated: April 10, 2026 &nbsp;·&nbsp; Effective: April 10, 2026</p>

          <div className="mt-6 rounded-xl border border-navy-100 bg-linen/50 p-5 text-sm text-graphite-600">
            <strong>Summary:</strong> Nature's Journey is a technology platform that connects patients with independent, licensed healthcare providers. We do not practice medicine. All prescribing decisions are made by your provider. Compounded medications are not FDA-approved. Please read this agreement carefully before using our services.
          </div>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-graphite-600">

            {/* 1 */}
            <section>
              <h2 className="text-lg font-bold text-navy">1. Acceptance of Terms</h2>
              <p>These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;Patient,&rdquo; &ldquo;Member,&rdquo; &ldquo;you&rdquo;) and Nature's Journey Health, LLC (&ldquo;Nature's Journey,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;), a Delaware corporation. By creating an account, completing the intake process, purchasing a subscription, or otherwise accessing our platform, you agree to be bound by these Terms, our <Link href="/legal/privacy" className="text-teal underline hover:text-teal/80">Privacy Policy</Link>, and our <Link href="/legal/hipaa" className="text-teal underline hover:text-teal/80">HIPAA Notice of Privacy Practices</Link>.</p>
              <p className="mt-2">If you do not agree to these Terms, you must not use our services. These Terms supersede any prior agreements or representations relating to our services.</p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-lg font-bold text-navy">2. Eligibility</h2>
              <p>To use Nature's Journey you must:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Be at least 18 years of age. Nature's Journey does not knowingly provide services to minors. If you are under 18, do not use this platform.</li>
                <li>Reside in a U.S. state or territory where Nature's Journey currently operates. See our <Link href="/states" className="text-teal underline hover:text-teal/80">State Availability</Link> page for a current list.</li>
                <li>Have the legal capacity to enter into a binding contract.</li>
                <li>Provide accurate, current, and complete information during registration and intake.</li>
              </ul>
              <p className="mt-2">Creating an account does not guarantee access to medication or any specific treatment. Clinical eligibility is determined solely by your assigned licensed healthcare provider based on their independent medical judgment.</p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-lg font-bold text-navy">3. Nature of Services — Not a Medical Practice</h2>
              <p>Nature's Journey is a health technology company, not a medical practice. We provide a platform that:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Connects patients with independent, licensed healthcare providers;</li>
                <li>Facilitates telehealth consultations via asynchronous and synchronous communication;</li>
                <li>Coordinates prescription fulfillment through licensed partner pharmacies; and</li>
                <li>Provides wellness tools, educational content, and care management resources.</li>
              </ul>
              <p className="mt-2"><strong>Nature's Journey does not practice medicine, dentistry, pharmacy, or any other licensed healthcare profession.</strong> All clinical decisions — including diagnosis, treatment planning, medication selection, dosing, titration schedules, and termination of treatment — are made exclusively by your assigned licensed provider in the exercise of their independent professional judgment. Nature's Journey does not direct, control, or influence provider clinical decisions.</p>
              <p className="mt-2">Healthcare providers available through Nature's Journey may be employed by or contracted with independent medical groups, professional corporations, or practice management organizations that are separate legal entities from Nature's Journey.</p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-lg font-bold text-navy">4. Telehealth Consent and Limitations</h2>
              <p><strong>Consent to Telehealth:</strong> By using Nature's Journey, you consent to the delivery of healthcare services via telehealth, including evaluation, consultation, and follow-up through electronic communications, messaging, video, and/or asynchronous review of your submitted health information.</p>
              <p className="mt-2"><strong>Limitations of Telehealth:</strong> You acknowledge that telehealth services have inherent limitations, including:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>The inability to perform a physical examination;</li>
                <li>Potential technical disruptions affecting communication;</li>
                <li>Situations where in-person care may be clinically necessary or preferable;</li>
                <li>Variability in telehealth regulations by state.</li>
              </ul>
              <p className="mt-2">Your provider may, in their discretion, decline to prescribe, refer you to in-person care, or recommend additional evaluation. You are responsible for seeking in-person care when clinically indicated.</p>
              <p className="mt-2"><strong>State Telehealth Laws:</strong> Telehealth regulations vary by jurisdiction. Nature's Journey complies with applicable telehealth laws in all states where we operate. Certain states require specific consent disclosures, restrictions on prescribing, or in-person visit requirements prior to telehealth services. Your provider and Nature's Journey will comply with all applicable state requirements.</p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-lg font-bold text-navy">5. Emergency Situations</h2>
              <p className="font-semibold text-red-700">Nature's Journey is NOT an emergency medical service. Do not use Nature's Journey for medical emergencies.</p>
              <p className="mt-2">If you experience a medical emergency — including but not limited to chest pain, difficulty breathing, severe allergic reaction (anaphylaxis), loss of consciousness, stroke symptoms, or thoughts of self-harm — call 911 or go to your nearest emergency room immediately.</p>
              <p className="mt-2">For non-emergency adverse effects or medication concerns, contact your Nature's Journey provider through the secure messaging system or call our care line at (888) 509-2745 during business hours.</p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-lg font-bold text-navy">6. Medication Policies and FDA Disclosure</h2>
              <p><strong>Compounded Medications:</strong> If prescribed, compounded GLP-1 receptor agonist medications (including semaglutide and tirzepatide formulations) are <strong>not FDA-approved drug products</strong>. They are prepared by state-licensed compounding pharmacies pursuant to individual prescriptions from licensed healthcare providers under the authority of:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Section 503A of the Federal Food, Drug, and Cosmetic Act (FD&C Act), which governs traditional compounding pharmacies operating on a patient-specific, prescription basis; and/or</li>
                <li>Section 503B of the FD&C Act, which governs outsourcing facilities that may produce compounded drugs without patient-specific prescriptions subject to additional FDA oversight.</li>
              </ul>
              <p className="mt-2">Compounded medications may differ from FDA-approved branded products in concentration, ingredients, or delivery form. Nature's Journey works exclusively with pharmacies that operate in compliance with applicable federal and state compounding regulations, USP standards, and current Good Manufacturing Practices (cGMP) where required.</p>
              <p className="mt-2"><strong>FDA-Approved Branded Medications:</strong> Your provider may prescribe FDA-approved branded GLP-1 medications (such as Ozempic®, Wegovy®, Mounjaro®, or Zepbound®) where medically appropriate and clinically indicated. Nature's Journey is not affiliated with or endorsed by the manufacturers of these products.</p>
              <p className="mt-2"><strong>Off-Label Use:</strong> Some medications prescribed through Nature's Journey may be used in a manner not specifically described in the FDA-approved labeling (&ldquo;off-label&rdquo;). Off-label prescribing is a legal and common practice in medicine when a provider determines it to be in the patient&rsquo;s best clinical interest.</p>
              <p className="mt-2"><strong>Adverse Event Reporting:</strong> You are encouraged to report serious adverse events related to compounded medications to the FDA at 1-800-FDA-1088 or <a href="https://www.fda.gov/safety/medwatch" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-teal/80">MedWatch</a>. You may also report to Nature's Journey directly so we can assist.</p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-lg font-bold text-navy">7. Informed Consent for Treatment</h2>
              <p>By proceeding with treatment through Nature's Journey, you confirm that you have been informed of and consent to:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>The nature, purpose, and expected benefits of the proposed treatment;</li>
                <li>Known risks, side effects, and potential adverse reactions of prescribed medications;</li>
                <li>Available alternative treatments, including no treatment;</li>
                <li>The right to ask questions and receive answers from your provider before starting treatment;</li>
                <li>The right to withdraw consent and discontinue treatment at any time.</li>
              </ul>
              <p className="mt-2">Detailed informed consent specific to your prescribed medication is obtained during the clinical intake process and may be supplemented by your assigned provider.</p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-lg font-bold text-navy">8. Patient Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Provide complete and accurate health information, including all medications, supplements, allergies, and medical history;</li>
                <li>Promptly disclose any changes in your health status, medications, or circumstances that may affect your treatment;</li>
                <li>Use medications only as directed by your provider;</li>
                <li>Not share, transfer, or misuse prescription medications;</li>
                <li>Store medications as directed and keep them out of reach of children;</li>
                <li>Contact your provider or seek emergency care if you experience concerning symptoms;</li>
                <li>Attend follow-up check-ins as required by your treatment plan.</li>
              </ul>
              <p className="mt-2">Providing false or misleading health information may result in termination of your account and potential legal liability.</p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-lg font-bold text-navy">9. Subscriptions, Billing, and Refunds</h2>
              <p><strong>Subscription Plans:</strong> Nature's Journey offers recurring membership plans. By subscribing, you authorize Nature's Journey to charge your payment method at the applicable rate on a recurring basis (monthly, quarterly, or annually depending on your plan).</p>
              <p className="mt-2"><strong>Cancellation:</strong> You may cancel your subscription at any time through your account dashboard. Cancellation takes effect at the end of the current billing period. You retain access to services through the end of the paid period.</p>
              <p className="mt-2"><strong>Refunds:</strong> Membership fees are generally non-refundable after the billing date. If you are not satisfied with your initial membership, please contact care@naturesjourneyhealth.com within 30 days of your first charge to discuss options. Medication costs are separate from membership fees. Refunds for medication already dispensed and shipped are not available due to pharmacy regulations, but we will work with you on a case-by-case basis if medication was damaged, incorrect, or not received.</p>
              <p className="mt-2"><strong>Price Changes:</strong> Nature's Journey reserves the right to change subscription pricing with 30 days&rsquo; advance notice. Continued use of the service after a price change constitutes acceptance of the new price.</p>
              <p className="mt-2"><strong>No Insurance Billing:</strong> Nature's Journey does not bill health insurance, Medicare, or Medicaid for its membership services or medications. All payments are out-of-pocket. Nature's Journey is not responsible for any reimbursement issues with your insurer. We can provide receipts that you may submit independently for reimbursement; however, reimbursement is not guaranteed and is the sole responsibility of the member.</p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-lg font-bold text-navy">10. Privacy, HIPAA, and Health Information</h2>
              <p>Your health information is protected under the Health Insurance Portability and Accountability Act (HIPAA) and applicable state privacy laws. Nature's Journey operates as a Covered Entity or Business Associate, as applicable, and maintains HIPAA-compliant policies and technical safeguards.</p>
              <p className="mt-2">Our <Link href="/legal/hipaa" className="text-teal underline hover:text-teal/80">HIPAA Notice of Privacy Practices</Link> describes in detail how we collect, use, disclose, and protect your Protected Health Information (PHI). Our <Link href="/legal/privacy" className="text-teal underline hover:text-teal/80">Privacy Policy</Link> describes how we handle non-PHI data.</p>
              <p className="mt-2"><strong>Electronic Communications:</strong> By creating an account and providing your phone number or email address, you consent to receive electronic communications from Nature's Journey, including appointment reminders, treatment updates, and care-related notifications. These communications are necessary for the provision of healthcare services and may not be fully opted out of while you remain an active patient. Marketing communications may be opted out of at any time.</p>
              <p className="mt-2"><strong>SMS/Text Messages:</strong> By providing your mobile number, you consent to receive text messages from Nature's Journey for service-related communications. Standard message and data rates may apply. Reply STOP to opt out of marketing texts. Opting out of clinical or safety-related texts may impact your care.</p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-lg font-bold text-navy">11. Intellectual Property</h2>
              <p>All content, features, software, trademarks, and functionality on the Nature's Journey platform are owned by Nature's Journey Health, LLC or its licensors and are protected by U.S. and international intellectual property laws. You may not reproduce, distribute, modify, create derivative works, publicly display, or commercially exploit any content without express prior written consent from Nature's Journey.</p>
              <p className="mt-2">You grant Nature's Journey a limited, non-exclusive, royalty-free license to use any content you submit (such as progress photos, feedback, or testimonials) solely to provide and improve our services, with your separate consent for any public use.</p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-lg font-bold text-navy">12. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Use the platform for any unlawful purpose or in violation of these Terms;</li>
                <li>Impersonate another person or create fraudulent accounts;</li>
                <li>Submit false, misleading, or incomplete health information;</li>
                <li>Attempt to obtain prescriptions for others or for redistribution;</li>
                <li>Harass, threaten, or abuse Nature's Journey staff, providers, or other users;</li>
                <li>Attempt to reverse-engineer, hack, or disrupt the platform or its infrastructure;</li>
                <li>Use automated means to access the platform without authorization.</li>
              </ul>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-lg font-bold text-navy">13. Disclaimer of Warranties</h2>
              <p>THE VITALPATH PLATFORM AND SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. VITALPATH DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.</p>
              <p className="mt-2">Nature's Journey does not guarantee specific health outcomes, weight loss results, or the effectiveness of any prescribed treatment for any individual. Individual results vary based on many factors including adherence, physiology, and lifestyle.</p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-lg font-bold text-navy">14. Limitation of Liability</h2>
              <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, VITALPATH, ITS OFFICERS, DIRECTORS, EMPLOYEES, AFFILIATES, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF PROFITS, DATA, GOODWILL, OR HEALTH OUTCOMES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICES.</p>
              <p className="mt-2">VITALPATH&rsquo;S TOTAL CUMULATIVE LIABILITY FOR ANY CLAIM ARISING OUT OF THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE TOTAL AMOUNT YOU PAID TO VITALPATH IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>
              <p className="mt-2">Some jurisdictions do not allow certain liability limitations; in such cases, the above limitations apply to the maximum extent permitted by law.</p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-lg font-bold text-navy">15. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless Nature's Journey and its officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys&rsquo; fees) arising out of or relating to: (a) your use of the services; (b) your violation of these Terms; (c) your provision of false or inaccurate health information; or (d) your violation of any third-party rights.</p>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-lg font-bold text-navy">16. Termination</h2>
              <p>Nature's Journey may suspend or terminate your account and access to services at any time, with or without notice, for any reason, including but not limited to violation of these Terms, fraudulent conduct, or if required by law or a healthcare provider.</p>
              <p className="mt-2">Upon termination, your right to access the platform ceases immediately. Provisions that by their nature should survive termination (including payment obligations, intellectual property, limitation of liability, and dispute resolution) shall survive.</p>
            </section>

            {/* 17 */}
            <section>
              <h2 className="text-lg font-bold text-navy">17. Dispute Resolution and Arbitration</h2>
              <p><strong>Informal Resolution:</strong> Before initiating any formal proceedings, you agree to contact Nature's Journey at care@naturesjourneyhealth.com and allow a 30-day period for good-faith informal resolution.</p>
              <p className="mt-2"><strong>Binding Arbitration:</strong> If informal resolution fails, any dispute arising out of or relating to these Terms or the services shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. Arbitration shall be conducted in Wilmington, Delaware, or virtually.</p>
              <p className="mt-2"><strong>Class Action Waiver:</strong> You waive any right to participate in a class action lawsuit or class-wide arbitration. All disputes must be resolved on an individual basis.</p>
              <p className="mt-2"><strong>Governing Law:</strong> These Terms are governed by the laws of the State of Delaware, without regard to conflict-of-law provisions. Any proceedings not subject to arbitration shall be brought in the state or federal courts of Delaware.</p>
              <p className="mt-2"><strong>Exceptions:</strong> Either party may seek emergency injunctive relief in a court of competent jurisdiction to prevent irreparable harm. Nothing in this section limits your right to file a complaint with a state medical board, state attorney general, or the HHS Office for Civil Rights.</p>
              <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-800">Note: Arbitration clauses and class action waivers may not be enforceable in all jurisdictions. This section has been reviewed by legal counsel and is intended to comply with applicable consumer protection laws.</p>
              </div>
            </section>

            {/* 18 */}
            <section>
              <h2 className="text-lg font-bold text-navy">18. State-Specific Provisions</h2>
              <p><strong>California Residents:</strong> Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have additional rights including the right to know, delete, correct, and opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal information. See our <Link href="/legal/privacy" className="text-teal underline hover:text-teal/80">Privacy Policy</Link> for California-specific rights.</p>
              <p className="mt-2">Under California Health &amp; Safety Code § 1789.51, California residents using telehealth services have the right to receive information about the provider&rsquo;s licensing, the nature of the telehealth interaction, and the right to request an in-person evaluation.</p>
              <p className="mt-2"><strong>New York Residents:</strong> In compliance with New York Education Law and the New York State Department of Health telehealth guidelines, providers serving New York patients are licensed in New York and comply with state-specific prescribing and telehealth standards.</p>
              <p className="mt-2"><strong>Texas Residents:</strong> In compliance with Texas Occupations Code Chapter 111, Texas Medical Board rules, and the Texas standard of care, providers serving Texas patients must establish a proper provider-patient relationship before prescribing. Nature's Journey&rsquo;s intake and evaluation process is designed to satisfy this requirement.</p>
              <p className="mt-2"><strong>All States:</strong> You are encouraged to familiarize yourself with your state&rsquo;s telehealth and compounding pharmacy regulations. Nature's Journey&rsquo;s compliance team monitors regulatory requirements and updates service delivery accordingly.</p>
            </section>

            {/* 19 */}
            <section>
              <h2 className="text-lg font-bold text-navy">19. Accessibility</h2>
              <p>Nature's Journey is committed to making our platform accessible to people with disabilities in compliance with the Americans with Disabilities Act (ADA) and Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. If you experience accessibility barriers, please contact us at care@naturesjourneyhealth.com or (888) 509-2745 so we can assist and improve.</p>
            </section>

            {/* 20 */}
            <section>
              <h2 className="text-lg font-bold text-navy">20. Changes to These Terms</h2>
              <p>Nature's Journey reserves the right to modify these Terms at any time. We will provide notice of material changes by email and/or prominent notice on our platform at least 14 days before the changes take effect. Your continued use of the services after the effective date constitutes acceptance of the revised Terms.</p>
            </section>

            {/* 21 */}
            <section>
              <h2 className="text-lg font-bold text-navy">21. Contact Information</h2>
              <div className="mt-2 rounded-xl border border-navy-100 bg-linen/40 p-4 text-sm">
                <p className="font-semibold text-navy">Nature's Journey Health, LLC</p>
                <p>1209 Orange St, Wilmington, DE 19801</p>
                <p className="mt-2">General inquiries: <a href="mailto:care@naturesjourneyhealth.com" className="text-teal underline hover:text-teal/80">care@naturesjourneyhealth.com</a></p>
                <p>Legal/Privacy: <a href="mailto:privacy@naturesjourneyhealth.com" className="text-teal underline hover:text-teal/80">privacy@naturesjourneyhealth.com</a></p>
                <p>Phone: (888) 509-2745</p>
              </div>
            </section>

          </div>
        </SectionShell>
      </section>
  );
}
