'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { ActionResult, SignInParams } from './types'

function validateEnvVars(): string | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return 'NEXT_PUBLIC_SUPABASE_URL is not configured'
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured'
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    return 'NEXT_PUBLIC_SITE_URL is not configured'
  }
  return null
}

export async function signInWithOAuth(
  params: SignInParams
): Promise<ActionResult<{ url: string }>> {
  try {
    // Validate environment variables
    const envError = validateEnvVars()
    if (envError) {
      console.error('[Auth] Environment variable error:', envError)
      return { 
        success: false, 
        error: 'Server configuration error. Please contact support.' 
      }
    }

    const supabase = await createClient()
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
    const redirectTo = `${siteUrl}/auth/callback`
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: params.provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      console.error('[Auth] OAuth error:', error.message)
      return { success: false, error: error.message }
    }

    if (!data?.url) {
      console.error('[Auth] OAuth returned no URL')
      return { 
        success: false, 
        error: 'Failed to generate OAuth URL. Please try again.' 
      }
    }

    return { success: true, data: { url: data.url } }
  } catch (error) {
    console.error('[Auth] Unexpected error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function signOut(): Promise<ActionResult<void>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: error.message }
  }

  redirect('/login')
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

