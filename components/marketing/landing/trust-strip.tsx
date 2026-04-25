import { ShieldCheck, Stethoscope, Lock, Clock, Award, Truck } from "lucide-react";

const items = [
  { icon: Stethoscope, label: "Board-certified providers" },
  { icon: ShieldCheck, label: "HIPAA-compliant care" },
  { icon: Lock, label: "Your data stays private" },
  { icon: Clock, label: "Same-day reviews" },
  { icon: Truck, label: "Free 2-day shipping" },
  { icon: Award, label: "Licensed in 50 states" },
];

export function LandingTrustStrip() {
  return (
    <section className="border-y border-navy-100/30 bg-gradient-to-b from-cloud/30 to-white py-6">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10">
          {items.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-graphite-500">
              <Icon className="h-4 w-4 text-teal" />
              <span className="text-xs font-semibold uppercase tracking-wider sm:text-sm sm:normal-case sm:tracking-normal">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
