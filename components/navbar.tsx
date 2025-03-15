"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

// UI Components
import { Button } from '@/components/ui/button'
import { MobileMenu } from '@/components/mobile-menu'
import { LanguageSwitcher } from '@/components/language-switcher'

// Translation
import { useTranslation } from '@/contexts/language-context'
import { commonTranslations } from '@/lib/translations'

// Navigation links configuration
const navLinks = [
  { href: '/features', labelKey: 'features' },
  { href: '/pricing', labelKey: 'pricing' },
  { href: '/blog', labelKey: 'blog' },
  { href: '/app-promote', labelKey: 'appPromote' },
  { href: '/contact', labelKey: 'contact' },
];

export function Navbar() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const pathname = usePathname()
  const t = useTranslation(commonTranslations);

  const handleLogout = () => signOut({ redirect: true, callbackUrl: '/' });

  return (
    <header className="border-b bg-background fixed top-0 left-0 right-0 z-20">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and navigation links */}
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/image_2025-03-02_212020748 (1).png"
              alt="BrandSphereAI Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold">BrandSphereAI</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                  } transition-colors hover:text-foreground`}
              >
                {t.navigation[link.labelKey as keyof typeof t.navigation]}
              </Link>
            ))}
          </nav>
        </div>

        {/* Language switcher and auth buttons */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {isAuthenticated ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  {t.navigation.dashboard}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t.navigation.logout}
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">
                  {t.navigation.login}
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">
                  {t.navigation.signup}
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <MobileMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  )
} 