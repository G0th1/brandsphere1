"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

// Översättningar
const translations = {
  en: {
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    blog: "Blog",
    faq: "FAQ",
    contact: "Contact",
    dashboard: "Dashboard",
    logout: "Log out",
    login: "Log in",
    signup: "Sign up",
    closeMenu: "Close menu",
    openMenu: "Open menu"
  },
  sv: {
    home: "Hem",
    features: "Funktioner",
    pricing: "Priser",
    blog: "Blogg",
    faq: "Vanliga frågor",
    contact: "Kontakt",
    dashboard: "Instrumentpanel",
    logout: "Logga ut",
    login: "Logga in",
    signup: "Registrera dig",
    closeMenu: "Stäng meny",
    openMenu: "Öppna meny"
  }
};

interface MobileMenuProps {
  isAuthenticated?: boolean
}

export function MobileMenu({ isAuthenticated = false }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { language } = useLanguage();
  const t = translations[language];

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    closeMenu()
  }

  const navLinks = [
    { href: "/", labelKey: "home" },
    { href: "/features", labelKey: "features" },
    { href: "/pricing", labelKey: "pricing" },
    { href: "/blog", labelKey: "blog" },
    { href: "/faq", labelKey: "faq" },
    { href: "/contact", labelKey: "contact" },
  ]

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50"
        onClick={toggleMenu}
        aria-label={isOpen ? t.closeMenu : t.openMenu}
      >
        {isOpen ? (
          <X className="h-5 w-5 animate-fade-in" />
        ) : (
          <Menu className="h-5 w-5 animate-fade-in" />
        )}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-4/5 max-w-sm bg-background shadow-lg z-45 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between mb-8 items-center">
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="ghost" />
              <span className="text-sm font-medium">
                {language === "en" ? "EN" : "SV"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMenu}
              aria-label={t.closeMenu}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex flex-col space-y-6 text-lg font-medium">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors relative group overflow-hidden"
                onClick={closeMenu}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="relative z-10 animate-slide-in-from-right" style={{ animationDelay: `${index * 75}ms` }}>
                  {t[link.labelKey as keyof typeof t]}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4 pt-8">
            {isAuthenticated ? (
              <>
                <Button
                  variant="default"
                  className="w-full animate-fade-in"
                  style={{ animationDelay: '400ms' }}
                  onClick={() => {
                    router.push("/dashboard")
                    closeMenu()
                  }}
                >
                  {t.dashboard}
                </Button>
                <Button
                  variant="outline"
                  className="w-full animate-fade-in"
                  style={{ animationDelay: '500ms' }}
                  onClick={handleSignOut}
                >
                  {t.logout}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  className="w-full animate-fade-in"
                  style={{ animationDelay: '400ms' }}
                  onClick={() => {
                    router.push("/login")
                    closeMenu()
                  }}
                >
                  {t.login}
                </Button>
                <Button
                  variant="outline"
                  className="w-full animate-fade-in"
                  style={{ animationDelay: '500ms' }}
                  onClick={() => {
                    router.push("/signup")
                    closeMenu()
                  }}
                >
                  {t.signup}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 