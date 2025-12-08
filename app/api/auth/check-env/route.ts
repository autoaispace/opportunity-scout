import { NextResponse } from 'next/server'
import { validateEnv, checkEnvIsConfigured } from '@/lib/utils/env'

/**
 * Check environment configuration status
 * Useful for debugging deployment issues
 */
export async function GET() {
  const isConfigured = checkEnvIsConfigured()
  const validation = validateEnv()

  // In production, don't expose sensitive details
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      configured: isConfigured,
      valid: validation.valid,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
    })
  }

  // In development, show detailed information
  return NextResponse.json({
    configured: isConfigured,
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

