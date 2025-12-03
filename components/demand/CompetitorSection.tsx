import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import type { Competitor } from '@/lib/db/types'

interface CompetitorSectionProps {
  competitors: Competitor[]
}

export function CompetitorSection({ competitors }: CompetitorSectionProps) {
  return (
    <div className="space-y-3">
      {competitors.map((competitor, index) => (
        <Card key={index} className="bg-glass-bg border-glass-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="text-text-main">{competitor.name}</span>
              <a
                href={competitor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:text-accent-glow transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-body">
              {competitor.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

