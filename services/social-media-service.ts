import { FacebookService } from './facebook-service';
import { YouTubeService } from './youtube-service';
import { platformService } from './platform-service';
import { ContentSuggestion, ScheduledPost } from './content-service';

// Translates the different platform-specific API calls to a common interface
export class SocialMediaService {
  // Check if the user has connected to a specific platform
  static async isConnected(platform: 'facebook' | 'youtube'): Promise<boolean> {
    try {
      const connection = await platformService.getConnection(platform);
      return !!connection;
    } catch (error) {
      console.error(`Error checking ${platform} connection:`, error);
      return false;
    }
  }
  
  // Get connection status for all supported platforms
  static async getConnectionStatus(): Promise<Record<string, boolean>> {
    const [facebook, youtube] = await Promise.all([
      this.isConnected('facebook'),
      this.isConnected('youtube')
    ]);
    
    return {
      facebook,
      youtube
    };
  }
  
  // Publish content on the right platform based on ContentSuggestion
  static async publishContent(content: ContentSuggestion, schedule = false, scheduledTime?: string): Promise<any> {
    if (!content.platform) {
      throw new Error('Platform must be specified to publish content');
    }
    
    // For scheduled posts, check that time is available
    if (schedule && !scheduledTime) {
      throw new Error('Scheduling requires a timestamp');
    }
    
    // Publish to the right platform
    if (content.platform === 'facebook') {
      // For MVP, simulate publishing with the first page found
      const pages = await FacebookService.getPages();
      
      if (pages.length === 0) {
        throw new Error('No Facebook pages found');
      }
      
      const pageId = pages[0].id;
      
      if (schedule && scheduledTime) {
        return await FacebookService.schedulePost(
          pageId,
          content.content,
          new Date(scheduledTime)
        );
      } else {
        return await FacebookService.publishPost(
          pageId,
          content.content
        );
      }
    } else if (content.platform === 'youtube') {
      // For MVP, simulate updating an existing video
      // In a complete implementation we would support uploading new videos
      const videos = await YouTubeService.getRecentVideos(1);
      
      if (videos.length === 0) {
        throw new Error('No YouTube videos found');
      }
      
      return await YouTubeService.updateVideoMetadata(
        videos[0].id,
        content.title,
        content.content
      );
    } else {
      throw new Error(`Platform ${content.platform} is not supported`);
    }
  }
  
  // Get statistics from all connected platforms
  static async getStatistics(): Promise<any> {
    const status = await this.getConnectionStatus();
    const stats: any = {};
    
    if (status.facebook) {
      try {
        const pages = await FacebookService.getPages();
        
        if (pages.length > 0) {
          const pageId = pages[0].id;
          const posts = await FacebookService.getRecentPosts(pageId, 10);
          
          let totalReactions = 0;
          let totalComments = 0;
          let totalShares = 0;
          
          posts.forEach(post => {
            totalReactions += post.insights.reactions || 0;
            totalComments += post.insights.comments || 0;
            totalShares += post.insights.shares || 0;
          });
          
          stats.facebook = {
            followers: pages[0].followers,
            posts: posts.length,
            engagement: {
              reactions: totalReactions,
              comments: totalComments,
              shares: totalShares
            }
          };
        }
      } catch (error) {
        console.error('Error fetching Facebook statistics:', error);
      }
    }
    
    if (status.youtube) {
      try {
        const channelInfo = await YouTubeService.getChannelInfo();
        const videos = await YouTubeService.getRecentVideos(10);
        
        let totalViews = 0;
        let totalLikes = 0;
        let totalComments = 0;
        
        videos.forEach(video => {
          totalViews += parseInt(video.statistics.viewCount) || 0;
          totalLikes += parseInt(video.statistics.likeCount) || 0;
          totalComments += parseInt(video.statistics.commentCount) || 0;
        });
        
        stats.youtube = {
          subscribers: parseInt(channelInfo.statistics.subscriberCount) || 0,
          videos: parseInt(channelInfo.statistics.videoCount) || 0,
          views: parseInt(channelInfo.statistics.viewCount) || 0,
          engagement: {
            views: totalViews,
            likes: totalLikes,
            comments: totalComments
          }
        };
      } catch (error) {
        console.error('Error fetching YouTube statistics:', error);
      }
    }
    
    return stats;
  }
}

export default SocialMediaService;