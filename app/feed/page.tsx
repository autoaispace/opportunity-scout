import { Sparkles } from 'lucide-react'
import { DatabaseAPI } from '@/lib/db/api'
import { DemandListClient } from '@/components/feed/DemandListClient'
import { AppShell } from '@/components/layout/AppShell.simple'
import { UserStatusBanner } from '@/components/common/UserStatusBanner'

export default async function FeedPage() {
  // 从数据库获取需求数据（获取所有数据，权限控制在客户端）
  const demands = await DatabaseAPI.getDemandsFeed(20, true)

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-accent-primary" />
            <h1 className="text-3xl font-bold">
              商机情报站
            </h1>
          </div>
          <p className="text-text-body">
            AI 每日挖掘的高价值需求
          </p>
          
          {/* 用户状态横幅 */}
          <div className="mt-4">
            <UserStatusBanner />
          </div>
        </div>

        {/* 需求列表（客户端组件，会自动检测用户状态） */}
        <DemandListClient demands={demands} />
      </div>
    </AppShell>
  )
}

