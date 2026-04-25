import { ChevronDown } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";

export interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  title?: string;
  eyebrow?: string;
  description?: string;
  items: FaqItem[];
  defaultOpenFirst?: boolean;
}

export function LandingFaq({
  title = "Common questions, answered honestly",
  eyebrow = "FAQ",
  description,
  items,
  defaultOpenFirst = true,
}: Props) {
  return (
    <section className="py-20">
      <SectionShell>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {items.map((item, i) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-navy-100/60 bg-white shadow-sm transition-all open:shadow-premium open:border-teal/30 hover:border-navy-200"
              open={defaultOpenFirst && i === 0}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 sm:p-6">
                <h3 className="font-bold text-navy leading-snug pr-4">{item.q}</h3>
                <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-graphite-400 transition-transform duration-300 group-open:rotate-180 group-open:text-teal" />
              </summary>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <p className="text-sm leading-relaxed text-graphite-600">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
