'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles } from 'lucide-react'
import { getPaymentProvider, type PlanId } from '@/lib/payment'
import { useRouter } from 'next/navigation'

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PLANS: Array<{
  id: PlanId
  name: string
  price: string
  features: string[]
  isBestValue?: boolean
}> = [
  { 
    id: 'monthly',
    name: '月付',
    price: '¥99 / 月',
    features: ['无限查看所有需求', '完整竞品与 ROI 分析', '每日精选推送']
  },
  { 
    id: 'yearly',
    name: '年付',
    price: '¥999 / 年',
    features: ['无限查看所有需求', '完整竞品与 ROI 分析', '每日精选推送', '节省 ¥189'],
    isBestValue: true
  },
  { 
    id: 'lifetime',
    name: '终身',
    price: '¥1999 / 终身',
    features: ['无限查看所有需求', '完整竞品与 ROI 分析', '每日精选推送', '一次付费永久使用']
  },
]

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const [loading, setLoading] = useState<PlanId | null>(null)
  const router = useRouter()

  const handleSelectPlan = async (planId: PlanId) => {
    setLoading(planId)
    
    try {
      const provider = getPaymentProvider()
      const session = await provider.createCheckoutSession(
        planId,
        'demo_user',
        `${window.location.origin}/checkout/success`,
        `${window.location.origin}/checkout/cancel`
      )
      
      // 跳转到 Mock 支付页面
      router.push(session.url)
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] bg-sub-bg border-glass-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent-gold" />
            升级到 Pro
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-modern border ${
                plan.isBestValue 
                  ? 'border-accent-gold bg-accent-gold/5 animate-breathe' 
                  : 'border-glass-border bg-glass-bg'
              }`}
            >
              {plan.isBestValue && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent-gold text-core-bg font-bold">
                  最超值
                </Badge>
              )}

              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-text-main mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-accent-primary">
                  {plan.price}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-body">
                    <Check className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading !== null}
                variant={plan.isBestValue ? 'default' : 'outline'}
              >
                {loading === plan.id ? '处理中...' : '立即升级'}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

