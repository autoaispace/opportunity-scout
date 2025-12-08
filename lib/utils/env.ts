/**
 * Environment variable validation and utilities
 */

interface EnvConfig {
  supabaseUrl: string
  supabaseAnonKey: string
  serviceRoleKey: string
  siteUrl: string
  useMockPayment: boolean
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate all required environment variables
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not set')
  } else if (!process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL must start with https://')
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  } else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length < 100) {
    warnings.push('NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short (should be ~200+ chars)')
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is not set')
  } else {
    // Service role key should be a long JWT token
    if (process.env.SUPABASE_SERVICE_ROLE_KEY.length < 100) {
      warnings.push(
        'SUPABASE_SERVICE_ROLE_KEY seems too short. It should be a JWT token from Supabase Dashboard (Settings → API → service_role key)'
      )
    }
    // Check if it looks like a custom value (not a JWT)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY.includes('.')) {
      warnings.push(
        'SUPABASE_SERVICE_ROLE_KEY does not look like a valid JWT. Please get the service_role key from Supabase Dashboard → Settings → API'
      )
    }
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    errors.push('NEXT_PUBLIC_SITE_URL is not set')
  } else if (!process.env.NEXT_PUBLIC_SITE_URL.startsWith('http')) {
    errors.push('NEXT_PUBLIC_SITE_URL must start with http:// or https://')
  }

  // Optional but recommended
  if (!process.env.NEXT_PUBLIC_USE_MOCK_PAYMENT) {
    warnings.push('NEXT_PUBLIC_USE_MOCK_PAYMENT is not set (defaults to false)')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Get validated environment configuration
 * Throws if required variables are missing
 */
export function getEnvConfig(): EnvConfig {
  const validation = validateEnv()
  
  if (!validation.valid) {
    const errorMessage = `Environment validation failed:\n${validation.errors.join('\n')}`
    console.error('[Env] Validation failed:', {
      errors: validation.errors,
      warnings: validation.warnings,
      nodeEnv: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    })
    throw new Error(errorMessage)
  }

  // Log warnings in development and production (for debugging)
  if (validation.warnings.length > 0) {
    console.warn('[Env] Environment warnings:', validation.warnings)
  }

  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
    useMockPayment: process.env.NEXT_PUBLIC_USE_MOCK_PAYMENT === 'true',
  }
}

/**
 * Check if environment is properly configured (non-throwing version)
 * Useful for client-side checks
 */
export function checkEnvIsConfigured(): boolean {
  try {
    getEnvConfig()
    return true
  } catch {
    return false
  }
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

