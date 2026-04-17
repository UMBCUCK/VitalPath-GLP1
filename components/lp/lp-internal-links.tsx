import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface InternalLink {
  title: string;
  description: string;
  href: string;
}

interface LpInternalLinksProps {
  heading?: string;
  links: readonly InternalLink[];
}

export function LpInternalLinks({
  heading = "Related Programs",
  links,
}: LpInternalLinksProps) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="mb-8 text-center text-xl font-bold text-lp-heading sm:text-2xl">
          {heading}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="group rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                borderColor: "var(--lp-card-border)",
                backgroundColor: "var(--lp-card-bg, #fff)",
              }}
            >
              <h3 className="flex items-center gap-2 text-sm font-bold text-lp-heading">
                {link.title}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" style={{ color: "var(--lp-icon)" }} />
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-lp-body-muted">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
