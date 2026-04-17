import { BadgeCheck, Stethoscope } from "lucide-react";

/**
 * LpProviderCredential — authority anchor.
 * Named provider + credentials + direct quote out-converts logos + "licensed providers" copy.
 * (Psychology: authority principle — Cialdini.)
 *
 * Currently shows a styled placeholder card with the AI-IMAGE prompt embedded as a
 * JSX comment. When a real headshot is added to /public/providers/ you can replace
 * the placeholder block with a <next/image> at the noted ratio.
 */

export interface ProviderCredentialData {
  name: string;
  credentials: string;
  bio: string;
  /** Midjourney/DALL-E-ready prompt describing the headshot this card should show. */
  imagePrompt: string;
  /** Optional path to a real headshot once available, e.g. "/providers/dr-chen.jpg" */
  imageSrc?: string;
}

interface LpProviderCredentialProps {
  provider: ProviderCredentialData;
  eyebrow?: string;
  heading?: string;
}

export function LpProviderCredential({
  provider,
  eyebrow = "MEDICAL OVERSIGHT",
  heading = "Care from board-certified clinicians",
}: LpProviderCredentialProps) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--lp-badge-text)" }}
          >
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-lp-heading sm:text-3xl">
            {heading}
          </h2>
        </div>

        <div
          className="grid gap-6 overflow-hidden rounded-3xl border bg-white p-6 shadow-sm sm:grid-cols-[220px_1fr] sm:p-8"
          style={{ borderColor: "var(--lp-card-border)" }}
        >
          {/* AI-IMAGE PLACEHOLDER
              ==================================================================
              Replace this block with <Image /> pointing at a real headshot.
              Aspect ratio: 1:1 (square).
              Prompt to generate the image:
              {provider.imagePrompt}
              ================================================================== */}
          {provider.imageSrc ? (
            <img
              src={provider.imageSrc}
              alt={`${provider.name}, ${provider.credentials}`}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          ) : (
            <div
              className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center"
              style={{
                borderColor: "var(--lp-card-border)",
                backgroundColor: "var(--lp-section-alt)",
              }}
            >
              <Stethoscope
                className="mb-3 h-10 w-10"
                style={{ color: "var(--lp-icon)" }}
              />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-lp-body-muted">
                AI Headshot
              </p>
              <p className="mt-1 text-[10px] text-lp-body-muted">
                Generate 1:1 portrait
              </p>
            </div>
          )}

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-lp-heading">
                {provider.name}
              </h3>
              <BadgeCheck
                className="h-5 w-5"
                style={{ color: "var(--lp-icon)" }}
              />
            </div>
            <p className="mt-1 text-sm font-semibold text-lp-body">
              {provider.credentials}
            </p>
            <blockquote className="mt-4 border-l-2 pl-4 text-sm italic text-lp-body leading-relaxed sm:text-base"
              style={{ borderColor: "var(--lp-divider)" }}
            >
              &ldquo;{provider.bio}&rdquo;
            </blockquote>
            <p className="mt-4 text-xs text-lp-body-muted">
              All prescribing decisions are made by US-licensed providers based on your
              individual health profile. Not all applicants qualify.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
