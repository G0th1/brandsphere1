import { supabase } from '@/lib/supabase';

export interface ContentSuggestion {
  id?: string;
  title: string;
  content: string;
  platform: 'facebook' | 'youtube';
  contentType: 'post' | 'video';
  createdAt?: string;
}

export interface ScheduledPost {
  id?: string;
  title: string;
  content: string;
  platform: 'facebook' | 'youtube';
  contentType: 'post' | 'video';
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'failed';
  createdAt?: string;
}

class ContentService {
  // Hämta alla innehållsförslag för den inloggade användaren
  async getContentSuggestions(): Promise<ContentSuggestion[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Ingen användare inloggad');

    const { data, error } = await supabase
      .from('content_suggestions_mvp')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fel vid hämtning av innehållsförslag:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      platform: item.platform,
      contentType: item.content_type,
      createdAt: item.created_at
    }));
  }

  // Skapa ett nytt innehållsförslag
  async createContentSuggestion(suggestion: ContentSuggestion): Promise<ContentSuggestion | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Ingen användare inloggad');

    const { data, error } = await supabase
      .from('content_suggestions_mvp')
      .insert({
        user_id: user.id,
        title: suggestion.title,
        content: suggestion.content,
        platform: suggestion.platform,
        content_type: suggestion.contentType,
      })
      .select()
      .single();

    if (error) {
      console.error('Fel vid skapande av innehållsförslag:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      platform: data.platform,
      contentType: data.content_type,
      createdAt: data.created_at
    };
  }

  // Schemalägg ett inlägg
  async schedulePost(post: ScheduledPost): Promise<ScheduledPost | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Ingen användare inloggad');

    const { data, error } = await supabase
      .from('scheduled_posts_mvp')
      .insert({
        user_id: user.id,
        title: post.title,
        content: post.content,
        platform: post.platform,
        content_type: post.contentType,
        scheduled_for: post.scheduledFor,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) {
      console.error('Fel vid schemaläggning av inlägg:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      platform: data.platform,
      contentType: data.content_type,
      scheduledFor: data.scheduled_for,
      status: data.status,
      createdAt: data.created_at
    };
  }

  // Hämta alla schemalagda inlägg för den inloggade användaren
  async getScheduledPosts(): Promise<ScheduledPost[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Ingen användare inloggad');

    const { data, error } = await supabase
      .from('scheduled_posts_mvp')
      .select('*')
      .eq('user_id', user.id)
      .order('scheduled_for', { ascending: true });

    if (error) {
      console.error('Fel vid hämtning av schemalagda inlägg:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      platform: item.platform,
      contentType: item.content_type,
      scheduledFor: item.scheduled_for,
      status: item.status,
      createdAt: item.created_at
    }));
  }
}

export const contentService = new ContentService(); 