import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BlogClient } from "./blog-client";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = Math.min(100, Math.max(10, parseInt(params.limit || "25", 10)));
  const search = params.search || "";
  const category = params.category || "";
  const published = params.published || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }
  if (category) {
    where.category = category;
  }
  if (published === "true") {
    where.isPublished = true;
  } else if (published === "false") {
    where.isPublished = false;
  }

  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.blogPost.count({ where }),
  ]);

  return (
    <BlogClient
      initialPosts={JSON.parse(JSON.stringify(posts))}
      total={total}
      page={page}
      limit={limit}
      search={search}
      category={category}
      published={published}
    />
  );
}
