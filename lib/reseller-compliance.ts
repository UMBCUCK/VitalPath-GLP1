/**
 * Reseller Compliance Module
 * ─────────────────────────────────────────────────────────────
 * Contains all compliance training content, agreement text,
 * prohibited conduct lists, and onboarding validation logic.
 *
 * Legal framework: AKS, Stark Law, FDA, FTC, HIPAA, State AKS
 */

export const AGREEMENT_VERSION = "2026-04-11-v1";

// ─── Onboarding Steps ─────────────────────────────────────────

export const ONBOARDING_STEPS = [
  { step: 0, key: "welcome", title: "Program Overview", minReadSeconds: 120 },
  { step: 1, key: "training", title: "Compliance Training", minReadSeconds: 300 },
  { step: 2, key: "agreement", title: "Reseller Agreement", minReadSeconds: 180 },
  { step: 3, key: "attestation", title: "Healthcare Provider Attestation", minReadSeconds: 60 },
  { step: 4, key: "w9", title: "Tax Information (W-9)", minReadSeconds: 0 },
  { step: 5, key: "marketing", title: "Marketing Guidelines", minReadSeconds: 120 },
  { step: 6, key: "complete", title: "Onboarding Complete", minReadSeconds: 0 },
] as const;

export type OnboardingStepKey = (typeof ONBOARDING_STEPS)[number]["key"];

// ─── Compliance Training Content ──────────────────────────────

export const TRAINING_SECTIONS = [
  {
    id: "what-you-can-say",
    title: "What You CAN Say",
    subtitle: "Approved claims and marketing language",
    content: `
As a VitalPath reseller, you may make the following types of claims in your marketing:

APPROVED STATEMENTS:
• "VitalPath offers a telehealth weight management subscription that connects you with licensed providers."
• "Members get personalized treatment plans from board-certified providers."
• "Our platform provides access to FDA-approved and compounded weight loss medications when medically appropriate."
• "Pricing starts at $X/month for the membership subscription."
• "Join a program with ongoing provider support, meal planning, and progress tracking."
• "Licensed providers evaluate your eligibility during a telehealth consultation."

APPROVED CLAIMS ABOUT THE PLATFORM:
• VitalPath is a subscription-based telehealth platform
• Members receive personalized care from licensed providers
• The platform includes meal plans, progress tracking, and messaging
• Treatment decisions are made by independent licensed providers
• Multiple plan tiers are available at different price points

KEY PRINCIPLE: You are marketing a WELLNESS SUBSCRIPTION — not a specific medication, not a medical treatment, and not a guaranteed health outcome. All clinical decisions are made independently by licensed healthcare providers.
    `.trim(),
  },
  {
    id: "what-you-cannot-say",
    title: "What You CANNOT Say",
    subtitle: "Prohibited claims — FDA, FTC, and healthcare law violations",
    content: `
The following claims are STRICTLY PROHIBITED and may result in immediate termination, personal legal liability, and regulatory action against you and VitalPath.

PROHIBITED FDA CLAIMS — NEVER SAY:
✗ "Get the same medication as Ozempic/Wegovy/Mounjaro for less"
✗ "Our compounded semaglutide is just as effective as Novo Nordisk's"
✗ "FDA-approved weight loss medication" (compounded drugs are NOT FDA-approved)
✗ "Guaranteed weight loss of X pounds"
✗ "Lose X pounds in X weeks"
✗ "This medication will cure/treat [specific condition]"
✗ Any before/after photos with specific weight loss numbers attributed to a medication
✗ "Equivalent to" or "bioequivalent to" any brand-name drug
✗ Any claim that a compounded medication has been FDA-tested or FDA-cleared

PROHIBITED FTC CLAIMS — NEVER SAY:
✗ "Everyone qualifies for treatment"
✗ Testimonials without disclosure of your paid relationship
✗ "Results typical" or implying everyone gets the same results
✗ Income projections for the reseller program without basis
✗ Hidden affiliate relationships — you MUST disclose you earn commission

PROHIBITED HEALTHCARE CLAIMS — NEVER SAY:
✗ "You should try GLP-1 medications" (this is medical advice)
✗ "This medication is right for you" (only providers determine this)
✗ "Our doctors will prescribe you [specific medication]"
✗ Any recommendation of a specific drug, dose, or treatment protocol
✗ Anything that could be construed as diagnosing a condition

REMEMBER: Violation of these rules can result in FDA enforcement action, FTC fines of $51,744+ per violation, state attorney general investigation, and your personal civil liability. VitalPath will cooperate fully with regulators investigating unauthorized claims.
    `.trim(),
  },
  {
    id: "ftc-disclosure",
    title: "FTC Disclosure Requirements",
    subtitle: "How to properly disclose your paid relationship",
    content: `
Federal law requires you to disclose your material connection to VitalPath whenever you promote the platform. This is not optional.

WHEN DISCLOSURE IS REQUIRED:
• Every social media post mentioning VitalPath
• Every blog post, article, or review about the program
• Every email sent to promote VitalPath
• Every video, podcast, or live stream mentioning the platform
• Every in-person conversation where you recommend VitalPath
• Every paid advertisement or sponsored content
• Every text message, DM, or private message promoting signup

HOW TO DISCLOSE PROPERLY:
✓ "#ad" or "#sponsored" or "#partner" — visible, not buried in hashtag chains
✓ "I earn a commission when you sign up through my link"
✓ "Paid partner of VitalPath"
✓ "I'm a VitalPath reseller and earn commission on referrals"

PLACEMENT RULES:
• The disclosure must be in the SAME field of view as the claim
• On social media: within the first 3 lines of text (before the "more" fold)
• In video: spoken verbally AND in on-screen text at the beginning
• In emails: near the top, not buried in a footer
• On websites: on the same page as the promotion, above the fold

BAD DISCLOSURE (Non-Compliant):
✗ Disclosure only in your bio/about page
✗ "#ad" buried among 30 other hashtags
✗ "See my disclosure page for details" with a link
✗ Verbal mention only in a 60-second segment of a 30-minute video
✗ Disclosure in fine print that requires scrolling

The FTC can fine you personally up to $51,744 per violation. These rules apply regardless of the platform (Instagram, TikTok, YouTube, email, texting, in-person conversations).
    `.trim(),
  },
  {
    id: "hipaa-privacy",
    title: "HIPAA & Patient Privacy",
    subtitle: "Protecting patient health information",
    content: `
As a reseller, you may learn that certain people have signed up for a weight management program. This creates privacy obligations.

WHAT YOU MUST NEVER DO:
✗ Share the name of any person who signed up through your link with anyone else
✗ Post publicly that "[Name] is using VitalPath" or any similar statement
✗ Mention anyone's health condition, weight, medication, or treatment in connection with their VitalPath membership
✗ Contact a referred customer about their medical treatment or health outcomes
✗ Ask a referred customer about their prescription, dose, or medical details
✗ Use patient testimonials that reveal health information without their written HIPAA authorization
✗ Store, copy, or transmit any health information about referred customers
✗ Access any patient portal, medical record, or health data — even if a customer shares their login

WHAT YOU MAY DO:
✓ See aggregate statistics in your reseller dashboard (total customers, revenue earned)
✓ Know that someone signed up through your link (subscription status only)
✓ Ask someone if they'd like to learn about a weight management program (before signup)
✓ Share your own personal experience (if you are also a customer) with proper FTC disclosure

THE CORE RULE: Once someone becomes a patient of VitalPath's telehealth program, their health information is protected by HIPAA. You are not a healthcare provider and have no right to access, discuss, or share any health-related information.

PENALTIES: HIPAA violations carry fines from $100 to $50,000 per violation, up to $1.5 million per year per violation category. Criminal penalties include up to 10 years imprisonment for intentional disclosure.
    `.trim(),
  },
  {
    id: "state-rules",
    title: "State-Specific Requirements",
    subtitle: "Key state regulations you must follow",
    content: `
Healthcare referral laws vary by state. Several states have laws STRICTER than federal law that apply even to cash-pay services.

HIGH-RISK STATES (extra caution required):

CALIFORNIA (Cal. Bus. & Prof. Code § 650):
• Prohibits compensation for referring patients to any healthcare service, including cash-pay
• Applies to telehealth referrals originating in California
• If you market to California residents, you are marketing a SUBSCRIPTION, not referring patients

TEXAS (Tex. Occ. Code § 102.001):
• One of the broadest anti-kickback statutes; covers all healthcare referrals
• No intent requirement — strict liability
• If marketing to Texas residents, use only approved subscription-focused language

FLORIDA (Fla. Stat. § 817.505 — Patient Brokering Act):
• Felony to refer patients for commission in connection with healthcare services
• Applies to cash-pay services
• Marketing must clearly position VitalPath as a subscription/membership product

NEW YORK (N.Y. Pub. Health Law § 4550):
• Broad prohibition on healthcare referral fees
• Applies to all payers including cash-pay

FOR ALL STATES:
• Never position yourself as referring patients TO a doctor or FOR medication
• Always position yourself as promoting a wellness subscription/membership product
• Never guarantee that a specific medical service will be provided
• Never use language like "I'm referring you to a doctor who will prescribe..."
• Always use language like "I'm sharing a wellness platform you might find helpful"

You are selling a SUBSCRIPTION. Providers independently decide all clinical matters. This distinction protects you, protects VitalPath, and protects the people you introduce to the platform.
    `.trim(),
  },
  {
    id: "consequences",
    title: "Consequences of Violations",
    subtitle: "What happens when rules are broken",
    content: `
VitalPath takes compliance seriously. Healthcare regulations carry severe penalties for both the company and individual resellers.

VIOLATION TIERS:

TIER 1 — WARNING (First minor offense):
• Unapproved marketing material used without required disclosures
• Missing FTC disclosure on a post (correctable)
→ Written warning, mandatory re-training, 48-hour marketing pause

TIER 2 — SUSPENSION (Repeated or moderate offense):
• Continued use of unapproved materials after warning
• Making unverified health outcome claims
• Sharing individual customer subscription details publicly
→ 30-day suspension, commission hold, mandatory re-certification

TIER 3 — IMMEDIATE TERMINATION (Severe offense):
• Making drug efficacy claims for compounded medications
• Claiming FDA approval for non-FDA-approved products
• Sharing patient health information (HIPAA violation)
• Providing medical advice (practicing medicine without a license)
• Falsifying W-9 or tax information
• Any activity that triggers regulatory investigation
→ Immediate termination, all pending commissions forfeited, VitalPath may report to regulatory authorities

PERSONAL LIABILITY:
As an independent contractor (not an employee), YOU are personally liable for claims you make. VitalPath's reseller agreement includes an indemnification clause — if your marketing activity causes a regulatory investigation or lawsuit, you are responsible for costs and damages.

This is not theoretical. In 2023-2025, the FTC, FDA, and state attorneys general have brought dozens of enforcement actions against telehealth affiliates and their individual marketers. Individual fines have ranged from $10,000 to over $500,000.
    `.trim(),
  },
];

// ─── Reseller Agreement ───────────────────────────────────────

export const RESELLER_AGREEMENT = {
  version: AGREEMENT_VERSION,
  effectiveDate: "April 11, 2026",
  title: "VitalPath Independent Reseller Agreement",
  sections: [
    {
      id: "parties",
      title: "1. Parties and Recitals",
      content: `This Independent Reseller Agreement ("Agreement") is entered into between VitalPath Health, Inc. ("Company") and the individual or entity identified during the electronic onboarding process ("Reseller"). By completing the onboarding process and electronically signing this Agreement, Reseller agrees to be bound by all terms herein.

WHEREAS, Company operates a telehealth subscription platform offering weight management services; and
WHEREAS, Reseller desires to market Company's subscription products in exchange for commission compensation;
NOW, THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows.`,
    },
    {
      id: "relationship",
      title: "2. Independent Contractor Relationship",
      content: `Reseller is an independent contractor, not an employee, agent, partner, or joint venturer of Company. Reseller has no authority to bind Company, make representations on Company's behalf beyond approved marketing materials, or incur any obligations for Company. Reseller is solely responsible for all taxes, insurance, and expenses incurred in performance of this Agreement. Company will issue IRS Form 1099-NEC for annual compensation of $600 or more.`,
    },
    {
      id: "scope",
      title: "3. Scope of Authorized Activities",
      content: `Reseller is authorized ONLY to market Company's subscription membership products using pre-approved marketing materials. Reseller is NOT authorized to:
(a) Provide medical advice, diagnosis, or treatment recommendations;
(b) Make claims about the efficacy of any medication, including compounded pharmaceuticals;
(c) Represent that any compounded medication is FDA-approved;
(d) Guarantee specific health outcomes, weight loss results, or prescription issuance;
(e) Compare compounded medications to FDA-approved branded products;
(f) Access, collect, store, or transmit any patient health information;
(g) Represent to any person that they are an employee or agent of Company;
(h) Modify, alter, or create derivative works from Company's approved marketing materials without prior written approval;
(i) Market Company's services in any jurisdiction where Company is not authorized to operate;
(j) Make income claims or projections about the reseller program without documented basis.`,
    },
    {
      id: "compensation",
      title: "4. Compensation",
      content: `(a) Commission Structure: Reseller shall earn commission on qualifying subscription sales as specified in the Commission Schedule provided during onboarding and viewable in the Reseller Dashboard.
(b) Commission Basis: Commissions are calculated on subscription membership fees only — never on prescription costs, medication fees, or healthcare service charges.
(c) Payment Terms: Commissions are paid on the 1st and 15th of each month, subject to a minimum 30-day holding period from the date of the qualifying sale.
(d) W-9 Requirement: No commission payments will be processed until Reseller has submitted a valid IRS Form W-9 (for U.S. persons) or W-8BEN (for non-U.S. persons).
(e) Clawback: Company reserves the right to clawback commissions if the underlying sale is refunded, charged back, or determined to be fraudulent within 90 days.
(f) Cap: Monthly commission payments are subject to the cap specified in Reseller's tier configuration. Company may adjust caps with 30 days' written notice.
(g) No Override Payments: Reseller does not earn commissions, overrides, or bonuses based on the sales activity of other resellers, regardless of referral or recruitment relationship.`,
    },
    {
      id: "compliance",
      title: "5. Regulatory Compliance",
      content: `Reseller acknowledges and agrees that:
(a) Federal Anti-Kickback Statute: Compensation under this Agreement is for marketing a subscription product, not for referring patients to healthcare services. Reseller shall not take any action that would cause payments under this Agreement to constitute a kickback under 42 U.S.C. § 1320a-7b(b) or any state equivalent.
(b) FDA Compliance: Reseller shall make no claims regarding the safety, efficacy, or FDA approval status of any compounded or branded medication available through the platform.
(c) FTC Compliance: Reseller shall disclose their material connection to Company in all promotional content as required by 16 C.F.R. Part 255. Failure to disclose is grounds for immediate termination.
(d) HIPAA: Reseller is not a Business Associate of Company and shall not access, collect, use, or disclose any Protected Health Information as defined under 45 C.F.R. § 160.103.
(e) State Laws: Reseller shall comply with all applicable state anti-kickback, consumer protection, and business opportunity laws in each jurisdiction where Reseller conducts marketing activities.
(f) Stark Law: Reseller represents and warrants that they are not a licensed healthcare provider who refers patients to Company or its affiliated providers, and that no member of their immediate family holds such a relationship.`,
    },
    {
      id: "prohibited-persons",
      title: "6. Prohibited Persons",
      content: `The following persons may not serve as Resellers:
(a) Licensed healthcare providers (MD, DO, NP, PA, RN) who refer or may refer patients to Company or its telehealth vendors;
(b) Pharmacists, pharmacy technicians, or owners of pharmacies that dispense medications for Company's patients;
(c) Employees or contractors of Company's telehealth or pharmacy vendors;
(d) Persons listed on the OIG Exclusion List (health.hhs.gov/exclusions) or SAM.gov;
(e) Persons convicted of healthcare fraud, wire fraud, or any felony within the past 10 years;
(f) Persons under 18 years of age;
(g) Insurance agents or brokers receiving health insurance commissions from the same patient population.`,
    },
    {
      id: "marketing",
      title: "7. Marketing Materials and Pre-Approval",
      content: `(a) Pre-Approval Required: All marketing materials must be pre-approved by Company's compliance team before use. Company will provide a library of approved materials.
(b) Modifications Prohibited: Reseller may not modify, edit, or create derivative works from approved materials without prior written consent.
(c) Custom Content: Reseller may submit custom marketing content for approval. Company will review within 5 business days.
(d) Monitoring: Company reserves the right to monitor Reseller's marketing activities and social media presence for compliance.
(e) Takedown: Company may require immediate removal of any non-compliant content. Failure to remove within 24 hours of notice is grounds for suspension.`,
    },
    {
      id: "termination",
      title: "8. Term and Termination",
      content: `(a) Term: This Agreement remains in effect until terminated by either party.
(b) Termination Without Cause: Either party may terminate with 30 days' written notice.
(c) Termination for Cause: Company may terminate immediately without notice for:
   (i) Any regulatory compliance violation;
   (ii) Making unauthorized drug efficacy or FDA claims;
   (iii) Disclosing patient health information;
   (iv) Providing medical advice without a license;
   (v) Falsification of W-9 or other required documentation;
   (vi) Three or more compliance warnings within a 12-month period;
   (vii) Any activity that triggers a regulatory investigation.
(d) Effect of Termination: Upon termination, all pending commissions for the current period remain payable if no compliance violation is the cause. Commissions for the period in which a for-cause termination occurs are forfeited.
(e) Survival: Sections 5, 9, 10, and 11 survive termination.`,
    },
    {
      id: "indemnification",
      title: "9. Indemnification",
      content: `Reseller shall indemnify, defend, and hold harmless Company, its officers, directors, employees, and agents from and against all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to:
(a) Reseller's breach of this Agreement;
(b) Reseller's marketing activities, including unauthorized claims;
(c) Any regulatory investigation or enforcement action triggered by Reseller's conduct;
(d) Any third-party claim arising from Reseller's representations about Company's products or services.`,
    },
    {
      id: "confidentiality",
      title: "10. Confidentiality",
      content: `Reseller agrees to maintain the confidentiality of all non-public information disclosed by Company, including but not limited to: commission rates, business strategies, customer data (to the extent lawfully provided), internal policies, and proprietary technology. This obligation survives termination for a period of 3 years.`,
    },
    {
      id: "general",
      title: "11. General Provisions",
      content: `(a) Governing Law: This Agreement is governed by the laws of the State of [Company's State], without regard to conflict of law principles.
(b) Dispute Resolution: Disputes shall be resolved through binding arbitration under AAA Commercial Arbitration Rules.
(c) Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations and agreements.
(d) Amendment: Company may amend this Agreement with 30 days' notice. Continued participation after the notice period constitutes acceptance.
(e) Severability: If any provision is held invalid, the remaining provisions remain in full force.
(f) Assignment: Reseller may not assign this Agreement without Company's prior written consent.
(g) Electronic Signatures: The parties agree that electronic signatures are legally binding and equivalent to handwritten signatures.`,
    },
  ],
  acknowledgmentCheckboxes: [
    "I have read and understand the entire Reseller Agreement.",
    "I understand I am an independent contractor, not an employee of VitalPath.",
    "I will not make drug efficacy claims or represent compounded medications as FDA-approved.",
    "I will disclose my paid relationship with VitalPath in all promotional content.",
    "I will not access, collect, or share patient health information.",
    "I understand that violations may result in immediate termination and personal liability.",
    "I am not a licensed healthcare provider who refers patients to VitalPath or its vendors.",
  ],
};

// ─── Healthcare Provider Attestation ──────────────────────────

export const ATTESTATION_TEXT = `
HEALTHCARE PROVIDER ATTESTATION AND REPRESENTATION

I, the undersigned, hereby represent and warrant that:

1. I am NOT a licensed healthcare provider (including but not limited to: physician (MD/DO), nurse practitioner, physician assistant, registered nurse, pharmacist, or any other individual with prescribing authority) who currently refers, or may in the future refer, patients to VitalPath Health, Inc. or any of its affiliated telehealth providers.

2. No member of my immediate family (spouse, parent, child, sibling) holds a financial relationship with VitalPath's telehealth or pharmacy vendors that would create a prohibited referral arrangement under the Stark Law (42 U.S.C. § 1395nn) or any state equivalent.

3. I am not employed by, contracted with, or financially affiliated with any pharmacy (503A or 503B) that dispenses medications for VitalPath's patients.

4. I am not listed on the Office of Inspector General (OIG) Exclusion List or the System for Award Management (SAM.gov) exclusion database.

5. I have not been convicted of healthcare fraud, wire fraud, money laundering, or any felony offense within the past 10 years.

6. I understand that any misrepresentation in this attestation constitutes grounds for immediate termination without compensation and may result in legal action.

I make this attestation under penalty of perjury and understand that VitalPath relies on the truthfulness of these representations in allowing me to participate in the reseller program.
`.trim();

// ─── Marketing Guidelines Content ─────────────────────────────

export const MARKETING_GUIDELINES = {
  title: "Marketing Guidelines & Approved Materials",
  intro: `All reseller marketing must be pre-approved or use the templates provided below. Custom content requires submission for review (5 business day turnaround).`,
  approvedTemplates: [
    {
      name: "Social Media Post — General",
      text: `Looking for a personalized weight management program? I've been working with @VitalPath — a telehealth platform where licensed providers create custom treatment plans. Check it out: [YOUR LINK] #partner #ad`,
    },
    {
      name: "Social Media Post — Platform Features",
      text: `What I love about the VitalPath platform: personalized provider consultations, meal planning tools, progress tracking, and ongoing support — all from home. Learn more: [YOUR LINK] #sponsored #partner`,
    },
    {
      name: "Email Template — Warm Introduction",
      text: `Subject: Something I've been meaning to share

Hi [Name],

I wanted to share a telehealth weight management platform I've been really impressed with. VitalPath connects you with licensed providers who create personalized treatment plans.

What sets them apart: ongoing provider support, meal planning, progress tracking tools, and everything is managed through their app.

If you're interested, you can learn more here: [YOUR LINK]

Full disclosure: I'm a VitalPath partner and earn a referral commission if you subscribe.

[Your Name]`,
    },
    {
      name: "Blog/Website Copy — Program Description",
      text: `VitalPath is a telehealth weight management subscription. Members are connected with board-certified providers who evaluate their health history and create personalized treatment plans. The platform includes progress tracking, meal planning tools, and secure messaging with your care team. Plans start at [PRICE]/month. Prescriptions, if clinically appropriate, are determined solely by the treating provider. [DISCLOSURE: I'm a VitalPath affiliate partner and earn commission on subscriptions through my link.]`,
    },
  ],
  prohibitedPhrases: [
    "Same as Ozempic / Wegovy / Mounjaro",
    "FDA-approved weight loss medication",
    "Guaranteed to lose [X] pounds",
    "Our doctors will prescribe you...",
    "Equivalent to [brand name drug]",
    "Clinically proven to...",
    "Cures / treats [medical condition]",
    "Everyone qualifies",
    "Get your prescription today",
    "Weight loss medication for only $X",
  ],
};

// ─── Validation Helpers ───────────────────────────────────────

export function validateW9Data(data: {
  legalName?: string;
  taxClassification?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zip?: string;
  tinType?: string;
  tinLast4?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.legalName?.trim()) errors.push("Legal name is required.");
  if (!data.taxClassification) errors.push("Tax classification is required.");
  if (!data.addressLine1?.trim()) errors.push("Address is required.");
  if (!data.city?.trim()) errors.push("City is required.");
  if (!data.state?.trim()) errors.push("State is required.");
  if (!data.zip?.trim() || !/^\d{5}(-\d{4})?$/.test(data.zip.trim()))
    errors.push("Valid ZIP code is required.");
  if (!data.tinType || !["SSN", "EIN"].includes(data.tinType))
    errors.push("TIN type (SSN or EIN) is required.");
  if (!data.tinLast4?.trim() || !/^\d{4}$/.test(data.tinLast4.trim()))
    errors.push("Last 4 digits of TIN are required.");
  return { valid: errors.length === 0, errors };
}

export function isOnboardingComplete(profile: {
  onboardingCompletedAt: Date | null;
  complianceTrainingCompletedAt: Date | null;
  agreementSignedAt: Date | null;
  w9SubmittedAt: Date | null;
  healthcareProviderAttestation: boolean;
}): boolean {
  return !!(
    profile.onboardingCompletedAt &&
    profile.complianceTrainingCompletedAt &&
    profile.agreementSignedAt &&
    profile.w9SubmittedAt &&
    profile.healthcareProviderAttestation
  );
}

export function canReceivePayout(profile: {
  onboardingCompletedAt: Date | null;
  w9SubmittedAt: Date | null;
  status: string;
  oigCheckResult: string | null;
}): { allowed: boolean; reason?: string } {
  if (profile.status !== "ACTIVE")
    return { allowed: false, reason: "Account is not active" };
  if (!profile.onboardingCompletedAt)
    return { allowed: false, reason: "Onboarding not completed" };
  if (!profile.w9SubmittedAt)
    return { allowed: false, reason: "W-9 not submitted" };
  if (profile.oigCheckResult === "FLAGGED")
    return { allowed: false, reason: "OIG exclusion check flagged" };
  return { allowed: true };
}
