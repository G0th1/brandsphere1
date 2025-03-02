"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import {
  Calendar,
  BarChart3,
  FilePenLine,
  PlusCircle,
  Instagram,
  Twitter,
  Facebook,
  LogOut,
  ArrowRight,
  CheckCircle,
  Lock,
  Zap,
  X,
  Youtube
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"

// Översättningar
const translations = {
  en: {
    loading: "Loading...",
    welcomeTitle: "Welcome to your dashboard",
    welcomeDescription: "Manage and analyze your social media content from one place.",
    upgradeTitle: "Upgrade to Pro",
    upgradeDescription: "Get unlimited posts and advanced features",
    upgradeButton: "Upgrade now",
    totalPosts: "Total posts",
    engagement: "Engagement",
    activeAccounts: "Active accounts",
    scheduledPosts: "Scheduled posts",
    last30Days: "Last 30 days",
    engagementDescription: "Likes, comments, shares",
    connectedPlatforms: "Connected to the platform",
    upcomingPublications: "Upcoming publications",
    upgradeSuccess: "Upgrade completed!",
    upgradeSuccessDesc: "You now have access to Pro features! Explore all new possibilities.",
    upcomingPostsTitle: "Upcoming posts",
    upcomingPostsDescription: "Manage your scheduled content",
    createPostButton: "Create new post",
    viewAllButton: "View all",
    today: "Today",
    tomorrow: "Tomorrow",
    connectAccounts: "Connect Accounts",
    connectAccountsDesc: "Connect your social media accounts to get started",
    connectButton: "Connect",
    facebookConnect: "Connect Facebook",
    youtubeConnect: "Connect YouTube",
    noPostsScheduled: "No posts scheduled",
    noPostsDesc: "Create your first post to get started"
  },
  sv: {
    loading: "Laddar...",
    welcomeTitle: "Välkommen till din instrumentpanel",
    welcomeDescription: "Hantera och analysera ditt innehåll på sociala medier från en plats.",
    upgradeTitle: "Uppgradera till Pro",
    upgradeDescription: "Få obegränsade inlägg och avancerade funktioner",
    upgradeButton: "Uppgradera nu",
    totalPosts: "Totala inlägg",
    engagement: "Engagemang",
    activeAccounts: "Aktiva konton",
    scheduledPosts: "Schemalagda inlägg",
    last30Days: "Senaste 30 dagarna",
    engagementDescription: "Likes, kommentarer, delningar",
    connectedPlatforms: "Anslutna till plattformen",
    upcomingPublications: "Kommande publiceringar",
    upgradeSuccess: "Uppgradering slutförd!",
    upgradeSuccessDesc: "Du har nu tillgång till Pro-funktionerna! Utforska alla nya möjligheter.",
    upcomingPostsTitle: "Kommande inlägg",
    upcomingPostsDescription: "Hantera ditt schemalagda innehåll",
    createPostButton: "Skapa nytt inlägg",
    viewAllButton: "Visa alla",
    today: "Idag",
    tomorrow: "Imorgon",
    connectAccounts: "Anslut konton",
    connectAccountsDesc: "Anslut dina sociala mediekonton för att komma igång",
    connectButton: "Anslut",
    facebookConnect: "Anslut Facebook",
    youtubeConnect: "Anslut YouTube",
    noPostsScheduled: "Inga inlägg schemalagda",
    noPostsDesc: "Skapa ditt första inlägg för att komma igång"
  }
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState('free')
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: false,
    youtube: false
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const { language } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        router.replace("/login")
        return
      }

      setUser(session.user)

      // Hämta prenumerationsstatus från profiles-tabellen
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, connected_accounts')
        .eq('id', session.user.id)
        .single()

      if (data && !profileError) {
        setSubscription(data.subscription_tier || 'free')

        // Om det finns connected_accounts i profilen, uppdatera state
        if (data.connected_accounts) {
          try {
            const accounts = JSON.parse(data.connected_accounts)
            setConnectedAccounts({
              facebook: accounts.facebook || false,
              youtube: accounts.youtube || false
            })
          } catch (e) {
            console.error("Could not parse connected accounts", e)
          }
        }
      }

      setLoading(false)
    }

    getUser()

    // Kolla om användaren just har uppgraderat
    const upgraded = searchParams?.get('upgraded')
    if (upgraded === 'true') {
      setShowUpgradeSuccess(true)
      // Ta bort parametern från URL:en efter 5 sekunder
      setTimeout(() => {
        window.history.replaceState({}, '', '/dashboard')
      }, 5000)
    }
  }, [router, supabase, searchParams])

  const connectAccount = async (platform: 'facebook' | 'youtube') => {
    // I en riktig app skulle detta anropa en OAuth-flöde
    // För demo-syften simulerar vi bara en anslutning
    setConnectedAccounts(prev => ({
      ...prev,
      [platform]: true
    }))

    // Uppdatera databasen med de anslutna kontona
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          connected_accounts: JSON.stringify({
            ...connectedAccounts,
            [platform]: true
          }),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error("Error updating connected accounts", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">{t.loading}</div>
      </div>
    )
  }

  const stats = [
    {
      title: t.totalPosts,
      value: subscription === 'pro' ? "87" : "12",
      icon: FilePenLine,
      description: t.last30Days,
    },
    {
      title: t.engagement,
      value: subscription === 'pro' ? "12.5k" : "1.2k",
      icon: BarChart3,
      description: t.engagementDescription,
    },
    {
      title: t.activeAccounts,
      value: subscription === 'pro' ? "8" : "2",
      icon: Instagram,
      description: t.connectedPlatforms,
      locked: subscription !== 'pro' && true,
    },
    {
      title: t.scheduledPosts,
      value: subscription === 'pro' ? "24" : "3",
      icon: Calendar,
      description: t.upcomingPublications,
      locked: subscription !== 'pro' && true,
    },
  ]

  // Hårdkodade exempel på inlägg - i en riktig app skulle dessa hämtas från databasen
  const upcomingPosts = [
    {
      title: language === 'en'
        ? "5 tips for effective digital marketing"
        : "5 tips för effektiv digital marknadsföring",
      platform: "LinkedIn",
      scheduled: language === 'en' ? "Today, 14:30" : "Idag, 14:30",
    },
    {
      title: language === 'en'
        ? "Launching new product next week! #exciting"
        : "Lanserar ny produkt nästa vecka! #spännande",
      platform: "Twitter",
      scheduled: language === 'en' ? "Tomorrow, 10:15" : "Imorgon, 10:15",
    },
    {
      title: language === 'en'
        ? "Behind the scenes at our latest event"
        : "Bakom kulisserna på vårt senaste event",
      platform: "Instagram",
      scheduled: language === 'en' ? "June 23, 18:00" : "23 jun, 18:00",
    },
  ]

  return (
    <div className="py-8">
      <div className="container px-4 md:px-6">
        {showUpgradeSuccess && (
          <div className="mb-6">
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">{t.upgradeSuccess}</AlertTitle>
              <AlertDescription className="text-green-700">
                {t.upgradeSuccessDesc}
              </AlertDescription>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-green-600 hover:text-green-800 hover:bg-green-100"
                onClick={() => setShowUpgradeSuccess(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          </div>
        )}

        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">
              {t.welcomeTitle}
            </h1>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "100ms" }}>
              {t.welcomeDescription}
            </p>
          </div>

          {subscription === 'free' && (
            <Card className="border-accent/50 bg-accent/5 animate-fade-in" style={{ animationDelay: "150ms" }}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t.upgradeTitle}</h3>
                      <p className="text-muted-foreground text-sm">{t.upgradeDescription}</p>
                    </div>
                  </div>
                  <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/dashboard/upgrade">
                      {t.upgradeButton}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {stats.map((stat, index) => (
              <Card key={index} className={stat.locked ? "border-muted bg-muted/20" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                    {stat.locked && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Lock className="h-3 w-3 mr-1" />
                        Pro
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Anslut sociala mediekonton om inga är anslutna */}
          {!connectedAccounts.facebook && !connectedAccounts.youtube && (
            <Card className="animate-fade-in" style={{ animationDelay: "250ms" }}>
              <CardHeader>
                <CardTitle>{t.connectAccounts}</CardTitle>
                <CardDescription>{t.connectAccountsDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start h-auto py-3"
                    onClick={() => connectAccount('facebook')}
                  >
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <div className="flex flex-col items-start">
                      <span>{t.facebookConnect}</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 justify-start h-auto py-3"
                    onClick={() => connectAccount('youtube')}
                  >
                    <Youtube className="h-5 w-5 text-red-600" />
                    <div className="flex flex-col items-start">
                      <span>{t.youtubeConnect}</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="col-span-1 md:col-span-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{t.upcomingPostsTitle}</CardTitle>
                <CardDescription>{t.upcomingPostsDescription}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Link href="/dashboard/posts">
                    {t.viewAllButton}
                  </Link>
                </Button>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t.createPostButton}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingPosts.length > 0 ? (
                <div className="space-y-4">
                  {upcomingPosts.map((post, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="rounded-md bg-muted p-2">
                          {post.platform === "LinkedIn" && <div className="bg-blue-100 text-blue-800 h-8 w-8 flex items-center justify-center rounded-md">Li</div>}
                          {post.platform === "Twitter" && <Twitter className="h-8 w-8 text-sky-500" />}
                          {post.platform === "Instagram" && <Instagram className="h-8 w-8 text-pink-500" />}
                          {post.platform === "Facebook" && <Facebook className="h-8 w-8 text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{post.title}</h4>
                          <p className="text-xs text-muted-foreground">{post.platform} • {post.scheduled}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">{t.noPostsScheduled}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t.noPostsDesc}</p>
                  <Button className="mt-6">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t.createPostButton}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 