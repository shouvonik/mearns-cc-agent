import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Photos
      },
      {
        protocol: "https",
        hostname: "*.playhq.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // mock photo placeholders
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
