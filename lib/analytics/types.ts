export type EventName =
  // Auth events
  | 'auth_login_started'
  | 'auth_login_success'
  | 'auth_login_error'
  | 'auth_logout'
  
  // Feed events
  | 'view_feed'
  | 'demand_card_click'
  | 'load_more_demands'
  
  // Detail events
  | 'view_demand_detail'
  | 'click_source_link'
  | 'share_demand'
  
  // Subscription events
  | 'click_upgrade'
  | 'view_pricing_modal'
  | 'select_plan'
  | 'checkout_started'
  | 'checkout_success'
  | 'checkout_cancelled'
  
  // Engagement events
  | 'click_locked_content'
  | 'toggle_language'
  | 'enable_notifications'

export interface EventProperties {
  // Common properties
  user_id?: string
  subscription_status?: string
  locale?: string
  
  // Event-specific properties
  demand_id?: string
  plan?: string
  provider?: 'google' | 'apple'
  error_message?: string
  [key: string]: unknown
}

export interface AnalyticsEvent {
  name: EventName
  properties?: EventProperties
  timestamp: number
}

