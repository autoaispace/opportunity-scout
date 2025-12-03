export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export interface SignInParams {
  provider: 'google' | 'apple'
  redirectTo?: string
}

export interface UpdateProfileParams {
  display_name?: string
  locale?: string
  notification_enabled?: boolean
}

export interface SubscriptionCheckoutParams {
  plan: 'monthly' | 'yearly' | 'lifetime'
  successUrl: string
  cancelUrl: string
}

