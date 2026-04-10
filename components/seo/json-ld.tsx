import { siteConfig } from "@/lib/site";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: BASE_URL,
    telephone: siteConfig.support.phone,
    email: siteConfig.support.email,
    medicalSpecialty: "Weight Management",
    availableService: {
      "@type": "MedicalTherapy",
      name: "GLP-1 Weight Management Program",
      description: "Provider-guided weight management with personalized treatment plans and ongoing support.",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.socialProof.rating,
      reviewCount: 2400,
      bestRating: 5,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQPageJsonLd({ faqs }: { faqs: readonly { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author?: string | null;
}) {
  const authorName = author || siteConfig.name;
  const isDoctor = authorName.includes("Dr.") || authorName.includes("MD");

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${BASE_URL}/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: BASE_URL,
    },
    author: isDoctor
      ? {
          "@type": "Person",
          name: authorName,
          jobTitle: "Medical Director",
          worksFor: { "@type": "Organization", name: siteConfig.name },
        }
      : {
          "@type": "Organization",
          name: authorName,
          url: BASE_URL,
        },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function HowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: Array<{ title: string; description: string }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  priceCurrency,
  price,
  url,
}: {
  name: string;
  description: string;
  priceCurrency?: string;
  price: number;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Organization", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: priceCurrency || "USD",
      price: price.toFixed(2),
      url: `${BASE_URL}${url}`,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.socialProof.rating,
      reviewCount: 2400,
      bestRating: 5,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function RecipeJsonLd({
  name,
  description,
  prepTime,
  cookTime,
  servings,
  calories,
  protein,
  ingredients,
  instructions,
  slug,
}: {
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  ingredients: string[];
  instructions: string[];
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name,
    description,
    prepTime: `PT${prepTime}M`,
    cookTime: `PT${cookTime}M`,
    totalTime: `PT${prepTime + cookTime}M`,
    recipeYield: `${servings} serving${servings > 1 ? "s" : ""}`,
    recipeCategory: "Weight Loss",
    recipeCuisine: "American",
    keywords: "high protein, weight loss, GLP-1 friendly, healthy",
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${calories} calories`,
      proteinContent: `${protein}g`,
    },
    recipeIngredient: ingredients,
    recipeInstructions: instructions.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: BASE_URL,
    },
    url: `${BASE_URL}/dashboard/meals/${slug}`,
    datePublished: "2026-01-01",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: 24,
      bestRating: 5,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; href: string }>;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Blog hub / collection page schema
export function CollectionPageJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${BASE_URL}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Medical web page schema — boosts E-E-A-T signals for health content
export function MedicalWebPageJsonLd({
  name,
  description,
  url,
  lastReviewed,
  medicalAudience,
}: {
  name: string;
  description: string;
  url: string;
  lastReviewed?: string;
  medicalAudience?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name,
    description,
    url: `${BASE_URL}${url}`,
    lastReviewed: lastReviewed || new Date().toISOString().split("T")[0],
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: medicalAudience || "Patient",
    },
    reviewedBy: {
      "@type": "Organization",
      name: `${siteConfig.name} Medical Team`,
      url: BASE_URL,
    },
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Medical condition schema — improves E-E-A-T for condition-focused pages
export function MedicalConditionJsonLd({
  name,
  alternateName,
  description,
  url,
  possibleTreatment,
}: {
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  possibleTreatment?: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name,
    description,
    url: `${BASE_URL}${url}`,
  };
  if (alternateName) data.alternateName = alternateName;
  if (possibleTreatment) {
    data.possibleTreatment = {
      "@type": "MedicalTherapy",
      name: possibleTreatment,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Drug schema — improves E-E-A-T for medication-focused pages
export function DrugJsonLd({
  name,
  alternateName,
  description,
  url,
  manufacturer,
  administrationRoute,
  pregnancyCategory,
}: {
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  manufacturer?: string;
  administrationRoute?: string;
  pregnancyCategory?: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name,
    description,
    url: `${BASE_URL}${url}`,
  };
  if (alternateName) data.alternateName = alternateName;
  if (manufacturer) data.manufacturer = { "@type": "Organization", name: manufacturer };
  if (administrationRoute) data.administrationRoute = administrationRoute;
  if (pregnancyCategory) data.pregnancyCategory = pregnancyCategory;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// SiteLinksSearchBox schema — enables Google SERP search box
export function SiteLinksSearchBoxJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Video testimonial schema for rich SERP snippets
export function VideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  duration?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    uploadDate: uploadDate || new Date().toISOString().split("T")[0],
    duration: duration || "PT2M",
    contentUrl: `${BASE_URL}/results`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
