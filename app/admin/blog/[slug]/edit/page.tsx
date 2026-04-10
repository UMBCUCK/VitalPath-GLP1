import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BlogEditClient } from "./blog-edit-client";

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const { slug } = await params;

  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  return <BlogEditClient post={JSON.parse(JSON.stringify(post))} />;
}
