import { platformService } from '@/services/platform-service'

const TOKEN_REFRESH_ENDPOINTS = {
  youtube: 'https://oauth2.googleapis.com/token',
  facebook: 'https://graph.facebook.com/v18.0/oauth/access_token',
}

export class TokenService {
  static async refreshTokenIfNeeded(platform: 'youtube' | 'facebook') {
    try {
      const connection = await platformService.getConnection(platform)
      if (!connection) return null

      // Försök att använda access token först
      try {
        const testEndpoint = platform === 'youtube'
          ? 'https://www.googleapis.com/youtube/v3/channels?part=id&mine=true'
          : 'https://graph.facebook.com/v18.0/me'

        const response = await fetch(testEndpoint, {
          headers: { Authorization: `Bearer ${connection.access_token}` },
        })

        if (response.ok) return connection.access_token
      } catch (error) {
        console.error('Token validation error:', error)
      }

      // Om access token är ogiltig, använd refresh token
      const refreshResponse = await fetch(TOKEN_REFRESH_ENDPOINTS[platform], {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: platform === 'youtube'
            ? process.env.GOOGLE_CLIENT_ID!
            : process.env.FACEBOOK_APP_ID!,
          client_secret: platform === 'youtube'
            ? process.env.GOOGLE_CLIENT_SECRET!
            : process.env.FACEBOOK_APP_SECRET!,
          refresh_token: connection.refresh_token,
          grant_type: 'refresh_token',
        }),
      })

      if (!refreshResponse.ok) {
        throw new Error('Token refresh misslyckades')
      }

      const data = await refreshResponse.json()
      
      // Spara nya tokens
      await platformService.saveConnection({
        platform,
        accessToken: data.access_token,
        refreshToken: connection.refresh_token, // Behåll samma refresh token
        platformUserId: connection.platform_user_id,
      })

      return data.access_token
    } catch (error) {
      console.error('Token refresh error:', error)
      throw new Error('Kunde inte uppdatera access token')
    }
  }
} 