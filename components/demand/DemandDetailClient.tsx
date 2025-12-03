'use client'

import { useEffect, useState } from 'react'
import { DemandDetail } from './DemandDetail.simple'
import type { Demand } from '@/lib/db/types'

interface DemandDetailClientProps {
  demand: Demand
}

export function DemandDetailClient({ demand }: DemandDetailClientProps) {
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

  return <DemandDetail demand={demand} isPro={isPro} />
}

