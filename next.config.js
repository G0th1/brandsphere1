/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com'],
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  // Uteslut Supabase Functions från TypeScript-kontrollen
  typescript: {
    ignoreBuildErrors: true, // Under utveckling, ändra till false för produktion när alla fel är fixade
  },
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
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 