'use client'

import { Header } from './Header'
import { BottomTabBar } from './BottomTabBar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-8">
        {children}
      </main>

      <BottomTabBar />
    </div>
  )
}

