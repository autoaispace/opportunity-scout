import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if profile exists, if not create it
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()
      
      if (!profile) {
        // Create profile for new user
        const provider = data.user.app_metadata.provider || 'google'
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.user_metadata.full_name || data.user.user_metadata.name,
          avatar_url: data.user.user_metadata.avatar_url || data.user.user_metadata.picture,
          provider: provider,
        })
      }
    }
  }

  // Redirect to feed page after successful login
  return NextResponse.redirect(`${origin}/feed`)
}

