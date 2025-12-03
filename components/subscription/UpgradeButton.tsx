'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { PricingModal } from './PricingModal'

export function UpgradeButton() {
  const t = useTranslations('subscription')
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-accent-gold via-yellow-500 to-accent-gold text-core-bg font-semibold hover:shadow-glow-gold"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {t('upgradeNow')}
      </Button>

      <PricingModal open={open} onOpenChange={setOpen} />
    </>
  )
}

