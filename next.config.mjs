/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for Farcaster compatibility
  experimental: {
    optimizePackageImports: []
  },
  
  async rewrites() {
    return [
      {
        source: '/farcaster',
        destination: '/farcaster.html'
      }
    ]
  }
};

export default nextConfig;