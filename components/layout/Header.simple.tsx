'use client'

import { Sparkles, User, LogOut } from 'lucide-react'
import { UpgradeButton } from '@/components/subscription/UpgradeButton.simple'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)

  const checkUserStatus = () => {
    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      setUser(JSON.parse(demoUser))
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    // 初始检查
    checkUserStatus()

    // 监听用户升级事件
    window.addEventListener('user-upgraded', checkUserStatus)

    // 点击外部关闭菜单
    const handleClickOutside = () => setShowMenu(false)
    if (showMenu) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      window.removeEventListener('user-upgraded', checkUserStatus)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showMenu])

  const handleLogout = () => {
    localStorage.removeItem('demo_user')
    setUser(null)
    setShowMenu(false)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-core-bg/95 backdrop-blur-sm border-b border-glass-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-primary" />
          </div>
          <span className="font-bold text-text-main hidden sm:inline">
            Opportunity Scout
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <UpgradeButton />
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-main/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent-primary" />
                </div>
                <span className="text-sm text-text-body hidden sm:inline">
                  {user.name}
                </span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-main border border-glass-border rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-glass-border">
                    <p className="text-sm font-medium text-text-main">{user.name}</p>
                    <p className="text-xs text-text-dim">{user.email}</p>
                    <p className="text-xs text-accent-primary mt-1">
                      {user.isPro ? '🔥 Pro 会员' : '免费版'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-text-body hover:bg-surface-dim transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login"
              className="text-text-body hover:text-text-main text-sm transition-colors"
            >
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

