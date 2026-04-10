import { ImageResponse } from "next/og";
import { allStates } from "@/lib/states";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return allStates.filter((s) => s.available).map((s) => ({ slug: s.slug }));
}

export default function OGImage({ params }: { params: { slug: string } }) {
  const state = allStates.find((s) => s.slug === params.slug);
  const stateName = state?.name || "Your State";

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
            Now Available
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            GLP-1 Weight Loss in {stateName}
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>Nature's Journey</span>
          </div>
          <span style={{ fontSize: "16px", color: "#97A5B0" }}>From $279/mo &middot; Free 2-day shipping</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
