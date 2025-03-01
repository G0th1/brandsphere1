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
  X
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState('free')
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

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
        .select('subscription_tier')
        .eq('id', session.user.id)
        .single()
      
      if (data && !profileError) {
        setSubscription(data.subscription_tier || 'free')
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Laddar...</div>
      </div>
    )
  }

  const stats = [
    {
      title: "Totala inlägg",
      value: subscription === 'pro' ? "87" : "12",
      icon: FilePenLine,
      description: "Senaste 30 dagarna",
    },
    {
      title: "Engagemang",
      value: subscription === 'pro' ? "12.5k" : "1.2k",
      icon: BarChart3,
      description: "Likes, kommentarer, delningar",
    },
    {
      title: "Aktiva konton",
      value: subscription === 'pro' ? "8" : "2",
      icon: Instagram,
      description: "Anslutna till plattformen",
      locked: subscription !== 'pro' && true,
    },
    {
      title: "Schemalagda inlägg",
      value: subscription === 'pro' ? "24" : "3",
      icon: Calendar,
      description: "Kommande publiceringar",
      locked: subscription !== 'pro' && true,
    },
  ]

  const upcomingPosts = [
    {
      title: "5 tips för effektiv digital marknadsföring",
      platform: "LinkedIn",
      scheduled: "Idag, 14:30",
    },
    {
      title: "Lanserar ny produkt nästa vecka! #spännande",
      platform: "Twitter",
      scheduled: "Imorgon, 10:15",
    },
    {
      title: "Bakom kulisserna på vårt senaste event",
      platform: "Instagram",
      scheduled: "23 jun, 18:00",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">B</div>
              <span className="text-lg font-bold tracking-tight">BrandSphereAI</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                {user?.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logga ut</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {showUpgradeSuccess && (
            <div className="mb-6">
              <Alert className="bg-green-50 text-green-900 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">Uppgradering slutförd!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Du har nu tillgång till Pro-funktionerna! Utforska alla nya möjligheter.
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
                Välkommen till din dashboard
              </h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "100ms" }}>
                Hantera och analysera ditt innehåll på sociala medier från en plats.
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
                        <h3 className="font-semibold text-lg">Uppgradera till Pro</h3>
                        <p className="text-muted-foreground text-sm">Få obegränsade inlägg och avancerade funktioner</p>
                      </div>
                    </div>
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href="/dashboard/upgrade">
                        Uppgradera nu
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
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Kommande inlägg</CardTitle>
                  <CardDescription>
                    Dina schemalagda inlägg för kommande dagar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {upcomingPosts.slice(0, subscription === 'pro' ? 3 : 1).map((post, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-md border">
                        <div className="flex-shrink-0">
                          {post.platform === "Instagram" && <Instagram className="h-5 w-5 text-pink-500" />}
                          {post.platform === "Twitter" && <Twitter className="h-5 w-5 text-blue-500" />}
                          {post.platform === "LinkedIn" && <FilePenLine className="h-5 w-5 text-blue-700" />}
                          {post.platform === "Facebook" && <Facebook className="h-5 w-5 text-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{post.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span>{post.platform}</span>
                            <span>•</span>
                            <span>{post.scheduled}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          Redigera
                        </Button>
                      </div>
                    ))}
                    
                    {subscription === 'free' && upcomingPosts.length > 1 && (
                      <div className="border border-dashed rounded-md flex flex-col items-center justify-center p-6 text-center">
                        <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Uppgradera till Pro för att se och schemalägga fler inlägg
                        </p>
                        <Button asChild variant="link" size="sm" className="mt-2">
                          <Link href="/dashboard/upgrade">
                            Uppgradera nu
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tips för bättre innehåll</CardTitle>
                  <CardDescription>
                    AI-genererade rekommendationer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/30 rounded-md">
                      <h4 className="font-medium text-sm mb-1">Använd hashtags strategiskt</h4>
                      <p className="text-xs text-muted-foreground">
                        Begränsa antalet hashtags till 3-5 per inlägg för bättre engagemang.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded-md">
                      <h4 className="font-medium text-sm mb-1">Bästa tiden att posta</h4>
                      <p className="text-xs text-muted-foreground">
                        Baserat på din målgrupp, posta mellan 18-20 på vardagar för bäst resultat.
                      </p>
                    </div>
                    
                    {subscription !== 'pro' && (
                      <div className="border border-dashed rounded-md p-3 flex flex-col items-center text-center">
                        <Lock className="h-5 w-5 text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">
                          Uppgradera för att få fler personaliserade tips
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 