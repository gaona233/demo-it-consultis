import type { NextConfig } from "next";

// next.config.js
const isProd = process.env.NODE_ENV === 'production'
const nextConfig: NextConfig = {
  /* config options here */
output: "export",
  assetPrefix: isProd ? '/demo-it-consultis/' : '', // 替换为你的仓库名,
  images: {
    remotePatterns: [
      {
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
