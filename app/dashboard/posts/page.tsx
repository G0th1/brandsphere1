import { Metadata } from "next"
import DashboardLayout from "@/app/components/dashboard-layout"
import { PostManagement } from "@/app/components/content/post-management"

export const metadata: Metadata = {
    title: "Posts | BrandSphereAI",
    description: "Create, edit, and manage your social media posts."
}

export default function PostsPage() {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <PostManagement />
            </div>
        </DashboardLayout>
    )
} 