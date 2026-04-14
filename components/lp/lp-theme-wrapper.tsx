"use client";

import { usePathname } from "next/navigation";
import { LpThemeProvider } from "./lp-theme-provider";
import { useResolvedTheme } from "@/lib/lp-theme-resolver";
import type { ReactNode } from "react";

export function LpThemeWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const slug = pathname.split("/lp/")[1]?.split("/")[0] ?? "";
  const themeId = useResolvedTheme(slug);

  return <LpThemeProvider themeId={themeId}>{children}</LpThemeProvider>;
}
