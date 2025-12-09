import { NextResponse } from 'next/server'

/**
 * Simple test endpoint to check environment variables
 * This helps debug deployment issues
 */
export async function GET() {
  const envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'NOT SET',
    // Show partial keys for verification (first 10 chars)
    anonKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` 
      : 'NOT SET',
    serviceRoleKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...`
      : 'NOT SET',
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envCheck,
  })
}

