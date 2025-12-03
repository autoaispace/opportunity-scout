'use client'

import { useEffect, useState } from 'react'
import { DemandList } from './DemandList.simple'
import type { Demand } from '@/lib/db/types'

interface DemandListClientProps {
  demands: Demand[]
}

export function DemandListClient({ demands }: DemandListClientProps) {
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

  return <DemandList demands={demands} isPro={isPro} />
}

