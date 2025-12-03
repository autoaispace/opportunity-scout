'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, ExternalLink } from 'lucide-react'
import { fadeInUp } from '@/lib/animations/variants'
import type { DemandFree } from '@/lib/db/types'

interface DemandCardProps {
  demand: DemandFree
  index: number
}

export function DemandCard({ demand, index }: DemandCardProps) {
  const t = useTranslations('feed')
  const router = useRouter()

  const handleClick = () => {
    router.push(`/demands/${demand.id}`)
  }

  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="bg-sub-bg border-glass-border hover:border-accent-glow/30 cursor-pointer transition-colors"
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg text-text-main line-clamp-2">
              {demand.title}
            </CardTitle>
            
            {/* Pain Score Badge */}
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

          {/* Tags */}
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
              <span>{t('viewDetail')}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

