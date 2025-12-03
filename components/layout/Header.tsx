'use client'

import { Sparkles } from 'lucide-react'
import { UpgradeButton } from '@/components/subscription/UpgradeButton'
import { ProBadge } from '@/components/subscription/ProBadge'
import { useSubscription } from '@/hooks/useSubscription'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Header() {
  const { isPro } = useSubscription()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full bg-core-bg/95 backdrop-blur-sm border-b border-glass-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-primary" />
          </div>
          <span className="font-bold text-text-main hidden sm:inline">
            Opportunity Scout
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {isPro ? (
            <ProBadge />
          ) : (
            <div className="hidden md:block">
              <UpgradeButton />
            </div>
          )}

          {/* User Avatar */}
          {user && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-accent-primary/10 text-accent-primary">
                {user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  )
}

