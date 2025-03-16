import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { socialMediaService } from '@/services/social-media';

// Mock storage for posts
let MOCK_POSTS = [
    {
        id: "post-1",
        platform: "instagram",
        content: "Check out our new summer collection! 🕯️ #handmade #candles",
        mediaUrls: ["/images/mock/post1.jpg"],
        scheduledFor: new Date(Date.now() + 86400000 * 2), // 2 days from now
        status: "scheduled",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
        id: "post-2",
        platform: "twitter",
        content: "Our eco-friendly packaging is now available for all products! 🌿 #sustainable #ecofriendly",
        mediaUrls: [],
        scheduledFor: new Date(Date.now() + 86400000 * 5), // 5 days from now
        status: "scheduled",
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    },
    {
        id: "post-3",
        platform: "facebook",
        content: "Flash sale this weekend! Use code SUMMER20 for 20% off all candles. Limited time only!",
        mediaUrls: ["/images/mock/post2.jpg"],
        scheduledFor: new Date(Date.now() + 86400000 * 3), // 3 days from now
        status: "scheduled",
        createdAt: new Date(Date.now() - 86400000 * 1.5), // 1.5 days ago
    }
];

// GET /api/posts - Get all posts
export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const platform = searchParams.get('platform');
        const status = searchParams.get('status');
        const timeframe = searchParams.get('timeframe');

        // Filter posts based on query parameters
        let filteredPosts = [...MOCK_POSTS];

        if (platform) {
            filteredPosts = filteredPosts.filter(post => post.platform === platform);
        }

        if (status) {
            filteredPosts = filteredPosts.filter(post => post.status === status);
        }

        if (timeframe) {
            const now = new Date();
            if (timeframe === 'upcoming') {
                filteredPosts = filteredPosts.filter(post =>
                    post.scheduledFor && post.scheduledFor > now
                );
            } else if (timeframe === 'past') {
                filteredPosts = filteredPosts.filter(post =>
                    post.scheduledFor && post.scheduledFor <= now
                );
            }
        }

        return NextResponse.json(filteredPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get post data from request body
        const data = await req.json();
        const { platform, content, mediaUrls, scheduledFor } = data;

        if (!platform || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create a new post
        const post = await socialMediaService.schedulePost({
            platform,
            content,
            mediaUrls: mediaUrls || [],
            scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        });

        if (!post) {
            return NextResponse.json(
                { error: 'Failed to create post' },
                { status: 500 }
            );
        }

        // Add to mock storage
        MOCK_POSTS.push(post);

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
} 