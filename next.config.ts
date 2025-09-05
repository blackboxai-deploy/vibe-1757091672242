import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'replicate.delivery',
      'storage.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: '**.replicate.delivery',
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

export default nextConfig