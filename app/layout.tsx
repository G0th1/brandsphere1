import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Analytics } from '@/components/analytics';
import Script from 'next/script';
import { Providers } from './providers';

// Load Inter font with optimal subset for better performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | BrandSphereAI',
    default: 'BrandSphereAI - AI-Powered Social Media Management',
  },
  description: 'Revolutionize your social media strategy with AI-powered content generation, scheduling, and analytics.',
  keywords: [
    'social media management',
    'ai content generator',
    'content planning',
    'social analytics',
    'engagement tools',
  ],
  authors: [{ name: 'BrandSphereAI Team' }],
  creator: 'BrandSphereAI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://brandsphere.ai'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </Providers>

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/logo.svg"
          as="image"
          type="image/svg+xml"
        />

        {/* Add cache directive in script */}
        <Script id="performance-config" strategy="afterInteractive">
          {`
            // Performance optimization
            document.addEventListener('DOMContentLoaded', () => {
              // Set default fetch cache policy
              const originalFetch = window.fetch;
              window.fetch = function(input, init) {
                // Add cache control for API requests that aren't mutations
                if (typeof input === 'string' && 
                    input.includes('/api/') && 
                    (!init || init.method === 'GET')) {
                  init = init || {};
                  init.headers = init.headers || {};
                  // Add cache header for GET requests
                  init.headers = {
                    ...init.headers,
                    'Cache-Control': 'max-age=60'
                  };
                }
                return originalFetch.call(this, input, init);
              };
            });
          `}
        </Script>
      </body>
    </html>
  );
} 