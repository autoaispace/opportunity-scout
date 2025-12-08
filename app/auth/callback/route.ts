import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[Auth Callback] Exchange code error:', error.message)
        return NextResponse.redirect(`${origin}/login?error=auth_failed`)
      }
      
      if (data?.user) {
        // Check if profile exists, if not create it
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()
        
        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const provider = data.user.app_metadata.provider || 'google'
          const { error: insertError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email!,
            display_name: data.user.user_metadata.full_name || data.user.user_metadata.name,
            avatar_url: data.user.user_metadata.avatar_url || data.user.user_metadata.picture,
            provider: provider,
          })
          
          if (insertError) {
            console.error('[Auth Callback] Create profile error:', insertError.message)
          }
        } else if (profileError) {
          console.error('[Auth Callback] Profile query error:', profileError.message)
        }
      }
    }

    // Redirect to feed page after successful login
    return NextResponse.redirect(`${origin}/feed`)
  } catch (error) {
    console.error('[Auth Callback] Unexpected error:', error)
    const requestUrl = new URL(request.url)
    const origin = requestUrl.origin
    return NextResponse.redirect(`${origin}/login?error=unexpected`)
  }
}

