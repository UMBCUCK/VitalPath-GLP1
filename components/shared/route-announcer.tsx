"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * RouteAnnouncer
 * ─────────────────────────────────────────────────────────────
 * Next.js App Router does not announce client-side route changes to screen
 * readers by default. This mounts a single visually-hidden polite live region
 * that broadcasts the new document title shortly after each navigation, so
 * AT users get the same orientation a full page load would give them.
 *
 * Mount once at the app root.
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof document === "undefined") return;
    // Defer one frame so the new page's <title> has been set by metadata or
    // the rendered <h1>. Two RAFs is empirically reliable in Next 15.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const title = document.title || "Page navigated";
        setMessage(`${title} loaded`);
        // Clear after 3s so the same title can be re-announced on revisit.
        const t = setTimeout(() => setMessage(""), 3000);
        return () => clearTimeout(t);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}
