import { NextResponse } from 'next/server'
import { validateEnv } from '@/lib/utils/env'

/**
 * Health check endpoint that validates environment configuration
 * Useful for debugging deployment issues
 */
export async function GET() {
  const validation = validateEnv()

  // In production, don't expose detailed errors
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      status: validation.valid ? 'ok' : 'error',
      message: validation.valid
        ? 'Environment configured correctly'
        : 'Environment configuration has errors',
    })
  }

  // In development, show detailed information
  return NextResponse.json({
    status: validation.valid ? 'ok' : 'error',
    valid: validation.valid,
    errors: validation.errors,
    warnings: validation.warnings,
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      nodeEnv: process.env.NODE_ENV,
    },
  })
}

