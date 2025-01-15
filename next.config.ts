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
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://www.browserbase.com'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://www.browserbase.com"
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            value: 'https://www.browserbase.com'
          },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET,POST,OPTIONS'
          },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'Content-Type, Authorization'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
