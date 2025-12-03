'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import type { TrendDataPoint } from '@/lib/db/types'

interface TrendChartProps {
  data: TrendDataPoint[]
}

export function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  // Simple visualization without external chart library
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <Card className="bg-glass-bg border-glass-border">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2 text-text-main">
          <TrendingUp className="w-5 h-5 text-accent-primary" />
          热度趋势
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((point, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xs text-text-dim w-16">
                {new Date(point.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex-1 h-6 bg-sub-bg rounded-sm overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-glow transition-all"
                  style={{ width: `${(point.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs text-text-body w-8 text-right">
                {point.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

