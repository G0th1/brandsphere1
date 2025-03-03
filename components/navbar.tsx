"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MobileMenu } from '@/components/mobile-menu'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { useLanguage, useTranslation } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'
import { commonTranslations } from '@/lib/translations'

// Navigeringslänkar
const navLinks = [
  { href: '/features', labelKey: 'features' },
  { href: '/pricing', labelKey: 'pricing' },
  { href: '/blog', labelKey: 'blog' },
  { href: '/app-promote', labelKey: 'appPromote' },
  { href: '/contact', labelKey: 'contact' },
];

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClientComponentClient()
  const pathname = usePathname()
  const t = useTranslation(commonTranslations);

  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (data.session) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking session:', error)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  return (
    <header className="border-b bg-background fixed top-0 left-0 right-0 z-20">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
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

          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                  } transition-colors hover:text-foreground`}
              >
                {t.navigation[link.labelKey as keyof typeof t.navigation]}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {isAuthenticated ? (
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  {t.navigation.dashboard}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t.navigation.logout}
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  {t.navigation.login}
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  {t.navigation.signup}
                </Button>
              </Link>
            </div>
          )}

          <MobileMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  )
} 