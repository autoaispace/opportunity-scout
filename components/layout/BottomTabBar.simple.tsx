'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Bookmark, Sparkles, Bell, User } from 'lucide-react'
import { useState } from 'react'
import { PricingModal } from '@/components/subscription/PricingModal.simple'

export function BottomTabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showPricing, setShowPricing] = useState(false)

  const tabs = [
    { id: 'feed', icon: Home, label: '发现', path: '/feed' },
    { id: 'saved', icon: Bookmark, label: '收藏', path: '/saved' },
    { id: 'upgrade', icon: Sparkles, label: '升级', path: '/pricing', special: true },
    { id: 'notifications', icon: Bell, label: '通知', path: '/notifications' },
    { id: 'profile', icon: User, label: '我的', path: '/profile' },
  ]

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.special) {
      setShowPricing(true)
    } else {
      router.push(tab.path)
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-sub-bg border-t border-glass-border md:hidden">
        <nav className="flex items-center justify-around h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.path
            const isUpgradeTab = tab.special

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`
                  flex flex-col items-center justify-center flex-1 h-full
                  transition-colors relative
                  ${isActive ? 'text-accent-primary' : 'text-text-dim hover:text-text-body'}
                `}
              >
                {/* 升级按钮特殊样式 */}
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

                {/* 活跃指示器 */}
                {isActive && !isUpgradeTab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <PricingModal open={showPricing} onOpenChange={setShowPricing} />
    </>
  )
}

