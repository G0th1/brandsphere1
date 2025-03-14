"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  BarChart3,
  FileEdit,
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
import { AuthGuard, useAuthUser } from "@/app/components/auth-guard"
import { createSafeSupabaseClient } from "@/app/utils/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

// Import the dynamic marker to prevent static generation
import { dynamic } from "@/app/utils/dynamic-routes"
// Re-export the dynamic marker
export { dynamic }

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
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const user = useAuthUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState('free')
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: false,
    youtube: false
  })
  const searchParams = useSearchParams()
  const supabase = createSafeSupabaseClient()
  const { language } = useLanguage()
  const t = translations[language]
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const getProfileData = async () => {
      if (!user) return

      // Hämta prenumerationsstatus från profiles-tabellen
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, connected_accounts')
        .eq('id', user.id)
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

    getProfileData()

    // Kolla om användaren just har uppgraderat
    const upgraded = searchParams?.get('upgraded')
    if (upgraded === 'true') {
      setShowUpgradeSuccess(true)
      // Ta bort parametern från URL:en efter 5 sekunder
      setTimeout(() => {
        window.history.replaceState({}, '', '/dashboard')
      }, 5000)
    }

    // Make sure the dashboard loaded flag is set
    try {
      sessionStorage.setItem('dashboard_loaded', 'true');
    } catch (e) {
      console.warn("Could not set dashboard loaded flag", e);
    }

    // Fetch projects or other dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be a fetch to your API
        // For demo purposes, we'll use a timeout and mock data
        setTimeout(() => {
          setProjects([
            {
              id: 1,
              name: "Brand Redesign",
              status: "active",
              lastUpdated: "Today",
            },
            {
              id: 2,
              name: "Marketing Campaign",
              status: "pending",
              lastUpdated: "Yesterday",
            },
            {
              id: 3,
              name: "Website Refresh",
              status: "completed",
              lastUpdated: "2 days ago",
            },
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, supabase, searchParams, toast])

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
      icon: FileEdit,
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

  // Function to get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.email?.split("@")[0] || "User"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </div>
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-9 w-16" /> : "12"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Active Projects
                </div>
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-9 w-16" /> : "4"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Completed This Month
                </div>
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-9 w-16" /> : "8"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">
                  Team Members
                </div>
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-9 w-16" /> : "6"}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Recent Projects</h3>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project: any) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Last updated: {project.lastUpdated}
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium">Analytics Overview</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Detailed analytics will be available soon.
              </p>
              {loading ? (
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : (
                <div className="mt-6 text-center text-muted-foreground">
                  <p>Analytics data visualization coming soon</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 