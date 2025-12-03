import type { PaymentProvider, PlanId, CheckoutSession } from './types'

/**
 * Mock Payment Provider for development/demo
 * 
 * TODO: Developer - Replace this MockProvider with StripeProvider when ready.
 * 
 * To integrate Stripe:
 * 1. Install: npm install stripe @stripe/stripe-js
 * 2. Create lib/payment/stripe-provider.ts implementing PaymentProvider
 * 3. Update lib/payment/index.ts to use StripeProvider in production
 */
export class MockPaymentProvider implements PaymentProvider {
  async createCheckoutSession(
    planId: PlanId,
    userId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('🎭 [Mock Payment] Creating checkout session', {
      planId,
      userId,
      successUrl,
      cancelUrl,
    })

    // Return mock session
    return {
      sessionId: `mock_session_${Date.now()}`,
      url: `/mock-checkout?plan=${planId}&user=${userId}`,
    }
  }

  async handleWebhook(payload: unknown): Promise<{
    userId: string
    planId: PlanId
    status: 'success' | 'failed'
  }> {
    console.log('🎭 [Mock Payment] Handling webhook', payload)

    // Mock successful payment
    return {
      userId: 'mock_user_id',
      planId: 'monthly',
      status: 'success',
    }
  }

  async cancelSubscription(userId: string): Promise<void> {
    console.log('🎭 [Mock Payment] Cancelling subscription for', userId)
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}

