import { notFound } from 'next/navigation'
import { DatabaseAPI } from '@/lib/db/api'
import { DemandDetailClient } from '@/components/demand/DemandDetailClient'
import { AppShell } from '@/components/layout/AppShell.simple'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AdBanner } from '@/components/common/AdBanner'

interface DemandPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DemandPage({ params }: DemandPageProps) {
  const { id } = await params

  const demand = await DatabaseAPI.getDemandById(id, true)

  if (!demand) {
    notFound()
  }

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          asChild
        >
          <Link href="/feed" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </Link>
        </Button>

        <DemandDetailClient demand={demand} />

        <div className="mt-8">
          <AdBanner slot="demandDetail" />
        </div>
      </div>
    </AppShell>
  )
}

