"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage, useTranslation } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { commonTranslations } from "@/lib/translations"
import { signOut } from "next-auth/react"

interface MobileMenuProps {
  isAuthenticated?: boolean
  onLogout?: () => Promise<void>
}

export function MobileMenu({ isAuthenticated = false, onLogout }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const t = useTranslation(commonTranslations)

  const toggleMenu = () => setIsOpen(!isOpen)

  const closeMenu = () => setIsOpen(false)

  const handleSignOut = async () => {
    if (onLogout) {
      await onLogout()
    } else {
      await signOut({ redirect: true, callbackUrl: '/' })
    }
    closeMenu()
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={toggleMenu}
        aria-label={isOpen ? t.buttons.closeMenu : t.buttons.openMenu}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background border-t">
          <div className="container flex flex-col p-6">
            <nav className="flex flex-col gap-6 text-lg font-medium">
              <Link href="/" onClick={closeMenu}>
                {t.navigation.home}
              </Link>
              <Link href="/features" onClick={closeMenu}>
                {t.navigation.features}
              </Link>
              <Link href="/pricing" onClick={closeMenu}>
                {t.navigation.pricing}
              </Link>
              <Link href="/blog" onClick={closeMenu}>
                {t.navigation.blog}
              </Link>
              <Link href="/app-promote" onClick={closeMenu}>
                {t.navigation.appPromote}
              </Link>
              <Link href="/contact" onClick={closeMenu}>
                {t.navigation.contact}
              </Link>
            </nav>

            <div className="mt-auto pt-8 flex flex-col gap-4">
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-medium">{t.navigation.language}</span>
                </div>
                <LanguageSwitcher variant="ghost" size="sm" />
              </div>

              <div className="flex flex-col gap-3 border-t pt-6">
                {isAuthenticated ? (
                  <>
                    <Button className="w-full" variant="outline" size="lg" asChild>
                      <Link href="/dashboard" onClick={closeMenu}>
                        {t.navigation.dashboard}
                      </Link>
                    </Button>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSignOut}
                    >
                      {t.navigation.logout}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full" variant="outline" size="lg" asChild>
                      <Link href="/auth/login" onClick={closeMenu}>
                        {t.navigation.login}
                      </Link>
                    </Button>
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/auth/register" onClick={closeMenu}>
                        {t.navigation.signup}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 