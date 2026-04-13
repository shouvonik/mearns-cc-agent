import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "mearnscc.loca.lt",
    "*.loca.lt",
    "*.ngrok-free.app",
    "*.ngrok.io",
  ],
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
