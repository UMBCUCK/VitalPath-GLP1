import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  return [{ id: "og", alt: `Nature's Journey Blog`, contentType: "image/png", size }];
}

export default async function OGImage({ params }: { params: { slug: string } }) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
    select: { title: true, category: true, author: true },
  });

  const title = post?.title || "Nature's Journey Blog";
  const category = post?.category || "Health";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0E223D 0%, #163A63 50%, #1F6F78 100%)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Top: Category badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "rgba(31, 111, 120, 0.3)",
              border: "1px solid rgba(31, 111, 120, 0.5)",
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#DDE9E3",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {category}
          </div>
        </div>

        {/* Middle: Title */}
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <h1
            style={{
              fontSize: title.length > 60 ? "36px" : "48px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              letterSpacing: "-1px",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom: Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1F6F78, #DDE9E3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 800,
                color: "white",
              }}
            >
              VP
            </div>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>
              Nature's Journey
            </span>
          </div>
          <span style={{ fontSize: "14px", color: "#677A8A" }}>
            naturesjourneyhealth.com/blog
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
