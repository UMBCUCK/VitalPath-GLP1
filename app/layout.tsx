import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Clinically Informed Weight Management`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="dns-prefetch" href="https://us.i.posthog.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>

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
