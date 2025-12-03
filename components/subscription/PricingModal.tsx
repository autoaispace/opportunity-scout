'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles } from 'lucide-react'
import { getPaymentProvider, type PlanId } from '@/lib/payment'
import { breatheGlow } from '@/lib/animations/variants'

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PLANS: Array<{
  id: PlanId
  isBestValue?: boolean
}> = [
  { id: 'monthly' },
  { id: 'yearly', isBestValue: true },
  { id: 'lifetime' },
]

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const t = useTranslations('subscription')
  const [loading, setLoading] = useState<PlanId | null>(null)

  const handleSelectPlan = async (planId: PlanId) => {
    setLoading(planId)
    
    try {
      const provider = getPaymentProvider()
      const session = await provider.createCheckoutSession(
        planId,
        'current_user_id', // TODO: Get from auth context
        `${window.location.origin}/checkout/success`,
        `${window.location.origin}/checkout/cancel`
      )
      
      // Redirect to checkout (or mock checkout)
      window.location.href = session.url
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-sub-bg border-glass-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-gold" />
            {t('upgradeNow')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              className="relative p-6 rounded-modern border border-glass-border bg-glass-bg"
              whileHover={{ scale: 1.02 }}
              variants={plan.isBestValue ? breatheGlow : undefined}
              animate={plan.isBestValue ? 'animate' : undefined}
            >
              {plan.isBestValue && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent-gold text-core-bg">
                  {t('pricing.bestValue')}
                </Badge>
              )}

              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-text-main mb-2">
                  {t(`${plan.id}Plan`)}
                </h3>
                <div className="text-3xl font-bold text-accent-primary">
                  {t(`pricing.${plan.id}`)}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {['unlimitedView', 'fullAnalysis', 'dailyDigest'].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-body">
                    <Check className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                    <span>{t(`features.${feature}`)}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading !== null}
                variant={plan.isBestValue ? 'default' : 'outline'}
              >
                {loading === plan.id ? t('common.loading') : t('upgradeNow')}
              </Button>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

