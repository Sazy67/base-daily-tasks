/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: wss: ws:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https: wss: ws: data:; frame-ancestors *; frame-src *; object-src 'none';"
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