import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Select Your Plan",
  description: "Choose your VitalPath weight management plan. Provider evaluation, GLP-1 medication, and ongoing support included. Plans from $279/month.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
