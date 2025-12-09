import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('[Subscription API] Failed to create Supabase client:', {
        error: clientError instanceof Error ? clientError.message : String(clientError),
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })
      return NextResponse.json(
        { 
          error: 'Database configuration error',
          details: process.env.NODE_ENV === 'development' 
            ? (clientError instanceof Error ? clientError.message : 'Failed to create Supabase client')
            : undefined
        },
        { status: 500 }
      )
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('[Subscription API] Get user error:', userError.message)
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan, subscription_expires_at')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('[Subscription API] Database query error:', {
        userId: user.id,
        error: error.message,
        code: error.code,
      })
      return NextResponse.json(
        { 
          error: 'Failed to fetch subscription data',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('[Subscription API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined
      },
      { status: 500 }
    )
  }
}

