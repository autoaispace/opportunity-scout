'use client'

import { OAuthButtons } from '@/components/auth/OAuthButtons.simple'
import { Sparkles, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleDemoLogin = () => {
    // 设置演示模式
    localStorage.setItem('demo_user', JSON.stringify({
      id: 'demo-user-123',
      email: 'demo@opportunityscout.ai',
      isPro: false,
      name: '演示用户'
    }))
    
    // 跳转到 Feed
    router.push('/feed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-core-bg">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-modern bg-accent-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-accent-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-text-main mb-3">
            开始探索全球商机
          </h1>
          
          <p className="text-text-body">
            使用以下方式快速登录
          </p>
        </div>

        {/* Demo Login Button */}
        <button
          onClick={handleDemoLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 mb-6 bg-gradient-to-r from-accent-main to-accent-bright text-bg-dark font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-accent-main/50"
        >
          <Play className="w-5 h-5" />
          演示模式登录（免配置）
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-dim"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-core-bg text-text-dim">或使用 OAuth</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex justify-center mb-6">
          <OAuthButtons />
        </div>

        <div className="text-xs text-text-dim text-center space-y-1 mb-8">
          <p>💡 演示模式：无需配置，直接体验</p>
          <p>🔐 OAuth 登录：需在 Supabase 中配置提供商</p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-text-dim">
            Opportunity Scout · AI 驱动的商机发现平台
          </p>
        </div>
      </div>
    </div>
  )
}

