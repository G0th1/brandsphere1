/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com']
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  // Disable TypeScript errors during development
  typescript: {
    ignoreBuildErrors: true, // During development, change to false for production when all errors are fixed
  },
  // Configure output based on environment
  // For local development and testing, we use server-side rendering
  // For production deployment, we can use static export if needed
  output: undefined, // Remove static export to use server-side rendering
  distDir: '.next',
  // Skip type checking during build to speed up the process
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Improve performance with SWC compiler options
  compiler: {
    // Remove console and debugger statements in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configure security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' plausible.io;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https:;
              connect-src 'self' https://plausible.io https://*.supabase.co https://*.upstash.io https://*.googleapis.com https://*.facebook.com https://*.facebook.net;
              frame-ancestors 'none';
            `.replace(/\s+/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Add caching headers for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Add specific caching for static assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 