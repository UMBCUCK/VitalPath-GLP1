export default function ResellerAgreementPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="rounded-2xl border border-navy-100/40 bg-white p-8 shadow-sm">
        {/* Title */}
        <h1 className="text-2xl font-bold text-navy mb-1">
          Referral Bonus Program Agreement
        </h1>
        <p className="text-sm text-graphite-400 mb-8">
          VitalPath Referral Partner Program &mdash; Last updated April 2026
        </p>

        {/* 1. Program Overview */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">1. Program Overview</h2>
          <p className="text-sm text-graphite-600 leading-relaxed mb-3">
            The VitalPath Referral Bonus Program (&ldquo;Program&rdquo;) allows approved referral
            partners (&ldquo;Resellers&rdquo;) to earn commissions by referring new customers to
            VitalPath telehealth weight management services. This Program is structured as a
            referral bonus arrangement and is <strong>not</strong> a multi-level marketing (MLM),
            network marketing, or pyramid program.
          </p>
          <p className="text-sm text-graphite-600 leading-relaxed">
            All compensation under this Program is derived exclusively from actual product and
            service sales to end consumers. No compensation is paid for the act of recruiting
            other resellers.
          </p>
        </section>

        {/* 2. Compensation Structure */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">2. Compensation Structure</h2>

          <h3 className="text-sm font-semibold text-navy mt-4 mb-2">2.1 Direct Sales Commission</h3>
          <p className="text-sm text-graphite-600 leading-relaxed mb-3">
            Resellers earn a commission on each qualifying sale made through their unique referral
            link or code. Commission rates are determined by the Reseller&apos;s tier level and
            individual agreement, typically ranging from 10% to 20% of the sale amount.
          </p>

          <h3 className="text-sm font-semibold text-navy mt-4 mb-2">2.2 Override Bonus Structure</h3>
          <p className="text-sm text-graphite-600 leading-relaxed mb-3">
            Resellers who have referred other resellers into the Program may earn override bonuses
            when those referred resellers generate qualifying sales. Override bonuses are structured
            as follows:
          </p>
          <div className="rounded-xl bg-navy-50/40 border border-navy-100/30 p-4 mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40">
                  <th className="text-left py-2 font-semibold text-navy">Tier</th>
                  <th className="text-left py-2 font-semibold text-navy">Description</th>
                  <th className="text-right py-2 font-semibold text-navy">Default Rate</th>
                </tr>
              </thead>
              <tbody className="text-graphite-600">
                <tr className="border-b border-navy-100/20">
                  <td className="py-2">Tier 1</td>
                  <td className="py-2">Direct referral&apos;s sales</td>
                  <td className="py-2 text-right">5.0%</td>
                </tr>
                <tr className="border-b border-navy-100/20">
                  <td className="py-2">Tier 2</td>
                  <td className="py-2">Second-level referral&apos;s sales</td>
                  <td className="py-2 text-right">3.0%</td>
                </tr>
                <tr>
                  <td className="py-2">Tier 3</td>
                  <td className="py-2">Third-level referral&apos;s sales</td>
                  <td className="py-2 text-right">1.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-graphite-600 leading-relaxed">
            Override bonuses are calculated as a percentage of the sale amount and are paid from
            VitalPath&apos;s company margin. Override bonuses are <strong>never deducted</strong> from
            the selling reseller&apos;s commission. The selling reseller always receives their full
            earned commission regardless of any override bonuses paid to their upline.
          </p>
        </section>

        {/* 3. Maximum Network Depth */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">3. Maximum Network Depth</h2>
          <p className="text-sm text-graphite-600 leading-relaxed">
            The Program is limited to a maximum of <strong>three (3) override tiers</strong>. This
            means a Reseller can earn override bonuses from up to three levels of referred
            resellers below them. No compensation of any kind is paid beyond the third tier. This
            limitation is designed to comply with FTC guidelines and ensure the Program remains a
            legitimate referral bonus arrangement.
          </p>
        </section>

        {/* 4. No Recruitment Compensation */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">4. No Recruitment Compensation</h2>
          <p className="text-sm text-graphite-600 leading-relaxed mb-3">
            <strong>No compensation is paid for the act of recruiting other resellers.</strong> Override
            bonuses are earned solely when a referred reseller generates a qualifying product or
            service sale to an end consumer. Specifically:
          </p>
          <ul className="list-disc pl-5 text-sm text-graphite-600 space-y-1.5">
            <li>No sign-up bonuses are paid for recruiting new resellers.</li>
            <li>No bonuses are paid for achieving recruitment quotas or targets.</li>
            <li>Override bonuses are triggered exclusively by verified end-consumer sales.</li>
            <li>The Program does not require, incentivize, or reward inventory loading or product stocking.</li>
          </ul>
        </section>

        {/* 5. No Inventory or Quota Requirements */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">5. No Inventory or Quota Requirements</h2>
          <p className="text-sm text-graphite-600 leading-relaxed">
            Resellers are not required to purchase, stock, or maintain any inventory.
            There are no minimum sales quotas to maintain active status or earn commissions.
            Resellers are not required to make any upfront financial investment to participate
            in the Program.
          </p>
        </section>

        {/* 6. Tier Advancement */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">6. Tier Advancement</h2>
          <p className="text-sm text-graphite-600 leading-relaxed mb-3">
            Resellers may advance through tier levels based on their performance. Tier
            advancement is based on cumulative sales volume and/or network development and may
            result in improved direct commission rates. Tier levels include:
          </p>
          <ul className="list-disc pl-5 text-sm text-graphite-600 space-y-1.5">
            <li><strong>Standard:</strong> Entry-level tier for all new resellers.</li>
            <li><strong>Silver:</strong> 10+ sales or 5+ referred resellers who have generated sales.</li>
            <li><strong>Gold:</strong> 25+ sales or 10+ referred resellers with $10,000+ network revenue.</li>
            <li><strong>Ambassador:</strong> 50+ sales or 20+ referred resellers with $50,000+ network revenue.</li>
          </ul>
        </section>

        {/* 7. Payout Terms */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">7. Payout Terms</h2>
          <p className="text-sm text-graphite-600 leading-relaxed">
            Commissions and override bonuses are subject to a verification period before
            becoming eligible for payout. VitalPath reserves the right to hold, adjust, or
            clawback commissions in cases of refunds, chargebacks, fraud, or violations of
            Program terms. Payouts are processed on a monthly basis via the Reseller&apos;s
            selected payout method (account credit, ACH bank transfer, or check).
          </p>
        </section>

        {/* 8. Cancellation and Clawback */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">8. Cancellation and Clawback Policies</h2>
          <p className="text-sm text-graphite-600 leading-relaxed mb-3">
            VitalPath reserves the right to:
          </p>
          <ul className="list-disc pl-5 text-sm text-graphite-600 space-y-1.5">
            <li>Suspend or terminate a Reseller account for Program violations, fraudulent activity, or misrepresentation.</li>
            <li>Clawback commissions associated with refunded or disputed transactions.</li>
            <li>Adjust override bonus rates with 30 days advance notice.</li>
            <li>Modify or discontinue the Program with 60 days advance notice.</li>
          </ul>
          <p className="text-sm text-graphite-600 leading-relaxed mt-3">
            If a referred reseller is deactivated or terminated, the referring reseller&apos;s
            override bonus eligibility for that branch of the network ceases. Earned and paid
            commissions are not affected retroactively except in cases of fraud.
          </p>
        </section>

        {/* 9. FTC Compliance */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">9. FTC Compliance Statement</h2>
          <p className="text-sm text-graphite-600 leading-relaxed mb-3">
            The VitalPath Referral Bonus Program is designed and operated in compliance with
            Federal Trade Commission (FTC) guidelines regarding referral and affiliate programs.
            Key compliance measures include:
          </p>
          <ul className="list-disc pl-5 text-sm text-graphite-600 space-y-1.5">
            <li>All compensation is derived from actual sales of products and services to end consumers.</li>
            <li>No compensation is provided for recruitment activities alone.</li>
            <li>The network is limited to three (3) tiers to prevent excessive layering.</li>
            <li>No inventory requirements, front-loading, or pay-to-play structures exist.</li>
            <li>Full disclosure of compensation structure is provided to all participants.</li>
            <li>Resellers are required to make truthful claims about products, services, and income potential.</li>
            <li>VitalPath monitors the ratio of retail sales to recruitment activity to ensure program legitimacy.</li>
          </ul>
        </section>

        {/* 10. Tax Obligations */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-3">10. Tax Obligations</h2>
          <p className="text-sm text-graphite-600 leading-relaxed">
            Resellers are independent contractors and are responsible for reporting all
            Program earnings as income on their tax returns. VitalPath will issue a Form 1099-NEC
            to any Reseller earning $600 or more in a calendar year. Resellers may be required to
            provide a completed W-9 form prior to receiving payouts.
          </p>
        </section>

        {/* 11. Governing Terms */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-navy mb-3">11. Governing Terms</h2>
          <p className="text-sm text-graphite-600 leading-relaxed">
            Participation in the Program constitutes acceptance of these terms and conditions.
            VitalPath reserves the right to modify these terms at any time with appropriate notice
            to active Resellers. This agreement is governed by the laws of the State of Delaware.
            Any disputes arising from this agreement shall be resolved through binding arbitration.
          </p>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-navy-100/40">
          <p className="text-xs text-graphite-400 text-center">
            VitalPath, Inc. &mdash; Referral Bonus Program Agreement v2.0 &mdash; Effective April 2026
          </p>
        </div>
      </div>
    </div>
  );
}
