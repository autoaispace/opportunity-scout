'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getEnvConfig } from '@/lib/utils/env'
import type { ActionResult, SignInParams } from './types'

/**
 * Sign in with OAuth provider (Google or Apple)
 * Returns the OAuth URL for redirection
 */
export async function signInWithOAuth(
  params: SignInParams
): Promise<ActionResult<{ url: string }>> {
  try {
    // Validate environment variables with better error handling
    let env
    try {
      env = getEnvConfig()
    } catch (envError) {
      console.error('[Auth] Environment validation failed:', envError)
      return {
        success: false,
        error: `Server configuration error: ${envError instanceof Error ? envError.message : 'Missing required environment variables'}. Please contact support.`,
      }
    }

    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('[Auth] Failed to create Supabase client:', clientError)
      return {
        success: false,
        error: `Database connection error: ${clientError instanceof Error ? clientError.message : 'Failed to connect to database'}. Please try again later.`,
      }
    }
    
    // Build redirect URL - use provided redirectTo or determine from request
    // In server actions, we need to use the configured site URL
    // The callback will handle redirecting to the correct origin
    const redirectTo = params.redirectTo || `${env.siteUrl}/auth/callback`
    
    console.log('[Auth] OAuth redirect configuration:', {
      providedRedirectTo: params.redirectTo,
      finalRedirectTo: redirectTo,
      siteUrl: env.siteUrl,
    })
    
    // Validate provider
    if (!['google', 'apple'].includes(params.provider)) {
      return {
        success: false,
        error: `Invalid provider: ${params.provider}. Must be 'google' or 'apple'.`,
      }
    }
    
    console.log('[Auth] Initiating OAuth login:', {
      provider: params.provider,
      redirectTo,
    })
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: params.provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('[Auth] OAuth error:', {
        provider: params.provider,
        message: error.message,
        status: error.status,
      })
      return { 
        success: false, 
        error: `OAuth login failed: ${error.message}` 
      }
    }

    if (!data?.url) {
      console.error('[Auth] OAuth returned no URL', {
        provider: params.provider,
        data,
      })
      return { 
        success: false, 
        error: 'Failed to generate OAuth URL. Please try again.' 
      }
    }

    console.log('[Auth] OAuth URL generated successfully:', {
      provider: params.provider,
      urlLength: data.url.length,
    })

    return { success: true, data: { url: data.url } }
  } catch (error) {
    console.error('[Auth] Unexpected error during OAuth:', {
      provider: params.provider,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('[Auth] Sign out error:', error.message)
      return { success: false, error: error.message }
    }

    console.log('[Auth] User signed out successfully')
    redirect('/login')
  } catch (error) {
    console.error('[Auth] Unexpected error during sign out:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign out',
    }
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('[Auth] Get session error:', error.message)
      return null
    }
    
    return session
  } catch (error) {
    console.error('[Auth] Unexpected error getting session:', error)
    return null
  }
}

/**
 * Get current authenticated user
 * Automatically refreshes the session if needed
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      // Don't log 401 errors (user not authenticated) as errors
      if (error.message.includes('JWT') || error.message.includes('session')) {
        console.log('[Auth] No active session')
      } else {
        console.error('[Auth] Get user error:', error.message)
      }
      return null
    }

    return user
  } catch (error) {
    console.error('[Auth] Unexpected error getting user:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    return !!user
  } catch {
    return false
  }
}

/**
 * Refresh the current session
 */
export async function refreshSession(): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.refreshSession()

    if (error) {
      console.error('[Auth] Refresh session error:', error.message)
      return { success: false, error: error.message }
    }

    if (!session) {
      return { success: false, error: 'No session to refresh' }
    }

    return { success: true, data: undefined }
  } catch (error) {
    console.error('[Auth] Unexpected error refreshing session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh session',
    }
  }
}

