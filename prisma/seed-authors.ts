import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  // Add author to medication/education posts
  await db.blogPost.updateMany({
    where: { category: { in: ["medication", "education"] }, author: null },
    data: { author: "Dr. Sarah Chen, MD — VitalPath Medical Director" },
  });

  // Add author to nutrition posts
  await db.blogPost.updateMany({
    where: { category: "nutrition", author: null },
    data: { author: "VitalPath Nutrition Team" },
  });

  // Add author to lifestyle posts
  await db.blogPost.updateMany({
    where: { category: "lifestyle", author: null },
    data: { author: "VitalPath Clinical Team" },
  });

  // Catch any remaining
  await db.blogPost.updateMany({
    where: { author: null },
    data: { author: "VitalPath Clinical Team" },
  });

  const total = await db.blogPost.count();
  const withAuthor = await db.blogPost.count({ where: { author: { not: null } } });
  console.log(`${withAuthor}/${total} blog posts now have author attribution`);
}

main().finally(() => db.$disconnect());
