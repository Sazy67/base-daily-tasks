/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for Farcaster compatibility
  experimental: {
    optimizePackageImports: []
  },
  
  async rewrites() {
    return [
      {
        source: '/fc',
        destination: '/farcaster-wallet.html'
      },
      {
        source: '/working',
        destination: '/working.html'
      },
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