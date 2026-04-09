import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const alt = "VitalPath — Clinically Informed Weight Management";
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0E223D 0%, #163A63 50%, #1F6F78 100%)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1F6F78, #DDE9E3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
              color: "white",
            }}
          >
            VP
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            VitalPath
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "28px",
            color: "#DDE9E3",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Clinically informed weight management, delivered to your door.
        </p>

        {/* Price highlight */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "24px",
            background: "rgba(31, 111, 120, 0.15)",
            border: "1px solid rgba(31, 111, 120, 0.3)",
            borderRadius: "12px",
            padding: "12px 24px",
          }}
        >
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#DDE9E3" }}>
            From $279/mo
          </span>
          <span style={{ fontSize: "14px", color: "#97A5B0" }}>
            79% less than brand-name retail
          </span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "32px",
            fontSize: "14px",
            color: "#677A8A",
          }}
        >
          <span>Licensed Providers</span>
          <span>HIPAA Compliant</span>
          <span>Free 2-Day Shipping</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
