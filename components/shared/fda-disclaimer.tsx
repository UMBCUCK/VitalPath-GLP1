export function FdaDisclaimer({ className }: { className?: string }) {
  return (
    <p className={className ?? "text-xs text-graphite-300 text-center"}>
      Compounded medications are not FDA-approved. They are prepared by state-licensed
      compounding pharmacies based on individual prescriptions from licensed providers.
      Individual results may vary. VitalPath does not guarantee any specific treatment outcomes.
    </p>
  );
}
