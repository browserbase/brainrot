import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['imgflip.com', 'i.imgflip.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgflip.com',
      },
      {
        protocol: 'https',
        hostname: 'imgflip.com',
      }
    ],
    unoptimized: true
  }
};

export default nextConfig;
