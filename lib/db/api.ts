import { createClient } from '@/lib/supabase/server'
import type { Profile, DemandFree, DemandPro, SubscriptionStatus } from './types'

export class DatabaseAPI {
  /**
   * Get current user's profile
   */
  static async getProfile(): Promise<Profile | null> {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      // 演示模式：如果获取失败，返回 null（不登录）
      console.log('No user logged in (demo mode)')
      return null
    }
  }

  /**
   * Get demands feed with access control
   * @param limit - Number of items to fetch
   * @param isPro - Whether user has Pro access
   */
  static async getDemandsFeed(
    limit: number = 10,
    isPro: boolean = false
  ): Promise<(DemandFree | DemandPro)[]> {
    try {
      const supabase = await createClient()

      if (isPro) {
        const { data, error } = await supabase
          .from('demands')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)
          .returns<DemandPro[]>()

        if (error) {
          console.error('Error fetching demands:', error)
          return []
        }
        return data ?? []
      }

      const { data, error } = await supabase
        .from('demands')
        .select('id, title, summary, pain_score, source_url, created_at, tags')
        .order('created_at', { ascending: false })
        .limit(limit)
        .returns<DemandFree[]>()

      if (error) {
        console.error('Error fetching demands:', error)
        return []
      }
      return data ?? []
    } catch (error) {
      console.error('Failed to fetch demands:', error)
      return []
    }
  }

  /**
   * Get single demand by ID
   */
  static async getDemandById(
    id: string,
    isPro: boolean = false
  ): Promise<DemandFree | DemandPro | null> {
    try {
      const supabase = await createClient()

      if (isPro) {
        const { data, error } = await supabase
          .from('demands')
          .select('*')
          .eq('id', id)
          .returns<DemandPro>()
          .single()

        if (error) {
          console.error('Error fetching demand:', error)
          return null
        }
        return data
      }

      const { data, error } = await supabase
        .from('demands')
        .select('id, title, summary, pain_score, source_url, created_at, tags')
        .eq('id', id)
        .returns<DemandFree>()
        .single()

      if (error) {
        console.error('Error fetching demand:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Failed to fetch demand:', error)
      return null
    }
  }

  /**
   * Update user subscription status
   */
  static async updateSubscription(
    userId: string,
    status: SubscriptionStatus,
    plan: string | null = null,
    expiresAt: string | null = null
  ): Promise<void> {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: status,
        subscription_plan: plan,
        subscription_expires_at: expiresAt,
      })
      .eq('id', userId)
    
    if (error) throw error
  }

  /**
   * Track demand view
   */
  static async trackDemandView(demandId: string): Promise<void> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return
    
    await supabase
      .from('user_views')
      .insert({
        user_id: user.id,
        demand_id: demandId,
      })
      .select()
      // Ignore conflict (already viewed)
  }
}

