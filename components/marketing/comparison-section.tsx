import Link from "next/link";
import { Check, X, Minus, ArrowRight } from "lucide-react";
import { comparisonRows } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { cn } from "@/lib/utils";

function CellValue({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="mx-auto h-5 w-5 text-teal" />;
  if (value === false)
    return <X className="mx-auto h-5 w-5 text-red-400" />;
  if (value === "N/A")
    return <Minus className="mx-auto h-5 w-5 text-graphite-300" />;
  if (value === "Sometimes")
    return <span className="text-sm text-graphite-400">Sometimes</span>;
  return <span className="text-sm text-graphite-600">{value}</span>;
}

export function ComparisonSection() {
  return (
    <section className="py-20 lg:py-28">
      <SectionShell>
        <SectionHeading
          eyebrow="Compare Your Options"
          title="See how Nature's Journey stacks up"
          description="Get the same active ingredients as Ozempic and Wegovy — with comprehensive support — at a fraction of the cost."
        />

        {/* Mobile: Nature's Journey vs Brand-Name card comparison */}
        <AnimateOnView className="lg:hidden">
          <div className="space-y-3">
            {comparisonRows.map((row) => (
              <div key={row.feature} className="flex items-center justify-between rounded-xl border border-navy-100/60 bg-white p-4">
                <span className="text-sm font-medium text-navy flex-1">{row.feature}</span>
                <div className="flex gap-6 shrink-0">
                  <div className="text-center w-20">
                    <div className="text-xs text-teal font-semibold mb-1">Nature's Journey</div>
                    <CellValue value={row.vitalpath} />
                  </div>
                  <div className="text-center w-20">
                    <div className="text-xs text-graphite-400 mb-1">Brand-Name</div>
                    <CellValue value={row.branded} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnView>

        {/* Desktop: Full comparison table */}
        <AnimateOnView className="hidden lg:block">
          <div className="overflow-x-auto rounded-2xl border border-navy-100/60 shadow-premium-lg">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-navy-100/40">
                  <th className="p-4 text-left text-sm font-semibold text-graphite-500">
                    Feature
                  </th>
                  <th className="bg-teal-50/50 p-4 text-center">
                    <div className="text-sm font-bold text-teal">Nature's Journey</div>
                    <div className="text-xs text-graphite-400">From $179/mo</div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-sm font-semibold text-graphite-500">Brand-Name GLP-1</div>
                    <div className="text-xs text-graphite-400">Ozempic/Wegovy</div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-sm font-semibold text-graphite-500">Bariatric Surgery</div>
                    <div className="text-xs text-graphite-400">Gastric bypass/sleeve</div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="text-sm font-semibold text-graphite-500">Diet Programs</div>
                    <div className="text-xs text-graphite-400">WW/Noom/etc.</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "border-b border-navy-100/20 transition-colors hover:bg-navy-50/30",
                      i % 2 === 0 && "bg-cloud"
                    )}
                  >
                    <td className="p-4 text-sm font-medium text-navy">
                      {row.feature}
                    </td>
                    <td className="bg-teal-50/30 p-4 text-center font-semibold text-teal">
                      <CellValue value={row.vitalpath} />
                    </td>
                    <td className="p-4 text-center">
                      <CellValue value={row.branded} />
                    </td>
                    <td className="p-4 text-center">
                      <CellValue value={row.surgery} />
                    </td>
                    <td className="p-4 text-center">
                      <CellValue value={row.diets} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimateOnView>

        {/* Savings callout */}
        <AnimateOnView className="mt-8" delay={0.2}>
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-teal to-atlantic p-6 text-center text-white shadow-glow">
            <p className="text-2xl font-bold sm:text-3xl">
              Save up to $12,840/year
            </p>
            <p className="mt-2 text-sm text-teal-100">
              compared to brand-name GLP-1 retail pricing ($1,349/mo &times; 12 = $16,188 vs Nature's Journey at $179/mo &times; 12 = $3,348)
            </p>
            <Link href="/qualify" className="mt-4 inline-block">
              <Button variant="gold" className="gap-2">
                See If I Qualify <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
