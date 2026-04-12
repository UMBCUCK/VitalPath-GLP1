export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "HIPAA Notice of Privacy Practices",
  description: "Nature's Journey HIPAA Notice of Privacy Practices — how your Protected Health Information is used, disclosed, and protected.",
};

export default function HipaaPage() {
  return (
    <section className="py-16">
        <SectionShell className="max-w-3xl">
          <Badge variant="secondary" className="mb-4 gap-1.5"><Shield className="h-3 w-3" /> HIPAA Compliant</Badge>
          <h1 className="text-3xl font-bold text-navy">Notice of Privacy Practices</h1>
          <p className="mt-2 text-sm text-graphite-400">Effective Date: April 10, 2026 &nbsp;·&nbsp; Version 2.0</p>

          <div className="mt-6 rounded-2xl border border-teal/20 bg-teal-50/30 p-6">
            <p className="text-sm font-semibold text-navy uppercase tracking-wide">THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</p>
          </div>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-graphite-600">

            <section>
              <h2 className="text-lg font-bold text-navy">1. Who Is Covered by This Notice</h2>
              <p>This Notice applies to Nature's Journey Health, LLC and the healthcare providers, nurses, care coordinators, and other workforce members who access your Protected Health Information (PHI) in connection with services provided through the Nature's Journey platform. It also applies to business associates who handle PHI on our behalf under written Business Associate Agreements (BAAs).</p>
              <p className="mt-2">Nature's Journey operates as a Covered Entity under the Health Insurance Portability and Accountability Act of 1996 (HIPAA), as amended by the Health Information Technology for Economic and Clinical Health (HITECH) Act, and the regulations promulgated thereunder (45 CFR Parts 160 and 164).</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">2. What Is Protected Health Information (PHI)</h2>
              <p>PHI is individually identifiable health information that relates to your past, present, or future physical or mental health condition; the provision of healthcare to you; or the past, present, or future payment for healthcare. PHI includes both paper and electronic records (ePHI).</p>
              <p className="mt-2">Examples of PHI we collect and maintain include: your name, date of birth, contact information, health history, lab values, body measurements, photographs, prescription records, communications with your provider, and billing information when linked to health data.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">3. How We May Use and Disclose Your PHI</h2>
              <p>We use and disclose PHI for the following purposes without requiring your additional authorization:</p>

              <div className="mt-4 space-y-4">
                <div>
                  <p><strong>Treatment:</strong> We use PHI to provide, coordinate, and manage your healthcare. This includes sharing your information with your assigned provider, consulting providers, partner pharmacies, and laboratory services necessary for your care. For example, we transmit your prescription to our pharmacy partners to fulfill your medication order.</p>
                </div>
                <div>
                  <p><strong>Payment:</strong> We use PHI for billing, payment processing, and related activities, including verifying payment methods and processing subscription charges. Note that Nature's Journey does not bill third-party insurers for its membership services.</p>
                </div>
                <div>
                  <p><strong>Healthcare Operations:</strong> We use PHI for internal operational activities including quality improvement, care coordination, provider oversight, workforce training, legal compliance, and business planning. We apply the Minimum Necessary Standard — accessing or disclosing only the minimum PHI needed to accomplish each purpose.</p>
                </div>
                <div>
                  <p><strong>As Required by Law:</strong> We will disclose PHI when required by federal, state, or local law, including in response to valid court orders, subpoenas, or government investigations.</p>
                </div>
                <div>
                  <p><strong>Public Health Activities:</strong> We may disclose PHI to public health authorities for disease surveillance, reporting of adverse events (including to the FDA MedWatch program), and other legally required public health activities.</p>
                </div>
                <div>
                  <p><strong>Health Oversight:</strong> We may disclose PHI to governmental agencies conducting audits, investigations, or oversight of the healthcare system, including state medical boards and the HHS Office for Civil Rights (OCR).</p>
                </div>
                <div>
                  <p><strong>Serious Threats to Health or Safety:</strong> We may disclose PHI if necessary to prevent or lessen a serious and imminent threat to your health or safety or the health or safety of another person or the public.</p>
                </div>
                <div>
                  <p><strong>Business Associates:</strong> We may share your PHI with business associates — companies or individuals that perform services on our behalf that require access to PHI (such as cloud hosting, analytics, pharmacy coordination, and customer support). All business associates are required to sign a Business Associate Agreement (BAA) committing to HIPAA-compliant handling of your information. A list of categories of business associates is available upon request.</p>
                </div>
              </div>

              <p className="mt-4"><strong>Uses Requiring Your Written Authorization:</strong> We will not use or disclose your PHI for the following purposes without your express written authorization: (a) most uses of psychotherapy notes; (b) marketing communications; (c) sale of PHI; (d) any other use not described in this Notice. You may revoke any authorization at any time in writing, subject to actions already taken in reliance on that authorization.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">4. Your HIPAA Rights</h2>
              <ul className="space-y-4">
                <li>
                  <p><strong>Right to Access (Right of Access):</strong> You have the right to inspect and obtain a copy of your PHI maintained by Nature's Journey in a designated record set. Requests must be submitted in writing to privacy@naturesjourneyhealth.com. We will respond within 30 days (or 60 days with a written extension notice). We may charge a reasonable cost-based fee for copies. We will provide access in the format you request if readily producible, including electronic format.</p>
                </li>
                <li>
                  <p><strong>Right to Amend:</strong> You may request in writing that we amend PHI you believe is inaccurate or incomplete. We may deny your request if the information was not created by us, is not part of a designated record set, or is already accurate and complete. We will respond within 60 days.</p>
                </li>
                <li>
                  <p><strong>Right to an Accounting of Disclosures:</strong> You may request a list of certain disclosures we have made of your PHI in the past 6 years (or a shorter period you specify), excluding disclosures for treatment, payment, operations, and certain other exceptions. We will respond within 60 days.</p>
                </li>
                <li>
                  <p><strong>Right to Request Restrictions:</strong> You may request restrictions on how we use or disclose your PHI for treatment, payment, or operations. We are not required to agree to your request, except that we must agree to restrict disclosure to a health plan for a service you paid for entirely out-of-pocket and that the restriction is not otherwise required by law.</p>
                </li>
                <li>
                  <p><strong>Right to Confidential Communications:</strong> You may request that we contact you through specific means or at a specific location. We will accommodate reasonable requests.</p>
                </li>
                <li>
                  <p><strong>Right to Receive Notice of a Breach:</strong> You have the right to be notified in the event of a breach of your unsecured PHI, as described in Section 6 below.</p>
                </li>
                <li>
                  <p><strong>Right to Opt Out of Fundraising:</strong> Nature's Journey does not currently conduct fundraising. If we do in the future, you will have the right to opt out of receiving fundraising communications.</p>
                </li>
                <li>
                  <p><strong>Right to a Paper Copy of This Notice:</strong> You have the right to receive a paper copy of this Notice upon request, even if you agreed to receive it electronically.</p>
                </li>
              </ul>
              <p className="mt-4">To exercise any of these rights, contact our Privacy Officer at privacy@naturesjourneyhealth.com or (888) 509-2745.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">5. Safeguards — Administrative, Technical, and Physical</h2>
              <p>Nature's Journey maintains a comprehensive HIPAA Security Program in compliance with 45 CFR Part 164, Subpart C (Security Rule). Our safeguards include:</p>
              <ul className="mt-3 ml-4 list-disc space-y-2">
                <li><strong>Administrative:</strong> Designated Privacy Officer and Security Officer; documented privacy and security policies; annual workforce HIPAA training; sanctions for policy violations; regular risk analysis and risk management program.</li>
                <li><strong>Technical:</strong> AES-256 encryption of ePHI at rest and in transit (TLS 1.2+); role-based access controls with least-privilege principles; multi-factor authentication for workforce access; audit logging of all PHI access; automatic session timeouts; secure messaging for all provider-patient communications.</li>
                <li><strong>Physical:</strong> Secure cloud infrastructure hosted by SOC 2 Type II certified providers with Business Associate Agreements; no PHI stored on personal devices without encryption and remote-wipe capability; visitor controls at any physical locations where PHI is processed.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">6. Breach Notification</h2>
              <p>Nature's Journey follows the HIPAA Breach Notification Rule (45 CFR Part 164, Subpart D). A breach is an impermissible use or disclosure of unsecured PHI that compromises the security or privacy of the PHI, unless Nature's Journey can demonstrate a low probability that PHI was compromised based on a four-factor risk assessment.</p>
              <p className="mt-3"><strong>Individual Notification:</strong> We will notify you of a breach affecting your PHI without unreasonable delay and no later than 60 calendar days from discovery. Notification will be sent to your last known email address or mailing address and will include:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>A description of the breach and the date discovered;</li>
                <li>The types of PHI involved;</li>
                <li>Steps you can take to protect yourself;</li>
                <li>What Nature's Journey is doing to investigate and mitigate harm;</li>
                <li>Contact information for questions.</li>
              </ul>
              <p className="mt-3"><strong>HHS Notification:</strong> Breaches affecting 500 or more individuals will be reported to HHS contemporaneously with individual notification. Breaches affecting fewer than 500 individuals will be reported to HHS annually, within 60 days of the end of the calendar year in which the breach occurred.</p>
              <p className="mt-3"><strong>Media Notification:</strong> For breaches affecting 500 or more residents of a state or jurisdiction, we will notify prominent media outlets in that jurisdiction, in addition to individual and HHS notification.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">7. Data Retention</h2>
              <p>Nature's Journey retains PHI for the following minimum periods, or longer if required by applicable law:</p>
              <ul className="mt-3 ml-4 list-disc space-y-1">
                <li><strong>Medical records:</strong> 7 years from the date of service (or longer as required by state law);</li>
                <li><strong>Minor patient records:</strong> Until the patient reaches age 21, or 7 years from the last date of service, whichever is longer;</li>
                <li><strong>HIPAA policies and documentation:</strong> 6 years from creation or last effective date;</li>
                <li><strong>Breach documentation:</strong> 6 years;</li>
                <li><strong>Authorization forms:</strong> 6 years from the date of signature.</li>
              </ul>
              <p className="mt-2">After applicable retention periods, PHI is securely destroyed using methods that render it unrecoverable (e.g., cryptographic erasure for electronic records, cross-cut shredding for paper records).</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">8. De-Identified Data</h2>
              <p>Nature's Journey may de-identify PHI in accordance with 45 CFR § 164.514 using either the Safe Harbor method (removing 18 specified identifiers) or Expert Determination method (statistical confirmation of de-identification). De-identified data is no longer subject to HIPAA and may be used for research, product improvement, and aggregate analytics without restriction.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">9. Business Associate Agreements</h2>
              <p>All third parties that access PHI on Nature's Journey&rsquo;s behalf are required to execute a Business Associate Agreement (BAA) that obligates them to: (a) use PHI only for permitted purposes; (b) implement appropriate safeguards; (c) report breaches; (d) ensure their subcontractors comply; and (e) return or destroy PHI upon termination of the relationship.</p>
              <p className="mt-2">Categories of business associates include: cloud infrastructure providers, pharmacy management systems, telehealth technology providers, secure messaging platforms, and data analytics services. Nature's Journey&rsquo;s BAA template is available upon written request.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">10. Complaints and Enforcement</h2>
              <p>If you believe Nature's Journey has violated your privacy rights, you may file a complaint:</p>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl border border-navy-100 bg-linen/40 p-4">
                  <p className="font-semibold text-navy">Nature's Journey Privacy Officer</p>
                  <p>Email: <a href="mailto:privacy@naturesjourneyhealth.com" className="text-teal underline hover:text-teal/80">privacy@naturesjourneyhealth.com</a></p>
                  <p>Phone: (888) 509-2745</p>
                  <p>Mail: 1209 Orange St, Wilmington, DE 19801</p>
                </div>
                <div className="rounded-xl border border-navy-100 bg-linen/40 p-4">
                  <p className="font-semibold text-navy">HHS Office for Civil Rights (OCR)</p>
                  <p>Online: <a href="https://www.hhs.gov/hipaa/filing-a-complaint" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-teal/80">hhs.gov/hipaa/filing-a-complaint</a></p>
                  <p>Phone: 1-800-368-1019 (TDD: 1-800-537-7697)</p>
                  <p>Mail: Hubert H. Humphrey Building, 200 Independence Ave SW, Washington, DC 20201</p>
                </div>
              </div>
              <p className="mt-4 font-medium text-navy">You will not be penalized, retaliated against, or denied services for filing a complaint in good faith.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">11. Changes to This Notice</h2>
              <p>Nature's Journey reserves the right to change this Notice and to make the revised Notice effective for PHI we already maintain. We will post the current Notice prominently on our website and provide a copy upon request. Material changes will be communicated to active patients via email at least 30 days before the effective date.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy">12. Related Policies</h2>
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li><Link href="/legal/privacy" className="text-teal underline hover:text-teal/80">Privacy Policy</Link> — How we handle non-PHI data, cookies, and marketing</li>
                <li><Link href="/legal/terms" className="text-teal underline hover:text-teal/80">Terms of Service</Link> — Your rights and obligations as a Nature's Journey member</li>
                <li><Link href="/legal/baa" className="text-teal underline hover:text-teal/80">Business Associate Agreement</Link> — For covered entities that work with Nature's Journey</li>
              </ul>
            </section>

          </div>
        </SectionShell>
      </section>
  );
}
