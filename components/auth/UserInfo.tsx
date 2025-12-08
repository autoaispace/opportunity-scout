'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, User as UserIcon } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'

interface UserInfoProps {
  showMenu?: boolean
}

export function UserInfo({ showMenu = true }: UserInfoProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{
    display_name: string | null
    avatar_url: string | null
    subscription_status: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, subscription_status')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('[UserInfo] Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('[UserInfo] Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-surface-dim animate-pulse" />
        <span className="text-sm text-text-dim">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName =
    profile?.display_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User'

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture

  return (
    <div className="flex items-center gap-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="bg-accent-primary/10 text-accent-primary">
          {displayName[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {showMenu && (
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-text-main">{displayName}</p>
          <p className="text-xs text-text-dim">{user.email}</p>
        </div>
      )}

      {showMenu && (
        <button
          onClick={handleSignOut}
          className="p-2 rounded-lg hover:bg-surface-dim transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 text-text-dim" />
        </button>
      )}
    </div>
  )
}

