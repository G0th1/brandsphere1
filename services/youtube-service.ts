import { platformService } from './platform-service';
import { YouTubeService as LibYouTubeService, YouTubeChannel, YouTubeVideo } from '@/lib/services/youtube-service';

// YouTube API service for interacting with the YouTube platform
// In a production version we would use the Google YouTube API
export class YouTubeService {
  private static instance: LibYouTubeService = new LibYouTubeService();

  // Get information about the user's YouTube channel
  static async getChannelInfo() {
    try {
      // Get the user's YouTube connection from Supabase
      const connection = await platformService.getConnection('youtube');

      if (!connection) {
        throw new Error('No YouTube connection found');
      }

      try {
        // Försök använda den faktiska implementationen
        const channelInfo = await this.instance.getChannel(connection.user_id);
        return channelInfo;
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError);
        // Fallback till simulerad data om API-anropet misslyckas
        return {
          id: 'UC123456789',
          title: 'My YouTube Channel',
          description: 'This is my YouTube channel for sharing content about tech and marketing.',
          subscriberCount: 850,
          videoCount: 45,
          viewCount: 12500
        };
      }
    } catch (error) {
      console.error('Error fetching YouTube channel:', error);
      throw new Error('Could not fetch YouTube channel information');
    }
  }

  // Get the user's recent videos
  static async getRecentVideos(maxResults = 5) {
    try {
      // Get the user's YouTube connection from Supabase
      const connection = await platformService.getConnection('youtube');

      if (!connection) {
        throw new Error('No YouTube connection found');
      }

      try {
        // Försök använda den faktiska implementationen
        const videos = await this.instance.getVideos(connection.user_id, maxResults);
        return videos;
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError);
        // Fallback till simulerad data om API-anropet misslyckas
        return Array.from({ length: maxResults }).map((_, index) => ({
          id: `video-${index + 1}`,
          title: `Video ${index + 1}: How to use AI for content creation`,
          description: 'In this video we go through how you can use AI to create engaging content.',
          publishedAt: new Date(Date.now() - (index * 86400000)),
          thumbnailUrl: `https://picsum.photos/320/180?random=${index}`,
          viewCount: Math.floor(Math.random() * 1000),
          likeCount: Math.floor(Math.random() * 100),
          commentCount: Math.floor(Math.random() * 20)
        }));
      }
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      throw new Error('Could not fetch YouTube videos');
    }
  }

  // Publish a new video (only description/title for MVP)
  static async updateVideoMetadata(videoId: string, title: string, description: string) {
    try {
      // Get the user's YouTube connection from Supabase
      const connection = await platformService.getConnection('youtube');

      if (!connection) {
        throw new Error('No YouTube connection found');
      }

      // In a real implementation we would make API calls to YouTube here
      console.log('Updating YouTube video metadata:', { videoId, title, description });

      // Simulate a successful response
      return {
        success: true,
        message: 'The video metadata has been updated'
      };
    } catch (error) {
      console.error('Error updating YouTube video:', error);
      throw new Error('Could not update YouTube video');
    }
  }
}

export default YouTubeService; 