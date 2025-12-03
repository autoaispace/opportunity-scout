export type SubscriptionStatus = 'free' | 'pro' | 'lifetime'
export type SubscriptionPlan = 'monthly' | 'yearly' | 'lifetime'
export type DemandDifficulty = 'easy' | 'medium' | 'hard'

export interface Profile {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan | null
  subscription_expires_at: string | null
  provider: 'google' | 'apple'
  locale: string
  notification_enabled: boolean
  created_at: string
  updated_at: string
}

export interface DemandFree {
  id: string
  title: string
  summary: string
  pain_score: number
  source_url: string
  created_at: string
  tags: string[]
}

export interface DemandPro extends DemandFree {
  description: string
  market_size: string | null
  difficulty: DemandDifficulty | null
  competitors: Competitor[] | null
  trend_data: TrendDataPoint[] | null
  roi_estimate: ROIEstimate | null
  ai_confidence: number
  source_platform: string | null
}

export interface Competitor {
  name: string
  url: string
  description: string
}

export interface TrendDataPoint {
  date: string
  value: number
}

export interface ROIEstimate {
  min: number
  max: number
  confidence: number
}

