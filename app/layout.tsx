import { AnalyticsProvider } from '@/components/providers/analytics-provider'
import { Toaster } from '@/components/providers/toast-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <title>BrandSphereAI</title>
        <meta name="description" content="Din intelligenta plattform för innehållshantering på sociala medier" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 