'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Profile } from '@/lib/db/types'

/**
 * Create or update user profile after OAuth login
 * This function handles both new user creation and existing user updates
 * Uses admin client to bypass RLS policies
 */
export async function upsertUserProfile(
  userId: string,
  userData: {
    email: string
    display_name?: string | null
    avatar_url?: string | null
    provider: 'google' | 'apple'
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use admin client to bypass RLS for profile creation/update
    const admin = createAdminClient()
    
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await admin
      .from('profiles')
      .select('id, email, display_name, avatar_url, provider, subscription_status')
      .eq('id', userId)
      .maybeSingle()

    // Handle fetch errors (except "not found")
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[User] Error checking existing profile:', fetchError)
      return { success: false, error: fetchError.message }
    }

    const now = new Date().toISOString()

    if (existingProfile) {
      // Update existing profile
      // Only update fields that might have changed from OAuth provider
      const updateData: Partial<Profile> = {
        email: userData.email,
        updated_at: now,
      }

      // Update display_name if provided and different
      if (userData.display_name !== undefined) {
        updateData.display_name = userData.display_name || existingProfile.display_name
      }

      // Update avatar_url if provided and different
      if (userData.avatar_url !== undefined) {
        updateData.avatar_url = userData.avatar_url || existingProfile.avatar_url
      }

      // Update provider if different
      if (userData.provider !== existingProfile.provider) {
        updateData.provider = userData.provider
      }

      console.log('[User] Updating existing profile:', {
        userId,
        fields: Object.keys(updateData),
      })

      const { error } = await admin
        .from('profiles')
        .update(updateData)
        .eq('id', userId)

      if (error) {
        console.error('[User] Update profile error:', {
          userId,
          error: error.message,
          code: error.code,
        })
        return { success: false, error: error.message }
      }

      console.log('[User] Profile updated successfully:', { userId })
      return { success: true }
    } else {
      // Create new profile
      const newProfile: Omit<Profile, 'created_at' | 'updated_at'> & {
        created_at: string
        updated_at: string
      } = {
        id: userId,
        email: userData.email,
        display_name: userData.display_name || null,
        avatar_url: userData.avatar_url || null,
        provider: userData.provider,
        subscription_status: 'free',
        subscription_plan: null,
        subscription_expires_at: null,
        locale: 'zh-CN',
        notification_enabled: false,
        created_at: now,
        updated_at: now,
      }

      console.log('[User] Creating new profile:', {
        userId,
        email: userData.email,
        provider: userData.provider,
      })

      const { error } = await admin.from('profiles').insert(newProfile)

      if (error) {
        console.error('[User] Create profile error:', {
          userId,
          error: error.message,
          code: error.code,
          details: error.details,
        })
        
        // Handle duplicate key error (race condition)
        if (error.code === '23505') {
          console.log('[User] Profile already exists (race condition), retrying update')
          // Retry as update
          return upsertUserProfile(userId, userData)
        }
        
        return { success: false, error: error.message }
      }

      console.log('[User] Profile created successfully:', { userId })
      return { success: true }
    }
  } catch (error) {
    console.error('[User] Unexpected error in upsertUserProfile:', {
      userId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create/update profile',
    }
  }
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist yet
        return null
      }
      console.error('[User] Get profile error:', error)
      return null
    }

    return profile
  } catch (error) {
    console.error('[User] Unexpected error:', error)
    return null
  }
}

/**
 * Extract user metadata from OAuth provider response
 */
export async function extractUserMetadata(user: {
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}): {
  email: string
  display_name: string | null
  avatar_url: string | null
  provider: 'google' | 'apple'
} {
  const provider = (user.app_metadata?.provider as 'google' | 'apple') || 'google'
  
  // Extract name from different possible fields
  const displayName =
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    (user.user_metadata?.display_name as string) ||
    null

  // Extract avatar from different possible fields
  const avatarUrl =
    (user.user_metadata?.avatar_url as string) ||
    (user.user_metadata?.picture as string) ||
    (user.user_metadata?.photo_url as string) ||
    null

  return {
    email: user.email || '',
    display_name: displayName,
    avatar_url: avatarUrl,
    provider,
  }
}

