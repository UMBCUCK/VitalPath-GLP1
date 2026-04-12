import type { NextPageContext } from "next";
import Link from "next/link";

function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#1e3a5f" }}>
        {statusCode ? `${statusCode} Error` : "An error occurred"}
      </h1>
      <p style={{ color: "#677A8A", marginTop: "8px" }}>
        {statusCode === 404
          ? "This page could not be found."
          : "An unexpected error has occurred."}
      </p>
      <Link href="/" style={{ color: "#1F6F78", textDecoration: "underline", marginTop: "16px", display: "inline-block" }}>
        Go home
      </Link>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
