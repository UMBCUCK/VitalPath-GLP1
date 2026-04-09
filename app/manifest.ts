import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VitalPath Health",
    short_name: "VitalPath",
    description: "Clinically informed weight management, delivered to your door.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFCFD",
    theme_color: "#0E223D",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["health", "medical", "lifestyle"],
  };
}
