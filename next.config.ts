import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
    // Disable image optimization in CI/test environments to avoid issues
    unoptimized: process.env.CI === "true" || process.env.NODE_ENV === "test",
  },
};

export default nextConfig;
