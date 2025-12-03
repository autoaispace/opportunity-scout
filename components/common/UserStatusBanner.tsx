'use client'

import { useEffect, useState } from 'react'

export function UserStatusBanner() {
  const [isPro, setIsPro] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkUserStatus = () => {
    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      const user = JSON.parse(demoUser)
      setIsLoggedIn(true)
      setIsPro(user.isPro || false)
    } else {
      setIsLoggedIn(false)
      setIsPro(false)
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

  if (!isLoggedIn) {
    return (
      <div className="p-3 bg-text-dim/10 border border-text-dim/20 rounded-lg">
        <p className="text-sm text-text-body">
          💡 提示：<a href="/login" className="text-accent-primary underline">登录</a>后可查看更多需求
        </p>
      </div>
    )
  }

  if (isPro) {
    return (
      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-sm text-green-400">
          🔥 <strong>Pro 会员</strong>：享受无限访问权限
        </p>
      </div>
    )
  }

  return (
    <div className="p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
      <p className="text-sm text-accent-primary">
        🎭 演示模式：当前以<strong>免费用户</strong>身份浏览（可查看 3 条需求）
      </p>
    </div>
  )
}

