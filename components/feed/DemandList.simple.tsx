'use client'

import { DemandCard } from './DemandCard.simple'
import { LockedContent } from '@/components/demand/LockedContent.simple'
import type { DemandFree } from '@/lib/db/types'

interface DemandListProps {
  demands: DemandFree[]
  isPro: boolean
}

export function DemandList({ demands, isPro }: DemandListProps) {
  if (demands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-text-main mb-2">暂无商机</h3>
        <p className="text-text-body text-center max-w-sm">稍后再来看看</p>
      </div>
    )
  }

  // 免费用户只显示前 3 条
  const visibleDemands = isPro ? demands : demands.slice(0, 3)
  const hasLockedContent = !isPro && demands.length > 3

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:gap-6">
        {visibleDemands.map((demand, index) => (
          <DemandCard key={demand.id} demand={demand} index={index} />
        ))}
      </div>

      {/* 锁定内容提示 */}
      {hasLockedContent && (
        <div className="mt-6">
          <LockedContent />
        </div>
      )}
    </div>
  )
}

