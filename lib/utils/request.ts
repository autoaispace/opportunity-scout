import { headers } from 'next/headers'

/**
 * Get the origin URL from the current request
 * Useful for determining callback URLs dynamically
 */
export async function getRequestOrigin(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  
  if (!host) {
    // Fallback to environment variable
    const env = process.env.NEXT_PUBLIC_SITE_URL
    if (env) {
      return env
    }
    throw new Error('Cannot determine request origin')
  }
  
  return `${protocol}://${host}`
}

/**
 * Get the callback URL for OAuth
 */
export async function getCallbackUrl(): Promise<string> {
  const origin = await getRequestOrigin()
  return `${origin}/auth/callback`
}

