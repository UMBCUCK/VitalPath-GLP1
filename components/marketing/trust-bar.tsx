import { Shield, Award, Building2, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { mediaLogos } from "@/lib/content";

export function TrustBar() {
  return (
    <section className="border-y border-navy-100/40 bg-white py-5">
      <SectionShell>
        {/* Media logos - "As Seen In" */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-graphite-300">
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

        {/* Compliance + trust badges — 2 rows */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-navy-100/40 pt-5">
          <div className="flex items-center gap-2 text-xs text-graphite-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
              <Shield className="h-3.5 w-3.5 text-teal" />
            </div>
            <span className="font-medium">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
              <Building2 className="h-3.5 w-3.5 text-teal" />
            </div>
            <span className="font-medium">Licensed US Pharmacies</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
              <Award className="h-3.5 w-3.5 text-teal" />
            </div>
            <span className="font-medium">Board-Certified Providers</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
              <Truck className="h-3.5 w-3.5 text-teal" />
            </div>
            <span className="font-medium">Free 2-Day Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
              <CreditCard className="h-3.5 w-3.5 text-emerald" />
            </div>
            <span className="font-medium">FSA/HSA Accepted</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <span className="font-medium">30-Day Money-Back</span>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
