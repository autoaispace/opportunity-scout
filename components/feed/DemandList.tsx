'use client'

import { motion } from 'framer-motion'
import { DemandCard } from './DemandCard'
import { LockedContent } from '@/components/demand/LockedContent'
import { EmptyState } from './EmptyState'
import { staggerContainer } from '@/lib/animations/variants'
import type { DemandFree } from '@/lib/db/types'

interface DemandListProps {
  demands: DemandFree[]
  isPro: boolean
}

export function DemandList({ demands, isPro }: DemandListProps) {
  if (demands.length === 0) {
    return <EmptyState />
  }

  // For free users, show only first 3 demands
  const visibleDemands = isPro ? demands : demands.slice(0, 3)
  const hasLockedContent = !isPro && demands.length > 3

  return (
    <div className="space-y-6">
      <motion.div
        className="grid gap-4 md:gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {visibleDemands.map((demand, index) => (
          <DemandCard key={demand.id} demand={demand} index={index} />
        ))}
      </motion.div>

      {/* Locked content overlay for free users */}
      {hasLockedContent && (
        <div className="mt-6">
          <LockedContent />
        </div>
      )}
    </div>
  )
}

