/**
 * Web Vitals performance monitoring.
 * Sends Core Web Vitals (LCP, FID, CLS, FCP, TTFB) to PostHog and console.
 */

type WebVitalMetric = {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType: string;
};

export function reportWebVitals(metric: WebVitalMetric): void {
  const { name, value, rating, id } = metric;

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    const color = rating === "good" ? "green" : rating === "needs-improvement" ? "orange" : "red";
    console.log(`[Web Vitals] %c${name}: ${Math.round(value)}ms (${rating})`, `color: ${color}`);
  }

  // Send to PostHog
  if (typeof window !== "undefined" && "posthog" in window) {
    const ph = (window as Record<string, unknown>).posthog as {
      capture?: (event: string, props?: Record<string, unknown>) => void;
    };
    ph?.capture?.("web_vital", {
      metric_name: name,
      metric_value: value,
      metric_rating: rating,
      metric_id: id,
      page_url: window.location.pathname,
    });
  }

  // Send to Google Analytics
  if (typeof window !== "undefined" && "gtag" in window) {
    const gtag = (window as unknown as {
      gtag: (command: string, event: string, params: Record<string, unknown>) => void;
    }).gtag;
    gtag("event", name, {
      value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }
}

// Performance budgets for CI/build checks
export const PERFORMANCE_BUDGETS = {
  LCP: 2500,   // Largest Contentful Paint: < 2.5s
  FID: 100,    // First Input Delay: < 100ms
  CLS: 0.1,    // Cumulative Layout Shift: < 0.1
  FCP: 1800,   // First Contentful Paint: < 1.8s
  TTFB: 800,   // Time to First Byte: < 800ms
} as const;
