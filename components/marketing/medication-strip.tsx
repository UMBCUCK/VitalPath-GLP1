import { Pill } from "lucide-react";

const medications = [
  "Semaglutide",
  "Tirzepatide",
  "Ozempic®",
  "Wegovy®",
  "Mounjaro®",
  "Zepbound®",
];

export function MedicationStrip() {
  return (
    <div className="border-b border-navy-100/40 bg-white py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 sm:px-6">
        <Pill className="h-4 w-4 shrink-0 text-teal" />
        <p className="text-xs text-graphite-400 sm:text-sm">
          <span className="font-semibold text-navy">Medications available:</span>
          {" "}
          {medications.map((med, i) => (
            <span key={med}>
              <span className={med.includes("®") ? "text-graphite-300" : "text-graphite-500 font-medium"}>
                {med}
              </span>
              {i < medications.length - 1 && <span className="text-graphite-200 mx-1.5">·</span>}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
