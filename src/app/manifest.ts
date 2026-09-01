import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FU-DEVER",
    short_name: "FU-DEVER",
    description:
      "Welcome to FU-DEVER, the programming club of FPT University! At FU-DEVER, we strive to foster a vibrant community of aspiring programmers and provide a platform for skill development and collaboration.",
    icons: [
      {
        src: "/icons/layout/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/layout/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#0066CC",
    background_color: "#0066CC",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
  };
}
