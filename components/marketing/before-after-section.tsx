"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import {
  BeforeAfterCarousel,
  type Transformation,
  type BeforeAfterPhoto,
} from "./before-after-carousel";

interface BeforeAfterSectionProps {
  transformations?: Transformation[];
  photos?: BeforeAfterPhoto[];
  blur?: { before: string; after: string };
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function BeforeAfterSection({
  transformations,
  photos,
  blur,
  eyebrow = "Real Transformations",
  title = "See what's possible",
  description = "Real members, real results. Photos shared with written consent.",
}: BeforeAfterSectionProps = {}) {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-sage/20">
      <SectionShell>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mx-auto max-w-5xl">
          <AnimateOnView>
            <BeforeAfterCarousel
              transformations={transformations}
              photos={photos}
              blur={blur}
            />
          </AnimateOnView>

          <div className="mt-8 text-center">
            <Link href="/qualify">
              <Button className="gap-2">
                Start Your Transformation <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-center text-[10px] text-graphite-300">
            {siteConfig.compliance.resultsDisclaimer}
          </p>
        </div>
      </SectionShell>
    </section>
  );
}
