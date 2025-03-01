"use client"

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Chrome, Facebook, Twitter, Linkedin, Instagram, Info, BarChart2, Calendar, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { contentService, ScheduledPost } from '../../services/content-service'

export default function DashboardPage() {
  const router = useRouter();
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Function to connect an account (in a real implementation this would use APIs)
  const connectAccount = (platform: string) => {
    // In a real implementation this would open the OAuth flow
    // For MVP we just simulate that the account has been connected
    if (!connectedAccounts.includes(platform)) {
      setConnectedAccounts([...connectedAccounts, platform]);
    }
  };
  
  // Fetch scheduled posts from Supabase
  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const posts = await contentService.getScheduledPosts();
        setScheduledPosts(posts);
      } catch (error) {
        console.error('Error fetching scheduled posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchScheduledPosts();
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome to BrandSphereAI!</h1>
            <p className="text-muted-foreground mt-1">
              Your platform for creating and managing social media content with AI support.
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>

        {/* MVP Step-by-step guide */}
        <Card className="mb-8 border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary" />
              MVP Status: Get Started in 3 Steps
            </CardTitle>
            <CardDescription>
              This version is an MVP (Minimum Viable Product) to test core features. Follow these steps:
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ol className="space-y-6">
              <li className="flex items-start">
                <div className={`${connectedAccounts.length > 0 ? "bg-primary" : "bg-muted"} text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5`}>1</div>
                <div>
                  <h3 className="font-medium">Connect your first social media account</h3>
                  <p className="text-muted-foreground mt-1 mb-2">Start by connecting your Facebook or YouTube account.</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={connectedAccounts.includes('facebook') ? "default" : "outline"} 
                      size="sm"
                      onClick={() => connectAccount('facebook')}
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      {connectedAccounts.includes('facebook') ? 'Connected' : 'Connect Facebook'}
                    </Button>
                    <Button 
                      variant={connectedAccounts.includes('youtube') ? "default" : "outline"} 
                      size="sm"
                      onClick={() => connectAccount('youtube')}
                    >
                      <Chrome className="mr-2 h-4 w-4" />
                      {connectedAccounts.includes('youtube') ? 'Connected' : 'Connect YouTube'}
                    </Button>
                  </div>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className={`${scheduledPosts.length > 0 ? "bg-primary" : "bg-muted"} text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5`}>2</div>
                <div>
                  <h3 className="font-medium">Create your first post</h3>
                  <p className="text-muted-foreground mt-1 mb-2">Try creating a post with AI assistance and schedule it.</p>
                  <Button size="sm" onClick={() => router.push('/dashboard/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</div>
                <div>
                  <h3 className="font-medium">Give feedback</h3>
                  <p className="text-muted-foreground mt-1 mb-2">Help us improve the service by telling us what you think.</p>
                  <Button variant="outline" size="sm" onClick={() => router.push('/feedback')}>
                    Send feedback
                  </Button>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart2 className="h-4 w-4 mr-2 text-blue-500" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Posts published</p>
              <div className="mt-4 h-[60px] flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-xs text-muted-foreground">Statistics available after publishing</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-green-500" />
                Upcoming Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledPosts.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled posts</p>
              <div className="mt-4 h-[60px] overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-muted-foreground">Loading...</p>
                  </div>
                ) : scheduledPosts.length === 0 ? (
                  <div className="flex items-center justify-center h-full border rounded-md bg-muted/20">
                    <p className="text-xs text-muted-foreground">No scheduled posts</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scheduledPosts.slice(0, 2).map((post) => (
                      <div key={post.id} className="text-xs p-2 border rounded-md">
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-muted-foreground">
                          {new Date(post.scheduledFor).toLocaleDateString('en-US')}
                        </p>
                      </div>
                    ))}
                    {scheduledPosts.length > 2 && (
                      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => router.push('/dashboard/scheduled')}>
                        View all ({scheduledPosts.length})
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Settings className="h-4 w-4 mr-2 text-orange-500" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedAccounts.length}</div>
              <p className="text-xs text-muted-foreground">Connected accounts</p>
              <div className="mt-4 h-[60px] flex items-center justify-center">
                {connectedAccounts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No connected accounts</p>
                ) : (
                  <div className="flex space-x-2">
                    {connectedAccounts.includes('facebook') && <Facebook className="h-6 w-6 text-blue-600" />}
                    {connectedAccounts.includes('youtube') && <Chrome className="h-6 w-6 text-red-600" />}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platforms to Connect</CardTitle>
            <CardDescription>
              In this MVP version, we support connecting to the following social media platforms:
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Facebook className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Facebook</h3>
                    <p className="text-sm text-muted-foreground">Connect pages and create posts</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant={connectedAccounts.includes('facebook') ? "default" : "outline"} 
                  size="sm"
                  onClick={() => connectAccount('facebook')}
                >
                  {connectedAccounts.includes('facebook') ? 'Connected' : 'Connect Facebook'}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Chrome className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <h3 className="font-medium">YouTube</h3>
                    <p className="text-sm text-muted-foreground">Manage video descriptions and titles</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  variant={connectedAccounts.includes('youtube') ? "default" : "outline"} 
                  size="sm"
                  onClick={() => connectAccount('youtube')}
                >
                  {connectedAccounts.includes('youtube') ? 'Connected' : 'Connect YouTube'}
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
} 