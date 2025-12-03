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
    monthly: '月付方案',
    yearly: '年付方案',
    lifetime: '终身方案'
  }

  const planPrices: Record<string, string> = {
    monthly: '¥99 / 月',
    yearly: '¥999 / 年',
    lifetime: '¥1999 / 终身'
  }

  const handlePayment = async () => {
    setProcessing(true)
    
    // 模拟支付处理（1.5秒）
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 演示模式：直接标记为支付成功
    console.log('💳 [Mock Payment] 支付成功', { plan })
    
    // 更新用户为 Pro 会员
    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      const user = JSON.parse(demoUser)
      user.isPro = true
      user.plan = plan
      localStorage.setItem('demo_user', JSON.stringify(user))
    }
    
    // 跳转回 Feed 页面
    router.push('/feed?upgraded=true')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-core-bg">
      <Card className="w-full max-w-md bg-sub-bg border-glass-border">
        <CardHeader>
          <CardTitle className="text-2xl text-text-main flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            模拟支付
          </CardTitle>
          <CardDescription className="text-text-body">
            这是一个演示支付流程，不会进行真实扣款
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 方案详情 */}
          <div className="p-4 rounded-lg bg-glass-bg border border-glass-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-body">选择方案</span>
              <span className="text-text-main font-semibold">
                {planNames[plan] || plan}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-body">价格</span>
              <span className="text-2xl font-bold text-accent-primary">
                {planPrices[plan] || plan}
              </span>
            </div>
          </div>

          {/* 功能列表 */}
          <div className="space-y-2">
            <p className="text-sm text-text-dim">升级后您将获得：</p>
            {['无限查看所有需求', '完整竞品与 ROI 分析', '每日精选推送'].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-text-body">
                <Check className="w-4 h-4 text-accent-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* 支付按钮 */}
          <Button
            className="w-full"
            size="lg"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              '完成支付（演示）'
            )}
          </Button>

          <p className="text-xs text-text-dim text-center">
            🎭 这是演示模式，点击按钮将直接升级为 Pro 用户
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

