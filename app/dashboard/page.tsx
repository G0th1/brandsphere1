"use client"

import { useState, useEffect } from "react"
import { useAuthUser } from "@/app/components/auth-guard"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Import the dynamic marker to prevent static generation
import { dynamic } from "@/app/utils/dynamic-routes"
// Re-export the dynamic marker
export { dynamic }

export default function DashboardPage() {
  const user = useAuthUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])

  useEffect(() => {
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
  }, [toast]);

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
  );
} 