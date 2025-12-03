'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { PricingModal } from '@/components/subscription/PricingModal'
import { blurLock } from '@/lib/animations/variants'

interface LockedContentProps {
  field?: string
}

export function LockedContent({ field }: LockedContentProps) {
  const t = useTranslations('subscription')
  const [showPricing, setShowPricing] = useState(false)

  return (
    <>
      <motion.div
        className="relative rounded-modern overflow-hidden cursor-pointer"
        variants={blurLock}
        initial="locked"
        animate="locked"
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowPricing(true)}
      >
        {/* Blurred background */}
        <div className="absolute inset-0 backdrop-blur-md bg-glass-bg/80 z-10" />
        
        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <Lock className="w-8 h-8 text-accent-primary mb-2" />
          <p className="text-text-main font-semibold">
            {t('unlockFeature')}
          </p>
        </div>

        {/* Placeholder content */}
        <div className="p-6 min-h-[200px] bg-sub-bg">
          <div className="space-y-3">
            <div className="h-4 bg-text-dim/20 rounded w-3/4" />
            <div className="h-4 bg-text-dim/20 rounded w-full" />
            <div className="h-4 bg-text-dim/20 rounded w-2/3" />
          </div>
        </div>
      </motion.div>

      <PricingModal open={showPricing} onOpenChange={setShowPricing} />
    </>
  )
}

