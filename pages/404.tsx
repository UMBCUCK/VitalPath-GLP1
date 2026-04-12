import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1e3a5f" }}>404</h1>
      <p style={{ color: "#677A8A", marginTop: "8px", fontSize: "1.1rem" }}>
        This page could not be found.
      </p>
      <Link href="/" style={{ color: "#1F6F78", textDecoration: "underline", marginTop: "16px", display: "inline-block" }}>
        Go home
      </Link>
    </div>
  );
}
