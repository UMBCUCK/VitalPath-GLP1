import { Shield, Building2, Truck, CreditCard, Award, Lock } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";

const partners = [
  { icon: Building2, label: "Licensed US Pharmacies", sublabel: "503A/503B Certified" },
  { icon: Shield, label: "HIPAA Compliant", sublabel: "Enterprise Security" },
  { icon: Award, label: "State-Licensed Providers", sublabel: "All 50 States" },
  { icon: Lock, label: "256-Bit Encryption", sublabel: "Bank-Level Security" },
  { icon: Truck, label: "Free 2-Day Shipping", sublabel: "Temperature Controlled" },
  { icon: CreditCard, label: "Secure Payments", sublabel: "Powered by Stripe" },
];

export function PartnerLogos() {
  return (
    <section className="border-y border-navy-100/40 bg-gradient-to-r from-navy-50/30 via-white to-navy-50/30 py-8">
      <SectionShell>
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-graphite-300">
          Trusted Infrastructure
        </p>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {partners.map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-1.5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm border border-navy-100/40">
                <p.icon className="h-5 w-5 text-navy" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-navy leading-tight">{p.label}</p>
                <p className="text-[9px] text-graphite-400">{p.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
