/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for Farcaster compatibility
  experimental: {
    optimizePackageImports: []
  },
  
  async rewrites() {
    return [
      {
        source: '/ultimate',
        destination: '/ultimate.html'
      },
      {
        source: '/final',
        destination: '/final.html'
      },
      {
        source: '/farcaster',
        destination: '/farcaster.html'
      }
    ]
  }
};

export default nextConfig;