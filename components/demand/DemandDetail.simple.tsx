import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, ExternalLink, Tag, Target, DollarSign } from 'lucide-react'
import { CompetitorSection } from './CompetitorSection'
import { TrendChart } from './TrendChart'
import { LockedContent } from './LockedContent.simple'
import type { DemandPro, DemandFree } from '@/lib/db/types'

interface DemandDetailProps {
  demand: DemandPro | DemandFree
  isPro: boolean
}

export function DemandDetail({ demand, isPro }: DemandDetailProps) {
  const demandPro = demand as DemandPro

  return (
    <div className="space-y-6">
      {/* 标题部分 */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-text-main">
            {demand.title}
          </h1>
          
          <Badge className="shrink-0 bg-accent-primary/10 text-accent-primary border-accent-primary/20">
            <TrendingUp className="w-4 h-4 mr-1" />
            {demand.pain_score}
          </Badge>
        </div>

        {/* 标签 */}
        {demand.tags && demand.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {demand.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="border-glass-border text-text-body"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 摘要 - 始终可见 */}
      <Card className="bg-sub-bg border-glass-border">
        <CardHeader>
          <CardTitle className="text-text-main">需求摘要</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-body leading-relaxed">
            {demand.summary}
          </p>
        </CardContent>
      </Card>

      {/* 详细描述 - Pro only */}
      {isPro && demandPro.description ? (
        <Card className="bg-sub-bg border-glass-border">
          <CardHeader>
            <CardTitle className="text-text-main">详细描述</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-body leading-relaxed whitespace-pre-wrap">
              {demandPro.description}
            </p>
          </CardContent>
        </Card>
      ) : !isPro && (
        <div>
          <h2 className="text-xl font-semibold text-text-main mb-3">
            详细描述
          </h2>
          <LockedContent />
        </div>
      )}

      {/* 市场信息 - Pro only */}
      {isPro && (demandPro.market_size || demandPro.difficulty) && (
        <div className="grid md:grid-cols-2 gap-4">
          {demandPro.market_size && (
            <Card className="bg-glass-bg border-glass-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-text-main">
                  <Target className="w-5 h-5 text-accent-primary" />
                  市场规模
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent-primary">
                  {demandPro.market_size}
                </p>
              </CardContent>
            </Card>
          )}

          {demandPro.difficulty && (
            <Card className="bg-glass-bg border-glass-border">
              <CardHeader>
                <CardTitle className="text-base text-text-main">
                  开发难度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant="secondary"
                  className={`text-base ${
                    demandPro.difficulty === 'easy' ? 'bg-success/10 text-success' :
                    demandPro.difficulty === 'medium' ? 'bg-warning/10 text-warning' :
                    'bg-error/10 text-error'
                  }`}
                >
                  {demandPro.difficulty.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 竞品分析 - Pro only */}
      <div>
        <h2 className="text-xl font-semibold text-text-main mb-3">
          竞品分析
        </h2>
        {isPro && demandPro.competitors ? (
          <CompetitorSection competitors={demandPro.competitors} />
        ) : (
          <LockedContent />
        )}
      </div>

      {/* 热度趋势 - Pro only */}
      <div>
        <h2 className="text-xl font-semibold text-text-main mb-3">
          热度趋势
        </h2>
        {isPro && demandPro.trend_data ? (
          <TrendChart data={demandPro.trend_data} />
        ) : (
          <LockedContent />
        )}
      </div>

      {/* ROI 预估 - Pro only */}
      {isPro && demandPro.roi_estimate ? (
        <Card className="bg-glass-bg border-glass-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-text-main">
              <DollarSign className="w-5 h-5 text-accent-primary" />
              ROI 预估
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-text-dim mb-1">最低预估</p>
                <p className="text-2xl font-bold text-accent-primary">
                  ${demandPro.roi_estimate.min.toLocaleString()}
                </p>
              </div>
              <div className="text-text-dim text-2xl">-</div>
              <div>
                <p className="text-xs text-text-dim mb-1">最高预估</p>
                <p className="text-2xl font-bold text-accent-primary">
                  ${demandPro.roi_estimate.max.toLocaleString()}
                </p>
              </div>
              <div className="ml-auto">
                <p className="text-xs text-text-dim mb-1">可信度</p>
                <p className="text-lg font-semibold text-text-main">
                  {(demandPro.roi_estimate.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : !isPro && (
        <div>
          <h2 className="text-xl font-semibold text-text-main mb-3">
            ROI 预估
          </h2>
          <LockedContent />
        </div>
      )}

      {/* 来源链接 - 始终可见 */}
      <Card className="bg-sub-bg border-glass-border">
        <CardContent className="pt-6">
          <Button
            variant="outline"
            className="w-full"
            asChild
          >
            <a
              href={demand.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              查看原始来源
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

