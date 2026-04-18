import { Check } from "lucide-react";
import { HeroSection } from "./hero-section";
import { getDeadlineMonth } from "@/lib/seasonal-month";

const BULLETS = [
  "2-minute approval",
  "Real doctor-prescribed medicine — no hassle",
  "No insurance needed",
  "Fast shipping in 24–48 hours",
  "Many members see changes within weeks*",
];

const FOOTNOTE_V2 =
  "† STEP-1 trial (Wilding et al., NEJM 2021): once-weekly semaglutide 2.4mg plus lifestyle averaged ~14.9% body-weight loss vs ~2.4% with placebo plus lifestyle at 68 weeks. Individual results vary. Compounded semaglutide/tirzepatide are not FDA-approved.";

export function HeroSectionV2() {
  const month = getDeadlineMonth();

  const headline = (
    <>
      Lose that stubborn belly fat by{" "}
      <span className="relative inline-block">
        {month}.
        <svg
          className="absolute -bottom-1 left-0 w-full"
          viewBox="0 0 200 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 5.5C40 2 80 2 100 3.5C120 5 160 6 199 3"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      </span>{" "}
      <span className="block text-[0.72em] font-semibold text-graphite-600 sm:text-[0.6em] mt-3">
        Medicine that works{" "}
        <span className="text-emerald-700">up to 3x better</span>
        <sup className="text-graphite-400">†</sup> than diet and exercise alone.
      </span>
    </>
  );

  const subContent = (
    <>
      <ul
        className="animate-fade-in-up mt-6 space-y-2.5 max-w-xl lg:mx-0 mx-auto"
        style={{ animationDelay: "0.2s" }}
      >
        {BULLETS.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-left">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
            </span>
            <span className="text-base leading-relaxed text-graphite-600 sm:text-lg">
              {bullet}
            </span>
          </li>
        ))}
      </ul>
      <p
        className="animate-fade-in-up mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1.5 text-[11px] font-medium text-emerald-700 lg:mx-0 mx-auto"
        style={{ animationDelay: "0.25s" }}
      >
        Prescription only if medically appropriate. Individual results vary.
      </p>
    </>
  );

  return (
    <HeroSection
      headline={headline}
      subContent={subContent}
      footnote={FOOTNOTE_V2}
      analyticsLocation="hero_v2"
    />
  );
}
