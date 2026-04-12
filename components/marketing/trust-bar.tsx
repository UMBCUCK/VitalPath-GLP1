import { Shield, Award, Building2, FileCheck } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { mediaLogos } from "@/lib/content";

export function TrustBar() {
  return (
    <section className="border-y border-navy-100/40 bg-white py-6">
      <SectionShell>
        {/* Media logos - "As Seen In" */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-graphite-300">
            As featured in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
            {mediaLogos.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-graphite-300 transition-colors hover:text-graphite-500 sm:text-base"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Compliance badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-navy-100/40 pt-6">
          <div className="flex items-center gap-2 text-xs text-graphite-400">
            <Shield className="h-4 w-4 text-teal" />
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-400">
            <Building2 className="h-4 w-4 text-teal" />
            <span>Licensed US Pharmacies</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-400">
            <Award className="h-4 w-4 text-teal" />
            <span>Board-Certified Providers</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-400">
            <FileCheck className="h-4 w-4 text-teal" />
            <span>State-Licensed Providers</span>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
