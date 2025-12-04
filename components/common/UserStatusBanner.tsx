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
    checkUserStatus()

    window.addEventListener('user-upgraded', checkUserStatus)
    
    return () => {
      window.removeEventListener('user-upgraded', checkUserStatus)
    }
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="p-3 bg-text-dim/10 border border-text-dim/20 rounded-lg">
        <p className="text-sm text-text-body">
          💡 Tip: <a href="/login" className="text-accent-primary underline">Log in</a> to see more demands
        </p>
      </div>
    )
  }

  if (isPro) {
    return (
      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-sm text-green-400">
          🔥 <strong>Pro member</strong>: unlimited access
        </p>
      </div>
    )
  }

  return (
    <div className="p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-lg">
      <p className="text-sm text-accent-primary">
        🎭 Demo mode: currently browsing as a <strong>free user</strong> (can view 3 demands)
      </p>
    </div>
  )
}

