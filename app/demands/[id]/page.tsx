import { notFound } from 'next/navigation'
import { DatabaseAPI } from '@/lib/db/api'
import { DemandDetailClient } from '@/components/demand/DemandDetailClient'
import { AppShell } from '@/components/layout/AppShell.simple'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface DemandPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DemandPage({ params }: DemandPageProps) {
  const { id } = await params

  // 获取需求详情（获取完整数据，权限控制在客户端）
  const demand = await DatabaseAPI.getDemandById(id, true)

  if (!demand) {
    notFound()
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          asChild
        >
          <Link href="/feed" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </Link>
        </Button>

        {/* 需求详情（客户端组件，会自动检测用户状态） */}
        <DemandDetailClient demand={demand} />
      </div>
    </AppShell>
  )
}

