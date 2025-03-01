"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { 
  Calendar, 
  BarChart3, 
  LineChart, 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  Instagram, 
  Twitter, 
  Facebook, 
  LogOut 
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
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.replace("/login")
        return
      }
      
      setUser(session.user)
      setLoading(false)
    }
    
    getUser()
  }, [router, supabase])

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
      
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">
              Välkommen till din dashboard
            </h1>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "100ms" }}>
              Hantera och analysera ditt innehåll på sociala medier från en plats.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {[
              { 
                title: "Totalt inlägg", 
                value: "24", 
                trend: "+12.5%", 
                description: "Från föregående månad", 
                icon: MessageSquare 
              },
              { 
                title: "Engagemang", 
                value: "1,249", 
                trend: "+18.2%", 
                description: "Från föregående månad", 
                icon: BarChart3 
              },
              { 
                title: "Aktiva konton", 
                value: "3", 
                trend: "+1", 
                description: "Från föregående månad", 
                icon: Instagram 
              },
              { 
                title: "Planerade inlägg", 
                value: "12", 
                trend: "+3", 
                description: "För nästa vecka", 
                icon: Calendar 
              },
            ].map((stat, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-600">{stat.trend}</span> 
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Kommande inlägg</CardTitle>
                <CardDescription>
                  Dina schemalagda inlägg för kommande dagar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { 
                      platform: "Instagram", 
                      title: "Produktlansering", 
                      date: "Idag, 15:30", 
                      icon: Instagram,
                      color: "text-pink-500"
                    },
                    { 
                      platform: "Twitter", 
                      title: "Industri-nyheter", 
                      date: "Imorgon, 09:00", 
                      icon: Twitter,
                      color: "text-blue-500"
                    },
                    { 
                      platform: "Facebook", 
                      title: "Kundrecension", 
                      date: "25 Jul, 12:00", 
                      icon: Facebook,
                      color: "text-indigo-500"
                    },
                  ].map((post, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
                    >
                      <div className={`rounded-full p-2 bg-muted flex items-center justify-center ${post.color}`}>
                        <post.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{post.title}</h4>
                        <p className="text-xs text-muted-foreground">{post.platform} · {post.date}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Inställningar</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Skapa nytt inlägg
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Plattformsöversikt</CardTitle>
                <CardDescription>
                  Prestationsstatistik för dina sociala medieplattformar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      platform: "Instagram",
                      followers: "2,456",
                      engagement: "3.8%",
                      trend: "+5.6%",
                      icon: Instagram,
                      color: "text-pink-500"
                    },
                    {
                      platform: "Twitter",
                      followers: "1,894",
                      engagement: "2.2%",
                      trend: "+1.2%",
                      icon: Twitter,
                      color: "text-blue-500"
                    },
                    {
                      platform: "Facebook",
                      followers: "4,671",
                      engagement: "1.9%",
                      trend: "+0.8%",
                      icon: Facebook,
                      color: "text-indigo-500"
                    }
                  ].map((platform, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`rounded-full p-2 bg-muted flex items-center justify-center ${platform.color}`}>
                        <platform.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">{platform.platform}</h4>
                          <p className="text-xs text-muted-foreground">{platform.followers} följare</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{platform.engagement}</div>
                          <p className="text-xs text-green-600">{platform.trend}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-[200px] mt-6 flex items-center justify-center border rounded-md bg-muted/10">
                  <div className="text-center">
                    <LineChart className="h-8 w-8 mx-auto text-muted-foreground/60" />
                    <p className="text-sm mt-2 text-muted-foreground">Detaljerad statistik kommer snart</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  Visa fullständig analys
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 