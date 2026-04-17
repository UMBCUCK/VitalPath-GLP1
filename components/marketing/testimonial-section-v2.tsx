"use client";

import { AnimateOnView } from "@/components/shared/animate-on-view";
import { TestimonialSection } from "./testimonial-section";
import { BeforeAfterCarousel } from "./before-after-carousel";
import { transformationsV2, beforeAfterImagesV2, beforeAfterBlurV2 } from "@/lib/images";

export function TestimonialSectionV2() {
  return (
    <TestimonialSection
      afterRatingSummary={
        <AnimateOnView className="mb-12">
          <div className="mb-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-800">
              Real transformations
            </span>
            <h3 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
              Before &amp; after — real members
            </h3>
            <p className="mt-2 text-sm text-graphite-500">
              Photos shared with written consent. Results vary.
            </p>
          </div>
          <BeforeAfterCarousel
            transformations={transformationsV2}
            photos={beforeAfterImagesV2}
            blur={beforeAfterBlurV2}
          />
        </AnimateOnView>
      }
    />
  );
}
