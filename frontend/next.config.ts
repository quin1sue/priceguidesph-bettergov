import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  // reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/indicator",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
