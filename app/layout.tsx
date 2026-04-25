// PERF: removed root-level `force-dynamic` so LPs (and any static pages) can
// be statically optimized / cached at the edge. Pages that genuinely need
// per-request rendering (auth, admin, dashboard) opt-in individually with
// their own `export const dynamic = "force-dynamic"`. Marketing/LP pages are
// the LCP-sensitive surface and benefit massively from CDN caching.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { RouteAnnouncer } from "@/components/shared/route-announcer";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // Only load the weights actually used — reduces font download by ~60%
  weight: ["400", "500", "600", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Clinically Informed Weight Management`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url || "http://localhost:3000"),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#005066",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  verification: {
    // Add when available:
    // google: "your-google-verification-code",
  },
  category: "health",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply saved admin theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('vp-admin-theme')||'';if(t==='cerulean'){document.documentElement.classList.add('theme-cerulean')}else if(t==='dark'||localStorage.getItem('vp-admin-dark')==='true'){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
        {/* PWA manifest + meta */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VitalPath" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        {/* Preconnect = full handshake for domains we fetch from immediately */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://js.stripe.com" />
        {/* DNS-prefetch = lightweight hint for deferred third-parties */}
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
      </head>
      <body className="min-h-[100dvh] font-sans antialiased">
        <ThemeProvider />
        <RouteAnnouncer />
        <ToastProvider>
          {children}
        </ToastProvider>

        {/* Service Worker registration for PWA */}
        <Script id="sw-register" strategy="lazyOnload">
          {`if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(function(e){console.log('SW registration failed:',e)})}`}
        </Script>

        {/* Analytics — loaded after page is interactive */}
        {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <Script
            src={`${process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"}/static/array.js`}
            strategy="lazyOnload"
            data-api-key={process.env.NEXT_PUBLIC_POSTHOG_KEY}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga4-init" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
