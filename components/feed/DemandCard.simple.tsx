'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, ExternalLink } from 'lucide-react'
import type { DemandFree } from '@/lib/db/types'

interface DemandCardProps {
  demand: DemandFree
  index: number
}

export function DemandCard({ demand, index }: DemandCardProps) {
  const router = useRouter()

  const handleClick = () => {
    console.log('👆 [Analytics] demand_card_click', { demand_id: demand.id })
    router.push(`/demands/${demand.id}`)
  }

  return (
    <Card 
      className="bg-sub-bg border-glass-border hover:border-accent-glow/30 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-glow"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg text-text-main line-clamp-2">
            {demand.title}
          </CardTitle>
          
          {/* 痛点指数 Badge */}
          <Badge 
            variant="secondary" 
            className="shrink-0 bg-accent-primary/10 text-accent-primary border-accent-primary/20"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {demand.pain_score}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-text-body text-sm mb-4 line-clamp-3">
          {demand.summary}
        </p>

        {/* 标签 */}
        {demand.tags && demand.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {demand.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs border-glass-border text-text-dim"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-text-dim">
          <span>
            {new Date(demand.created_at).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          
          <div className="flex items-center gap-1 text-accent-primary hover:underline">
            <span>查看详情</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

