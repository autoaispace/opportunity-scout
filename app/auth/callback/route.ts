import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { upsertUserProfile, extractUserMetadata } from '@/lib/actions/user'

/**
 * OAuth callback handler
 * Processes the OAuth callback from providers (Google, Apple)
 * 
 * Flow:
 * 1. Validate authorization code
 * 2. Exchange authorization code for session
 * 3. Extract user metadata from OAuth provider
 * 4. Create or update user profile
 * 5. Redirect to feed page
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const errorParam = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // Handle OAuth provider errors
  if (errorParam) {
    console.error('[Auth Callback] OAuth provider error:', {
      error: errorParam,
      description: errorDescription,
      url: requestUrl.toString(),
    })
    return NextResponse.redirect(
      `${origin}/login?error=oauth_error&message=${encodeURIComponent(errorDescription || errorParam)}`
    )
  }

  // Validate authorization code
  if (!code) {
    console.error('[Auth Callback] No authorization code provided', {
      url: requestUrl.toString(),
      searchParams: Object.fromEntries(requestUrl.searchParams),
    })
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const supabase = await createClient()
    
    console.log('[Auth Callback] Exchanging authorization code for session')
    
    // Exchange authorization code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[Auth Callback] Exchange code error:', {
        message: error.message,
        status: error.status,
        code: error.code,
      })
      return NextResponse.redirect(
        `${origin}/login?error=exchange_failed&message=${encodeURIComponent(error.message)}`
      )
    }

    if (!data?.user) {
      console.error('[Auth Callback] No user data returned from exchange', {
        hasSession: !!data?.session,
        hasUser: !!data?.user,
      })
      return NextResponse.redirect(`${origin}/login?error=no_user`)
    }

    if (!data?.session) {
      console.error('[Auth Callback] No session returned from exchange')
      return NextResponse.redirect(`${origin}/login?error=no_session`)
    }

    console.log('[Auth Callback] Session created successfully:', {
      userId: data.user.id,
      email: data.user.email,
      provider: data.user.app_metadata?.provider,
    })

    // Extract user metadata from OAuth provider
    const userMetadata = extractUserMetadata(data.user)

    // Validate required fields
    if (!userMetadata.email) {
      console.error('[Auth Callback] User email is missing', {
        userId: data.user.id,
        userMetadata: data.user.user_metadata,
      })
      return NextResponse.redirect(`${origin}/login?error=no_email`)
    }

    // Create or update user profile
    console.log('[Auth Callback] Creating/updating user profile:', {
      userId: data.user.id,
      email: userMetadata.email,
      provider: userMetadata.provider,
    })

    const profileResult = await upsertUserProfile(data.user.id, userMetadata)

    if (!profileResult.success) {
      console.error('[Auth Callback] Profile creation/update failed:', {
        userId: data.user.id,
        error: profileResult.error,
      })
      // Still redirect to feed, but log the error
      // Profile might be created later via database trigger or retry
    } else {
      console.log('[Auth Callback] User profile processed successfully:', {
        userId: data.user.id,
        email: userMetadata.email,
        provider: userMetadata.provider,
      })
    }

    // Redirect to feed page with success indicator
    console.log('[Auth Callback] Redirecting to feed page')
    return NextResponse.redirect(`${origin}/feed?login=success`)
  } catch (error) {
    console.error('[Auth Callback] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.redirect(
      `${origin}/login?error=unexpected&message=${encodeURIComponent(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      )}`
    )
  }
}

