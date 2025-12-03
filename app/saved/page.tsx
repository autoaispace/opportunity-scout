import { AppShell } from '@/components/layout/AppShell.simple'
import { Bookmark } from 'lucide-react'

export default function SavedPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-20">
          <Bookmark className="w-16 h-16 text-text-dim mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-main mb-2">收藏功能</h2>
          <p className="text-text-body">即将上线...</p>
        </div>
      </div>
    </AppShell>
  )
}

