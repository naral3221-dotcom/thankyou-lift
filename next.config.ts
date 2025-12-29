import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/thankyou/lift',
  assetPrefix: '/thankyou/lift',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
