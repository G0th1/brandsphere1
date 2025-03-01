"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MobileMenu } from '@/components/mobile-menu'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

// Översättningar
const translations = {
  en: {
    features: "Features",
    pricing: "Pricing",
    blog: "Blog",
    contact: "Contact",
    dashboard: "Dashboard",
    logout: "Log out",
    login: "Log in",
    signup: "Sign up"
  },
  sv: {
    features: "Funktioner",
    pricing: "Priser",
    blog: "Blogg",
    contact: "Kontakt",
    dashboard: "Instrumentpanel",
    logout: "Logga ut",
    login: "Logga in",
    signup: "Registrera dig"
  }
};

// Navigeringslänkar
const navLinks = [
  { href: '/features', labelKey: 'features' },
  { href: '/pricing', labelKey: 'pricing' },
  { href: '/blog', labelKey: 'blog' },
  { href: '/contact', labelKey: 'contact' },
];

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClientComponentClient()
  const pathname = usePathname()
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setIsAuthenticated(!!data.session)
    }

    checkSession()
  }, [supabase, pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">B</div>
            <span className="text-lg font-bold tracking-tight">BrandSphereAI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t[link.labelKey as keyof typeof t]}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />

          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  {t.dashboard}
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="outline" size="sm">
                  {t.logout}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t.login}
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  {t.signup}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <MobileMenu isAuthenticated={isAuthenticated} />
      </div>
    </header>
  )
} 