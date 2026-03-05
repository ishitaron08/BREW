import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'ia.media-imdb.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imdb-api.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
