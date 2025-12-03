'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Home, Bookmark, Sparkles, Bell, User } from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'

export function BottomTabBar() {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const router = useRouter()
  const { isPro } = useSubscription()

  const tabs = [
    { id: 'feed', icon: Home, label: t('feed'), path: '/feed' },
    { id: 'saved', icon: Bookmark, label: t('saved'), path: '/saved' },
    { id: 'upgrade', icon: Sparkles, label: t('upgrade'), path: '/pricing', special: true },
    { id: 'notifications', icon: Bell, label: t('notifications'), path: '/notifications' },
    { id: 'profile', icon: User, label: t('profile'), path: '/profile' },
  ]

  const handleTabClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-sub-bg border-t border-glass-border md:hidden">
      <nav className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname.includes(tab.path)
          const isUpgradeTab = tab.special && !isPro

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.path)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full
                transition-colors relative
                ${isActive ? 'text-accent-primary' : 'text-text-dim hover:text-text-body'}
              `}
            >
              {/* Special styling for upgrade tab */}
              {isUpgradeTab ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-gold via-yellow-500 to-accent-gold rounded-full blur-md opacity-50" />
                  <div className="relative w-12 h-12 bg-gradient-to-r from-accent-gold via-yellow-500 to-accent-gold rounded-full flex items-center justify-center -mt-4">
                    <Icon className="w-6 h-6 text-core-bg" />
                  </div>
                </div>
              ) : (
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              )}
              
              <span className={`text-xs mt-1 ${isUpgradeTab ? 'mt-2' : ''}`}>
                {tab.label}
              </span>

              {/* Active indicator */}
              {isActive && !isUpgradeTab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

