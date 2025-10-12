/** @type {import('next').NextConfig} */
const nextConfig = {
  // Headers removed for Farcaster compatibility
  
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