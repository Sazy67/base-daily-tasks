/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for Farcaster compatibility
  experimental: {
    optimizePackageImports: []
  },
  
  // IFRAME-FRIENDLY headers for Farcaster
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:",
              "style-src 'self' 'unsafe-inline' https: data:",
              "img-src 'self' data: https: blob: *",
              "font-src 'self' data: https: *",
              "connect-src 'self' https: wss: ws: *",
              "frame-src 'self' https: *",
              "frame-ancestors *",
              "worker-src 'self' blob:",
              "child-src 'self' blob: https:",
              "object-src 'none'",
              "base-uri 'self'"
            ].join('; ')
          },

          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade'
          }
        ]
      }
    ]
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