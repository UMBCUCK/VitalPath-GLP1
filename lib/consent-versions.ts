/**
 * Versioned consent text for all consent types collected during intake.
 * When consent language changes, increment the version string.
 * ConsentRecord model stores both the version and the full text,
 * creating an immutable audit trail of what each patient agreed to.
 */

export const CONSENT_VERSIONS = {
  TREATMENT: {
    version: "2026-04-09-v1",
    text: "I consent to a telehealth evaluation by a licensed medical provider. I understand that treatment eligibility is determined by my provider, medication is only available to eligible patients, and compounded medications are not FDA-approved. I understand individual results vary. I acknowledge that my provider will review my medical history, current medications, and health conditions before making any prescribing decisions.",
  },
  HIPAA: {
    version: "2026-04-09-v1",
    text: "I authorize Nature's Journey and its affiliated providers and pharmacies to use and disclose my protected health information (PHI) for treatment, payment, and healthcare operations as described in the HIPAA Notice of Privacy Practices. I understand I may revoke this authorization in writing at any time, except to the extent that action has already been taken in reliance on it.",
  },
  TELEHEALTH: {
    version: "2026-04-09-v1",
    text: "I consent to receive healthcare services via telehealth technology. I understand the limitations of telehealth, including that the provider cannot physically examine me, and that I may be referred for in-person care if clinically appropriate. I understand that telehealth consultations are not a substitute for emergency medical care. In case of a medical emergency, I will call 911 or go to my nearest emergency room. I understand that my provider is licensed in the state where I receive care.",
  },
  MEDICATION_RISKS: {
    version: "2026-04-09-v1",
    text: "I acknowledge that GLP-1 receptor agonist medications carry potential risks and side effects including but not limited to: nausea, vomiting, diarrhea, constipation, abdominal pain, headache, fatigue, injection site reactions, pancreatitis, thyroid tumors (including medullary thyroid carcinoma), gallbladder problems, kidney problems, hypoglycemia (especially when combined with other diabetes medications), and allergic reactions. I understand that compounded semaglutide/tirzepatide are not FDA-approved products and are prepared by state-licensed compounding pharmacies. I have been informed of these risks and consent to treatment. [LEGAL REVIEW REQUIRED — exact risk language should be reviewed by medical and legal counsel]",
  },
} as const;

export type ConsentKey = keyof typeof CONSENT_VERSIONS;
