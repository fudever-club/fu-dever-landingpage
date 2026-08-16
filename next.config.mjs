/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    domains: [
      "res.cloudinary.com",
      "aiartshop.com",
      "th.bing.com",
      "i.ibb.co",
      "img-cdn.pixlr.com",
      "drive.google.com",
      "lh3.googleusercontent.com",
      "docs.google.com",
      "api.qrserver.com",
    ],
  },
};

export default nextConfig;
