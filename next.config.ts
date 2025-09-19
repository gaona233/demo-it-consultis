import type { NextConfig } from "next";

// next.config.js
const isProd = process.env.NODE_ENV === 'production'
const repoName = 'demo-it-consultis' 
const nextConfig: NextConfig = {
  /* config options here */
output: "export",
  assetPrefix: isProd ? `/${repoName}` : '', 
  basePath: isProd ? `/${repoName}` : '', // 确保路径正确
  images: {
    remotePatterns: [
      {
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
