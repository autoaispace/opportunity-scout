'use client'

import { Suspense } from 'react'
import { Header } from './Header.simple'
import { BottomTabBar } from './BottomTabBar.simple'
import { UpgradeSuccessToast } from '@/components/feed/UpgradeSuccessToast'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-core-bg">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-8">
        {children}
      </main>

      <BottomTabBar />

      {/* 升级成功提示 */}
      <Suspense fallback={null}>
        <UpgradeSuccessToast />
      </Suspense>
    </div>
  )
}

