import type { Metadata } from "next";
import Link from "next/link";
import { Award, GraduationCap, Clock, ShieldCheck, ArrowRight, FileText, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Our Licensed Providers | Nature's Journey",
  description:
    "Meet the board-certified physicians and licensed providers behind Nature's Journey. All providers are state-licensed, board-certified, and specialize in obesity medicine and metabolic health.",
  openGraph: {
    title: "Our Licensed Providers | Nature's Journey",
    description:
      "Board-certified physicians licensed in all 50 states. Specializing in obesity medicine, endocrinology, and metabolic health.",
  },
};

const providerProfiles = [
  {
    name: "Dr. Sarah Chen, MD",
    title: "Chief Medical Officer",
    credentials: "Board-Certified in Internal Medicine",
    certifyingBoard: "American Board of Internal Medicine (ABIM)",
    institution: "Stanford School of Medicine",
    degree: "MD — Stanford University School of Medicine",
    experience: "15+ years in obesity medicine and metabolic health",
    specialties: ["Obesity Medicine", "Internal Medicine", "Metabolic Health"],
    initials: "SC",
    licenseStates: "Licensed in all 50 states",
    verifyNote: "License status verifiable through state medical board databases",
  },
  {
    name: "Dr. James Walker, DO",
    title: "Medical Director",
    credentials: "Board-Certified in Family Medicine",
    certifyingBoard: "American Board of Family Medicine (ABFM)",
    institution: "Johns Hopkins University",
    degree: "DO — Johns Hopkins University School of Medicine",
    experience: "12+ years in metabolic health and GLP-1 pharmacotherapy",
    specialties: ["Family Medicine", "Weight Management", "Preventive Care"],
    initials: "JW",
    licenseStates: "Licensed in all 50 states",
    verifyNote: "License status verifiable through state medical board databases",
  },
  {
    name: "Dr. Maria Rodriguez, MD",
    title: "Clinical Lead — Endocrinology",
    credentials: "Board-Certified in Endocrinology",
    certifyingBoard: "American Board of Internal Medicine — Endocrinology subspecialty",
    institution: "Mayo Clinic",
    degree: "MD — Mayo Clinic Alix School of Medicine",
    experience: "10+ years in endocrinology and weight management pharmacotherapy",
    specialties: ["Endocrinology", "Diabetes & Metabolic Disease", "Weight Management"],
    initials: "MR",
    licenseStates: "Licensed in all 50 states",
    verifyNote: "License status verifiable through state medical board databases",
  },
];

const providerModelFacts = [
  {
    icon: ShieldCheck,
    title: "Independent licensed providers",
    body: "Nature's Journey Health does not employ providers or practice medicine. All patient evaluations are performed by independently licensed physicians and medical professionals.",
  },
  {
    icon: FileText,
    title: "Evaluation process",
    body: "Every patient undergoes a structured clinical evaluation including health history review, BMI assessment, contraindication screening, and informed consent before any treatment is prescribed.",
  },
  {
    icon: Award,
    title: "Board certification",
    body: "All providers on our platform hold active board certifications in their specialty area. Certifications are issued by nationally recognized boards recognized by the American Board of Medical Specialties (ABMS) or American Osteopathic Association (AOA).",
  },
  {
    icon: GraduationCap,
    title: "Ongoing supervision",
    body: "Providers conduct follow-up evaluations, monitor outcomes, adjust dosing, and screen for adverse effects. Clinical oversight continues for the duration of the patient's program.",
  },
];

const verificationResources = [
  {
    name: "Federation of State Medical Boards (FSMB)",
    description: "DocInfo.org — search any U.S. physician license by name or state",
    url: "https://www.docinfo.org",
  },
  {
    name: "American Board of Medical Specialties (ABMS)",
    description: "Verify board certification for ABMS member boards",
    url: "https://www.certificationmatters.org",
  },
  {
    name: "National Provider Identifier (NPI) Registry",
    description: "CMS NPI Registry — public database of all licensed U.S. healthcare providers",
    url: "https://npiregistry.cms.hhs.gov",
  },
];

export default function ProvidersPage() {
  return (
    <MarketingShell>
      <WebPageJsonLd
        title="Our Licensed Providers | Nature's Journey"
        description="Board-certified physicians licensed in all 50 states specializing in obesity medicine and metabolic health."
        path="/providers"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Our Providers", href: "/providers" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-white py-16 lg:py-24">
        <SectionShell>
          <SectionHeading
            eyebrow="Medical Leadership"
            title="Board-certified providers. Licensed in every state."
            description="Every treatment plan at Nature's Journey is evaluated and managed by independently licensed physicians. Below you'll find their credentials, certifying boards, and how to independently verify their licenses."
          />
        </SectionShell>
      </section>

      {/* Provider cards */}
      <section className="py-16">
        <SectionShell>
          <div className="grid gap-8 lg:grid-cols-3">
            {providerProfiles.map((p) => (
              <div
                key={p.name}
                className="flex flex-col rounded-2xl border border-navy-100/60 bg-white p-8 shadow-premium"
              >
                {/* Avatar */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-navy to-atlantic text-xl font-bold text-white">
                  {p.initials}
                </div>

                <h2 className="mt-5 text-lg font-bold text-navy">{p.name}</h2>
                <p className="text-sm font-semibold text-teal">{p.title}</p>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <div>
                      <p className="font-medium text-graphite-700">{p.credentials}</p>
                      <p className="text-xs text-graphite-400">{p.certifyingBoard}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <div>
                      <p className="font-medium text-graphite-700">{p.degree}</p>
                      <p className="text-xs text-graphite-400">{p.institution}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <p className="text-graphite-600">{p.experience}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <p className="text-graphite-600">{p.licenseStates}</p>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[11px]">
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* Verification note */}
                <p className="mt-5 rounded-lg bg-teal-50/60 border border-teal-100 px-3 py-2 text-[11px] text-teal-700">
                  {p.verifyNote}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Provider model section */}
      <section className="bg-linen/40 py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Clinical Model"
            title="How our provider network works"
            description="Nature's Journey Health is a healthcare technology platform. We connect patients with independently licensed providers — we do not practice medicine."
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {providerModelFacts.map((fact) => (
              <div
                key={fact.title}
                className="flex gap-4 rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10">
                  <fact.icon className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">{fact.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-graphite-600">{fact.body}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* License verification section */}
      <section className="py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Credential Verification"
            title="Verify provider credentials independently"
            description="You can independently verify any provider's license status, board certifications, and disciplinary history through the following publicly accessible registries."
          />

          <div className="mx-auto max-w-3xl space-y-4">
            {verificationResources.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-4 rounded-xl border border-navy-100/60 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg hover:border-teal/40"
              >
                <div>
                  <p className="font-semibold text-navy">{r.name}</p>
                  <p className="mt-1 text-sm text-graphite-500">{r.description}</p>
                </div>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-graphite-300" />
              </a>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-graphite-400">
            If you have questions about a specific provider&apos;s credentials, contact our care team.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-graphite-500">
            <a href="tel:18885092745" className="flex items-center gap-2 hover:text-navy transition-colors">
              <Phone className="h-4 w-4" />
              (888) 509-2745
            </a>
            <a href="mailto:support@naturesjourneyhealth.com" className="flex items-center gap-2 hover:text-navy transition-colors">
              <Mail className="h-4 w-4" />
              support@naturesjourneyhealth.com
            </a>
          </div>
        </SectionShell>
      </section>

      {/* Pharmacy section */}
      <section className="bg-linen/40 py-16">
        <SectionShell>
          <div className="mx-auto max-w-3xl rounded-2xl border border-navy-100/40 bg-white p-8 shadow-premium">
            <h2 className="text-xl font-bold text-navy">Pharmacy partners</h2>
            <p className="mt-3 text-sm leading-relaxed text-graphite-600">
              Medications prescribed through Nature's Journey are dispensed exclusively by state-licensed
              compounding pharmacies holding active 503A or 503B facility registrations with the U.S. Food
              and Drug Administration (FDA). All pharmacy partners are inspected by state boards of pharmacy
              and subject to federal compounding standards under the Drug Quality and Security Act (DQSA).
            </p>
            <p className="mt-3 text-sm leading-relaxed text-graphite-600">
              <strong>Important:</strong> Compounded semaglutide and tirzepatide are not FDA-approved drug
              products and are not equivalent to brand-name Ozempic, Wegovy, Mounjaro, or Zepbound.
              Prescriptions are issued at the discretion of a licensed provider following a complete clinical
              evaluation.
            </p>
            <p className="mt-4 text-xs text-graphite-400">
              FDA 503A/503B registrations are publicly verifiable through the{" "}
              <a
                href="https://www.fda.gov/drugs/human-drug-compounding/registered-outsourcing-facilities"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline"
              >
                FDA Registered Outsourcing Facilities database
              </a>
              .
            </p>
          </div>
        </SectionShell>
      </section>

      {/* CTA */}
      <section className="py-16">
        <SectionShell>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-navy">
              Ready to be evaluated by a licensed provider?
            </h2>
            <p className="mt-3 text-graphite-500">
              Complete a free 2-minute assessment and a board-certified provider will review your profile
              within 1 business day.
            </p>
            <div className="mt-8">
              <Link href="/qualify">
                <Button size="lg" className="gap-2 px-8">
                  Start Free Assessment <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-graphite-400">
              Treatment eligibility determined by your provider. Medication prescribed only when clinically appropriate.
            </p>
          </div>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
