import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Calculator Widget | VitalPath",
  description: "Embeddable health calculator — BMI, calories, protein, hydration, and weight loss timeline.",
  robots: { index: false, follow: false },
};

// Standalone layout — no MarketingShell, no header/footer
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
