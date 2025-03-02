"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage, useTranslation } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { commonTranslations } from "@/lib/translations"

interface MobileMenuProps {
  isAuthenticated?: boolean
  onLogout?: () => Promise<void>
}

export function MobileMenu({ isAuthenticated = false, onLogout }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const t = useTranslation(commonTranslations)

  const toggleMenu = () => setIsOpen(!isOpen)

  const closeMenu = () => setIsOpen(false)

  const handleSignOut = async () => {
    if (onLogout) {
      await onLogout()
    } else {
      await supabase.auth.signOut()
      router.refresh()
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
                    <Link href="/dashboard" onClick={closeMenu}>
                      <Button className="w-full" variant="outline" size="lg">
                        {t.navigation.dashboard}
                      </Button>
                    </Link>
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
                    <Link href="/login" onClick={closeMenu}>
                      <Button className="w-full" variant="outline" size="lg">
                        {t.navigation.login}
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={closeMenu}>
                      <Button className="w-full" size="lg">
                        {t.navigation.signup}
                      </Button>
                    </Link>
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