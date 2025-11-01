import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/dashboard"
      }
    ]
  }
};

export default nextConfig;
