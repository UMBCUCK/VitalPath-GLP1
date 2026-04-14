import type { Metadata } from "next";
import { LpThemeWrapper } from "@/components/lp/lp-theme-wrapper";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return <LpThemeWrapper>{children}</LpThemeWrapper>;
}
