import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Update Supabase session in middleware
 * This ensures the session is refreshed on every request
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Middleware] Missing Supabase environment variables')
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  try {
    // Refresh the auth token
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error && !error.message.includes('JWT')) {
      // Log non-JWT errors (JWT errors are expected for unauthenticated users)
      console.error('[Middleware] Error refreshing session:', error.message)
    }

    // Optionally log successful session refresh in development
    if (process.env.NODE_ENV === 'development' && user) {
      console.log('[Middleware] Session refreshed:', {
        userId: user.id,
        email: user.email,
      })
    }
  } catch (error) {
    console.error('[Middleware] Unexpected error refreshing session:', error)
  }

  return supabaseResponse
}

