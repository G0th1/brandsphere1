'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/app/components/theme-toggle';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
];

export default function SiteHeader() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            B
                        </div>
                        <span className="text-lg font-bold tracking-tight">BrandSphere</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname?.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm transition-colors hover:text-primary ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Auth Buttons / User Menu */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <div className="hidden md:flex items-center gap-2">
                        {session ? (
                            <Button asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href="/auth/login">Log in</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/auth/register">Sign up</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <nav className="flex flex-col gap-4 mt-8">
                                {navigationItems.map((item) => {
                                    const isActive = pathname === item.href ||
                                        (item.href !== '/' && pathname?.startsWith(item.href));

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`text-base transition-colors hover:text-primary ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                                    {session ? (
                                        <Button asChild className="w-full">
                                            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                                Dashboard
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="outline" asChild className="w-full">
                                                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                                                    Log in
                                                </Link>
                                            </Button>
                                            <Button asChild className="w-full">
                                                <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                                                    Sign up
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
} 