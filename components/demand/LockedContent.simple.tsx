'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { PricingModal } from '@/components/subscription/PricingModal.simple'

interface LockedContentProps {
  children?: ReactNode
}

export function LockedContent({ children }: LockedContentProps) {
  const [showPricing, setShowPricing] = useState(false)
  const [isPro, setIsPro] = useState(false)

  const checkUserStatus = () => {
    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      const user = JSON.parse(demoUser)
      setIsPro(user.isPro || false)
    }
  }

  useEffect(() => {
    // 初始检查
    checkUserStatus()

    // 监听用户升级事件
    window.addEventListener('user-upgraded', checkUserStatus)
    
    return () => {
      window.removeEventListener('user-upgraded', checkUserStatus)
    }
  }, [])

  // 如果是 Pro 用户，直接显示内容
  if (isPro && children) {
    return <>{children}</>
  }

  return (
    <>
      <div 
        className="relative rounded-modern overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => setShowPricing(true)}
      >
        {/* 模糊背景 */}
        <div className="absolute inset-0 backdrop-blur-md bg-glass-bg/80 z-10" />
        
        {/* 锁定提示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <Lock className="w-8 h-8 text-accent-primary mb-2" />
          <p className="text-text-main font-semibold">
            🔒 升级解锁更多内容
          </p>
          <p className="text-text-body text-sm mt-2">
            升级 Pro 查看全部需求
          </p>
        </div>

        {/* 占位内容或实际内容 */}
        {children ? (
          <div className="relative">{children}</div>
        ) : (
          <div className="p-6 min-h-[200px] bg-sub-bg">
            <div className="space-y-3">
              <div className="h-4 bg-text-dim/20 rounded w-3/4" />
              <div className="h-4 bg-text-dim/20 rounded w-full" />
              <div className="h-4 bg-text-dim/20 rounded w-2/3" />
            </div>
          </div>
        )}
      </div>

      <PricingModal open={showPricing} onOpenChange={setShowPricing} />
    </>
  )
}

