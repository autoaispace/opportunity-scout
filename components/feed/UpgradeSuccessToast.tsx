'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

export function UpgradeSuccessToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      setShow(true)
      
      // 清除 URL 参数
      router.replace('/feed')
      
      // 3秒后自动关闭提示
      setTimeout(() => {
        setShow(false)
      }, 3000)
      
      // 触发全局刷新事件（让其他组件知道状态已更新）
      window.dispatchEvent(new Event('user-upgraded'))
    }
  }, [searchParams, router])

  if (!show) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
      <div className="bg-green-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6" />
        <div>
          <p className="font-semibold">升级成功！🎉</p>
          <p className="text-sm opacity-90">现在可以查看所有需求了</p>
        </div>
      </div>
    </div>
  )
}

