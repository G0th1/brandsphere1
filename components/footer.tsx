"use client"

import Link from 'next/link'
import { useLanguage, useTranslation } from '@/contexts/language-context'
import { commonTranslations } from '@/lib/translations'

export function Footer() {
  const { language } = useLanguage();
  const t = useTranslation(commonTranslations);

  return (
    <footer className="w-full border-t py-12 md:py-16 lg:py-20">
      <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">BrandSphereAI</h3>
          <p className="text-sm text-muted-foreground">
            {language === 'en'
              ? 'Powerful AI platform for managing social media smarter and more efficiently.'
              : 'Kraftfull AI-plattform för att hantera sociala medier smartare och effektivare.'}
          </p>
        </div>
        <nav className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3">
          <div className="space-y-3">
            <h4 className="text-sm font-bold">{t.footer.products}</h4>
            <ul className="space-y-2">
              {[
                { href: '/features', labelKey: 'features' },
                { href: '/pricing', labelKey: 'pricing' },
                { href: '/roadmap', label: language === 'en' ? 'Roadmap' : 'Roadmap' },
                { href: '/integrations', label: language === 'en' ? 'Integrations' : 'Integrationer' },
                { href: '/app-promote', labelKey: 'appPromote' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.labelKey ? t.navigation[link.labelKey as keyof typeof t.navigation] : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold">{t.footer.resources}</h4>
            <ul className="space-y-2">
              {[
                { href: '/blog', labelKey: 'blog' },
                { href: '/guides', label: language === 'en' ? 'Guides' : 'Guider' },
                { href: '/help', label: language === 'en' ? 'Help Center' : 'Hjälpcenter' },
                { href: '/api-docs', label: language === 'en' ? 'API Documentation' : 'API Dokumentation' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.labelKey ? t.navigation[link.labelKey as keyof typeof t.navigation] : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-bold">{t.footer.aboutUs}</h4>
            <ul className="space-y-2">
              {[
                { href: '/about', label: language === 'en' ? 'About' : 'Om oss' },
                { href: '/careers', label: language === 'en' ? 'Careers' : 'Karriär' },
                { href: '/contact', labelKey: 'contact' },
                { href: '/press', label: language === 'en' ? 'Press' : 'Press' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.labelKey ? t.navigation[link.labelKey as keyof typeof t.navigation] : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="mt-8 border-t pt-8 md:col-span-2 lg:col-span-4 lg:flex lg:items-center lg:justify-between">
          <p className="text-xs text-muted-foreground">
            {t.footer.copyright}
          </p>
          <nav className="mt-4 flex gap-4 lg:mt-0">
            {[
              { href: '/privacy', label: language === 'en' ? 'Privacy Policy' : 'Integritetspolicy' },
              { href: '/terms', label: language === 'en' ? 'Terms of Service' : 'Användarvillkor' },
              { href: '/cookies', label: language === 'en' ? 'Cookies' : 'Cookies' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
} 