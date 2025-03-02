"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Facebook, Youtube, Check, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useTranslation } from '@/contexts/language-context'
import type { Language } from '@/contexts/language-context'

// Översättningar för anslutningssidan
const connectTranslations = {
    en: {
        title: 'Connect Accounts',
        description: 'Connect your social media accounts to automatically publish content.',
        platformsTitle: 'Available Platforms',
        connected: 'Connected',
        notConnected: 'Not Connected',
        connect: 'Connect',
        disconnect: 'Disconnect',
        facebook: {
            title: 'Facebook',
            description: 'Connect your Facebook page to post updates, images, and links.',
            permissions: 'Required permissions: Pages management, Post creation, Analytics access',
        },
        youtube: {
            title: 'YouTube',
            description: 'Connect your YouTube channel to upload videos and manage content.',
            permissions: 'Required permissions: Content management, Upload videos, Analytics access',
        },
        note: 'Note: You will be redirected to the platform to authorize access.',
    },
    sv: {
        title: 'Koppla Konton',
        description: 'Anslut dina sociala medier-konton för att automatiskt publicera innehåll.',
        platformsTitle: 'Tillgängliga Plattformar',
        connected: 'Ansluten',
        notConnected: 'Ej ansluten',
        connect: 'Anslut',
        disconnect: 'Koppla från',
        facebook: {
            title: 'Facebook',
            description: 'Anslut din Facebook-sida för att publicera uppdateringar, bilder och länkar.',
            permissions: 'Nödvändiga behörigheter: Sidhantering, Skapande av inlägg, Analystillgång',
        },
        youtube: {
            title: 'YouTube',
            description: 'Anslut din YouTube-kanal för att ladda upp videor och hantera innehåll.',
            permissions: 'Nödvändiga behörigheter: Innehållshantering, Ladda upp videor, Analystillgång',
        },
        note: 'Obs: Du kommer att omdirigeras till plattformen för att godkänna åtkomst.',
    },
};

export default function ConnectPage() {
    const t = useTranslation(connectTranslations);

    // I en riktig app skulle detta hämtas från en databas eller API
    const [connectedAccounts, setConnectedAccounts] = useState({
        facebook: false,
        youtube: false,
    });

    const handleConnect = (platform: 'facebook' | 'youtube') => {
        // I en riktig app skulle detta öppna OAuth-flödet
        // För demo: bara växla anslutningsstatus
        setConnectedAccounts({
            ...connectedAccounts,
            [platform]: true,
        });
    };

    const handleDisconnect = (platform: 'facebook' | 'youtube') => {
        // I en riktig app skulle detta ta bort behörigheter
        setConnectedAccounts({
            ...connectedAccounts,
            [platform]: false,
        });
    };

    return (
        <div className="container mx-auto py-10 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">{t.title}</h1>
            <p className="text-muted-foreground mb-8">{t.description}</p>

            <h2 className="text-xl font-semibold mb-4">{t.platformsTitle}</h2>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Facebook */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                            <Facebook className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle>{t.facebook.title}</CardTitle>
                            <CardDescription className="mt-2">
                                {connectedAccounts.facebook ? (
                                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        {t.connected}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 flex items-center gap-1">
                                        <X className="h-3 w-3" />
                                        {t.notConnected}
                                    </Badge>
                                )}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-3">{t.facebook.description}</p>
                        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertTitle className="text-blue-700 dark:text-blue-400 ml-2">Permissions</AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-400 ml-6 text-xs">
                                {t.facebook.permissions}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        {connectedAccounts.facebook ? (
                            <Button variant="outline" className="w-full" onClick={() => handleDisconnect('facebook')}>
                                {t.disconnect}
                            </Button>
                        ) : (
                            <Button className="w-full" onClick={() => handleConnect('facebook')}>
                                {t.connect}
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* YouTube */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                            <Youtube className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <CardTitle>{t.youtube.title}</CardTitle>
                            <CardDescription className="mt-2">
                                {connectedAccounts.youtube ? (
                                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        {t.connected}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 flex items-center gap-1">
                                        <X className="h-3 w-3" />
                                        {t.notConnected}
                                    </Badge>
                                )}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-3">{t.youtube.description}</p>
                        <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertTitle className="text-red-700 dark:text-red-400 ml-2">Permissions</AlertTitle>
                            <AlertDescription className="text-red-700 dark:text-red-400 ml-6 text-xs">
                                {t.youtube.permissions}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        {connectedAccounts.youtube ? (
                            <Button variant="outline" className="w-full" onClick={() => handleDisconnect('youtube')}>
                                {t.disconnect}
                            </Button>
                        ) : (
                            <Button className="w-full" onClick={() => handleConnect('youtube')}>
                                {t.connect}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>

            <p className="text-xs text-muted-foreground mt-8">{t.note}</p>
        </div>
    )
} 