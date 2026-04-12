import { CreditCard, Calendar, DollarSign, Check } from "lucide-react";

export function FinancingCallout() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
          <CreditCard className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-navy">Flexible Payment Options</h3>
          <p className="mt-1 text-sm text-graphite-500">
            Split your plan into affordable payments. No interest, no hidden fees.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs font-bold text-navy">Pay Monthly</p>
                <p className="text-[10px] text-graphite-400">No commitment</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs font-bold text-navy">Save 20%</p>
                <p className="text-[10px] text-graphite-400">Annual billing</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
              <Check className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-xs font-bold text-navy">HSA/FSA May Apply</p>
                <p className="text-[10px] text-graphite-400">Check your plan</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-graphite-400">
            All major credit cards accepted. HSA/FSA eligibility depends on your specific plan and IRS guidelines — verify with your plan administrator. Insurance reimbursement is not guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}
