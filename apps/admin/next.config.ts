import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  experimental: {
    turbopack: false,
  },
  /* config options here */
};

export default nextConfig;
