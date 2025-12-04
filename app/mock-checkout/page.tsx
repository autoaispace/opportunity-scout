'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2, CreditCard } from 'lucide-react'

export default function MockCheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const plan = searchParams.get('plan') as 'monthly' | 'yearly' | 'lifetime'
  const [processing, setProcessing] = useState(false)

  const planNames: Record<string, string> = {
    monthly: 'Monthly plan',
    yearly: 'Yearly plan',
    lifetime: 'Lifetime plan',
  }

  const planPrices: Record<string, string> = {
    monthly: '¥99 / month',
    yearly: '¥999 / year',
    lifetime: '¥1999 / lifetime',
  }

  const handlePayment = async () => {
    setProcessing(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('💳 [Mock Payment] Payment successful', { plan })
    
    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      const user = JSON.parse(demoUser)
      user.isPro = true
      user.plan = plan
      localStorage.setItem('demo_user', JSON.stringify(user))
    }
    
    router.push('/feed?upgraded=true')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-core-bg">
      <Card className="w-full max-w-md bg-sub-bg border-glass-border">
        <CardHeader>
          <CardTitle className="text-2xl text-text-main flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Mock payment
          </CardTitle>
          <CardDescription className="text-text-body">
            This is a demo checkout flow. No real charges will be made.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-glass-bg border border-glass-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-body">Selected plan</span>
              <span className="text-text-main font-semibold">
                {planNames[plan] || plan}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">Price</span>
              <span className="text-2xl font-bold text-accent-primary">
                {planPrices[plan] || plan}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-text-dim">After upgrading you will get:</p>
            {[
              'Unlimited access to all demands',
              'Full competitor & ROI analysis',
              'Daily curated digest',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-text-body">
                <Check className="w-4 h-4 text-accent-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Complete payment (demo)'
            )}
          </Button>

          <p className="text-xs text-text-dim text-center">
            🎭 Demo mode: clicking the button will immediately upgrade you to Pro
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

