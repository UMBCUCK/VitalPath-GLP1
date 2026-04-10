import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const searchTerm = `%${q}%`;

  const [customers, products, blogPosts, recipes, claims] = await Promise.all([
    db.user.findMany({
      where: {
        role: "PATIENT",
        OR: [
          { email: { contains: q } },
          { firstName: { contains: q } },
          { lastName: { contains: q } },
        ],
      },
      take: 5,
      select: { id: true, email: true, firstName: true, lastName: true },
    }),
    db.product.findMany({
      where: { name: { contains: q } },
      take: 5,
      select: { id: true, name: true, slug: true, type: true },
    }),
    db.blogPost.findMany({
      where: { title: { contains: q } },
      take: 5,
      select: { id: true, title: true, slug: true, isPublished: true },
    }),
    db.recipe.findMany({
      where: { title: { contains: q } },
      take: 5,
      select: { id: true, title: true, slug: true, category: true },
    }),
    db.claim.findMany({
      where: { text: { contains: q } },
      take: 5,
      select: { id: true, text: true, category: true, status: true },
    }),
  ]);

  const results = [
    ...customers.map((c) => ({
      type: "customer",
      id: c.id,
      label: [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email,
      sublabel: c.email,
      href: `/admin/customers/${c.id}`,
    })),
    ...products.map((p) => ({
      type: "product",
      id: p.id,
      label: p.name,
      sublabel: p.type,
      href: "/admin/products",
    })),
    ...blogPosts.map((b) => ({
      type: "blog",
      id: b.id,
      label: b.title,
      sublabel: b.isPublished ? "Published" : "Draft",
      href: `/admin/blog/${b.slug}/edit`,
    })),
    ...recipes.map((r) => ({
      type: "recipe",
      id: r.id,
      label: r.title,
      sublabel: r.category,
      href: "/admin/recipes",
    })),
    ...claims.map((c) => ({
      type: "claim",
      id: c.id,
      label: c.text.slice(0, 60) + (c.text.length > 60 ? "..." : ""),
      sublabel: `${c.category} - ${c.status}`,
      href: "/admin/claims",
    })),
  ];

  return NextResponse.json({ results });
}
