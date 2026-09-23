/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Closed allowlist (audited 2026-09-23): only hosts that actually serve
    // <Image> content — Unsplash covers, legacy i.ibb.co fallbacks, Google
    // avatars, the R2 proxy backend, and CartoDB map tiles, plus localhost
    // for dev. Adding a new image host requires extending this list,
    // otherwise next/image returns 400 for it.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'dever-backend-production.up.railway.app' },
      { protocol: 'https', hostname: 'cartodb-basemaps-a.global.ssl.fastly.net' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
};

export default nextConfig;
