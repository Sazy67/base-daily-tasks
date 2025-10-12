/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss: ws:; frame-ancestors *; frame-src *;"
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ]
  },
  
  // Farcaster Mini App optimizations
  experimental: {
    optimizePackageImports: ['@farcaster/core']
  },
  
  // Allow iframe embedding
  async rewrites() {
    return [
      {
        source: '/.well-known/:path*',
        destination: '/api/:path*'
      }
    ]
  }
};

export default nextConfig;