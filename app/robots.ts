import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

  const disallowPaths = ["/admin/", "/dashboard/", "/provider/", "/reseller/", "/api/", "/checkout/", "/intake/", "/login", "/register", "/success"];

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowPaths,
        crawlDelay: 2,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: disallowPaths,
        crawlDelay: 2,
      },
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: disallowPaths,
        crawlDelay: 2,
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: disallowPaths,
        crawlDelay: 2,
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: disallowPaths,
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: disallowPaths,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowPaths,
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
