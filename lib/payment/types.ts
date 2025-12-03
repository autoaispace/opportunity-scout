export type PlanId = 'monthly' | 'yearly' | 'lifetime'

export interface Plan {
  id: PlanId
  name: string
  price: number
  currency: string
  interval: 'month' | 'year' | 'lifetime'
  features: string[]
}

export interface CheckoutSession {
  sessionId: string
  url: string
}

export interface PaymentProvider {
  /**
   * Create checkout session
   */
  createCheckoutSession(
    planId: PlanId,
    userId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession>

  /**
   * Handle webhook from payment provider
   */
  handleWebhook(payload: unknown): Promise<{
    userId: string
    planId: PlanId
    status: 'success' | 'failed'
  }>

  /**
   * Cancel subscription
   */
  cancelSubscription(userId: string): Promise<void>
}

