import { supabase } from '@/lib/supabase'
import { EncryptionService } from '@/lib/services/encryption-service'

interface PlatformConnection {
  platform: 'youtube' | 'facebook'
  accessToken: string
  refreshToken: string
  platformUserId: string
}

interface EncryptedTokens {
  encryptedData: string
  iv: string
  authTag: string
}

class PlatformService {
  async saveConnection(connection: PlatformConnection) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Ingen användare inloggad')

    // Kryptera tokens
    const accessTokenEncrypted = EncryptionService.encrypt(connection.accessToken)
    const refreshTokenEncrypted = EncryptionService.encrypt(connection.refreshToken)

    const { error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: user.id,
        platform: connection.platform,
        platform_user_id: connection.platformUserId,
        access_token: JSON.stringify(accessTokenEncrypted),
        refresh_token: JSON.stringify(refreshTokenEncrypted),
        updated_at: new Date().toISOString(),
      })

    if (error) throw error
  }

  async getConnection(platform: 'youtube' | 'facebook') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Ingen användare inloggad')

    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .single()

    if (error) throw error
    if (!data) return null

    // Dekryptera tokens
    const accessTokenEncrypted: EncryptedTokens = JSON.parse(data.access_token)
    const refreshTokenEncrypted: EncryptedTokens = JSON.parse(data.refresh_token)

    return {
      ...data,
      access_token: EncryptionService.decrypt(
        accessTokenEncrypted.encryptedData,
        accessTokenEncrypted.iv,
        accessTokenEncrypted.authTag
      ),
      refresh_token: EncryptionService.decrypt(
        refreshTokenEncrypted.encryptedData,
        refreshTokenEncrypted.iv,
        refreshTokenEncrypted.authTag
      ),
    }
  }

  async deleteConnection(platform: 'youtube' | 'facebook') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Ingen användare inloggad')

    const { error } = await supabase
      .from('platform_connections')
      .delete()
      .eq('user_id', user.id)
      .eq('platform', platform)

    if (error) throw error
  }
}

export const platformService = new PlatformService() 