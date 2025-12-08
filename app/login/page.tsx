'use client'

import { Suspense, useEffect, useState } from 'react'
import { OAuthButtons } from '@/components/auth/OAuthButtons.simple'
import { Sparkles, Play, AlertCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    if (error) {
      const errorMessages: Record<string, string> = {
        auth_failed: 'Authentication failed. Please try again.',
        exchange_failed: 'Failed to complete authentication. Please try again.',
        no_code: 'No authorization code received.',
        no_user: 'User data not found. Please try again.',
        no_email: 'Email address is required. Please try a different account.',
        oauth_error: message || 'OAuth provider error occurred.',
        unexpected: message || 'An unexpected error occurred. Please try again.',
      }

      setErrorMessage(errorMessages[error] || 'An error occurred during login.')
    }
  }, [searchParams])

  const handleDemoLogin = () => {
    localStorage.setItem('demo_user', JSON.stringify({
      id: 'demo-user-123',
      email: 'demo@opportunityscout.ai',
      isPro: false,
      name: 'Demo User'
    }))
    
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
            Start exploring global opportunities
          </h1>
          
          <p className="text-text-body">
            Sign in using the options below
          </p>
        </div>

        {/* Demo Login Button */}
        <button
          onClick={handleDemoLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 mb-6 bg-gradient-to-r from-accent-main to-accent-bright text-bg-dark font-semibold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-accent-main/50"
        >
          <Play className="w-5 h-5" />
          Demo login (no setup required)
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-dim"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-core-bg text-text-dim">or continue with OAuth</span>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-error mb-1">Login Error</p>
              <p className="text-xs text-text-body">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="flex justify-center mb-6">
          <OAuthButtons />
        </div>

        <div className="text-xs text-text-dim text-center space-y-1 mb-8">
          <p>💡 Demo mode: no setup, experience instantly</p>
          <p>🔐 OAuth login: requires providers configured in Supabase</p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-text-dim">
            Opportunity Scout · AI-powered opportunity discovery platform
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-core-bg">
      <div className="w-full max-w-md text-center text-text-dim text-sm">
        Loading...
      </div>
    </div>
  )
}

