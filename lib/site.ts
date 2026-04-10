export const siteConfig = {
  name: "VitalPath",
  legalName: "VitalPath Health, LLC",
  tagline: "Clinically informed weight management, delivered to your door.",
  description:
    "Provider-guided care with personalized treatment plans, ongoing support, and practical tools designed to help you build real momentum.",
  url: process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""),
  domain: "naturesJourneyhealth.com",
  support: {
    email: "care@naturesjourneyhealth.com",
    phone: "(888) 509-2745",
  },
  social: {
    instagram: "https://instagram.com/naturesjourneyhealth",
    twitter: "https://twitter.com/naturesjourneyhealth",
  },
  socialProof: {
    rating: 4.9,
    reviewCount: "2,400+",
    memberCount: "18,000+",
  },
  compliance: {
    shortDisclaimer:
      "Compounded medications are not FDA-approved. They are prepared by state-licensed pharmacies and prescribed by licensed providers after clinical evaluation. Individual results vary. Medication is only available to eligible patients as determined by a licensed provider.",
    visualizerDisclaimer:
      "This is an artistic simulation for illustrative purposes only. Individual results vary based on many factors. This is not a guarantee or prediction of results.",
    supplementDisclaimer:
      "These statements have not been evaluated by the FDA. These products are not intended to diagnose, treat, cure, or prevent any disease. Nutritional support products are wellness tools, not medications.",
    eligibilityDisclaimer:
      "Treatment eligibility is determined by a licensed medical provider. Not all patients qualify for medication-based treatment. Alternative care paths are available.",
    resultsDisclaimer:
      "Results shown are individual experiences and may not be typical. Outcomes depend on many factors including adherence to treatment plans, diet, exercise, and individual health conditions.",
  },
  navigation: {
    main: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Medications", href: "/medications" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
      { label: "Results", href: "/results" },
    ],
    footer: {
      programs: [
        { label: "Weight Management", href: "/pricing" },
        { label: "Semaglutide", href: "/semaglutide" },
        { label: "Tirzepatide", href: "/tirzepatide" },
        { label: "For Women (PCOS & Menopause)", href: "/women" },
        { label: "For Men (Visceral Fat)", href: "/men" },
        { label: "PCOS Weight Loss", href: "/pcos" },
        { label: "Heart Health & GLP-1", href: "/heart-health" },
        { label: "Weight Loss After 50", href: "/over-50" },
        { label: "Prediabetes Treatment", href: "/prediabetes" },
        { label: "Maintenance Program", href: "/maintenance" },
        { label: "Compare Programs", href: "/compare" },
      ],
      resources: [
        { label: "GLP-1 Weight Loss Guide", href: "/guide" },
        { label: "GLP-1 Cost & Pricing", href: "/glp1-cost" },
        { label: "Free Tools & Calculators", href: "/tools" },
        { label: "Meal Plans & Recipes", href: "/meals" },
        { label: "Glossary", href: "/glossary" },
        { label: "FAQ", href: "/faq" },
        { label: "FAQ: Semaglutide", href: "/faq/semaglutide" },
        { label: "FAQ: Side Effects", href: "/faq/side-effects" },
        { label: "FAQ: Getting Started", href: "/faq/getting-started" },
        { label: "Free GLP-1 Starter Guide", href: "/free-guide" },
      ],
      company: [
        { label: "About VitalPath", href: "/about" },
        { label: "Results & Stories", href: "/results" },
        { label: "Blog", href: "/blog" },
        { label: "Refer a Friend", href: "/referrals" },
        { label: "State Availability", href: "/states" },
      ],
      legal: [
        { label: "Terms of Service", href: "/legal/terms" },
        { label: "Privacy Policy", href: "/legal/privacy" },
        { label: "HIPAA Notice", href: "/legal/hipaa" },
      ],
    },
  },
} as const;
