import { TokenService } from './token-service'
// Kommentera bort import från saknad fil
// import { platformService } from './platform-service'
import { getCachedData, CACHE_KEYS, CACHE_TTL } from './redis-service'

// Skapa en enkel stub för att ersätta den saknade platform-service
export const platformService = {
  getPlatformData: async (userId: string, platform: string) => {
    // Dummy-implementation, ersätt med faktisk logik i produktion
    return null;
  }
};

export type YouTubeChannel = {
  id: string
  title: string
  description: string
  subscriberCount: number
  videoCount: number
  viewCount: number
}

export type YouTubeVideo = {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: Date
  viewCount: number
  likeCount: number
  commentCount: number
}

interface VideoStats {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}

export class YouTubeService {
  // Hämta information om användarens YouTube-kanal med caching
  async getChannel(userId: string): Promise<YouTubeChannel> {
    return getCachedData(
      CACHE_KEYS.YOUTUBE_CHANNEL(userId),
      async () => {
        const accessToken = await TokenService.refreshTokenIfNeeded('youtube')
        if (!accessToken) throw new Error('Ingen YouTube-anslutning hittad')

        const response = await fetch(
          'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Kunde inte hämta kanalinformation')
        }

        const data = await response.json()
        const channel = data.items[0]

        return {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          subscriberCount: parseInt(channel.statistics.subscriberCount),
          videoCount: parseInt(channel.statistics.videoCount),
          viewCount: parseInt(channel.statistics.viewCount),
        }
      },
      CACHE_TTL.YOUTUBE_CHANNEL
    )
  }

  // Hämta användarens senaste videor med caching
  async getVideos(userId: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    return getCachedData(
      CACHE_KEYS.YOUTUBE_VIDEOS(userId),
      async () => {
        const accessToken = await TokenService.refreshTokenIfNeeded('youtube')
        if (!accessToken) throw new Error('Ingen YouTube-anslutning hittad')

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&forMine=true&maxResults=${maxResults}&order=date`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Kunde inte hämta videor')
        }

        const data = await response.json()
        const videoIds = data.items.map((item: any) => item.id.videoId).join(',')

        // Hämta detaljerad statistik för videorna
        const statsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        )

        if (!statsResponse.ok) {
          throw new Error('Kunde inte hämta videostatistik')
        }

        const statsData = await statsResponse.json()
        const statsMap = new Map<string, VideoStats>()

        statsData.items.forEach((item: any) => {
          statsMap.set(item.id, {
            viewCount: item.statistics.viewCount,
            likeCount: item.statistics.likeCount,
            commentCount: item.statistics.commentCount
          })
        })

        return data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.medium.url,
          publishedAt: new Date(item.snippet.publishedAt),
          viewCount: parseInt(statsMap.get(item.id.videoId)?.viewCount || '0'),
          likeCount: parseInt(statsMap.get(item.id.videoId)?.likeCount || '0'),
          commentCount: parseInt(statsMap.get(item.id.videoId)?.commentCount || '0'),
        }))
      },
      CACHE_TTL.YOUTUBE_VIDEOS
    )
  }
} 