import { Sparkles } from 'lucide-react'
import { DatabaseAPI } from '@/lib/db/api'
import { DemandListClient } from '@/components/feed/DemandListClient'
import { AppShell } from '@/components/layout/AppShell.simple'
import { UserStatusBanner } from '@/components/common/UserStatusBanner'

// Feed depends on cookies/session; disable static prerendering
export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const demands = await DatabaseAPI.getDemandsFeed(20, true)

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-accent-primary" />
            <h1 className="text-3xl font-bold">
              Opportunity Scout
            </h1>
          </div>
          <p className="text-text-body">
            AI-curated high-value demands daily
          </p>
          
          <div className="mt-4">
            <UserStatusBanner />
          </div>
        </div>

        <DemandListClient demands={demands} />
      </div>
    </AppShell>
  )
}

