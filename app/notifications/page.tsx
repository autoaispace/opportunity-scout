import { AppShell } from '@/components/layout/AppShell.simple'
import { Bell } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-20">
          <Bell className="w-16 h-16 text-text-dim mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-main mb-2">通知中心</h2>
          <p className="text-text-body">Pro 用户专属功能</p>
        </div>
      </div>
    </AppShell>
  )
}

