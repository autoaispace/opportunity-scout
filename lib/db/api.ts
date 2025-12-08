import { createClient } from '@/lib/supabase/server'
import type { Profile, DemandFree, DemandPro, SubscriptionStatus } from './types'

export class DatabaseAPI {
  /**
   * Get current user's profile
   */
  static async getProfile(): Promise<Profile | null> {
    try {
      const supabase = await createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        // Don't log JWT/session errors as they're expected for unauthenticated users
        if (!userError.message.includes('JWT') && !userError.message.includes('session')) {
          console.error('[DatabaseAPI] Get user error:', userError.message)
        }
        return null
      }
      
      if (!user) {
        return null
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        // Profile doesn't exist yet (PGRST116 = no rows returned)
        if (error.code === 'PGRST116') {
          console.log('[DatabaseAPI] Profile not found for user:', user.id)
          return null
        }
        console.error('[DatabaseAPI] Get profile error:', {
          userId: user.id,
          error: error.message,
          code: error.code,
        })
        return null
      }
      
      return data
    } catch (error) {
      console.error('[DatabaseAPI] Unexpected error getting profile:', error)
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
    try {
      const supabase = await createClient()
      
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: status,
          subscription_plan: plan,
          subscription_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
      
      if (error) {
        console.error('[DatabaseAPI] Update subscription error:', {
          userId,
          status,
          error: error.message,
          code: error.code,
        })
        throw error
      }
      
      console.log('[DatabaseAPI] Subscription updated successfully:', {
        userId,
        status,
        plan,
      })
    } catch (error) {
      console.error('[DatabaseAPI] Unexpected error updating subscription:', error)
      throw error
    }
  }

  /**
   * Track demand view
   */
  static async trackDemandView(demandId: string): Promise<void> {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Silently fail for unauthenticated users
        return
      }
      
      const { error } = await supabase
        .from('user_views')
        .insert({
          user_id: user.id,
          demand_id: demandId,
        })
        .select()
      
      // Ignore conflict errors (user already viewed this demand)
      if (error && error.code !== '23505') {
        console.error('[DatabaseAPI] Track view error:', {
          userId: user.id,
          demandId,
          error: error.message,
          code: error.code,
        })
      }
    } catch (error) {
      // Silently fail - view tracking is not critical
      console.error('[DatabaseAPI] Unexpected error tracking view:', error)
    }
  }
}

