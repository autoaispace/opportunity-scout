import type { PaymentProvider } from './types'
import { MockPaymentProvider } from './mock-provider'

// TODO: Import StripeProvider when ready
// import { StripeProvider } from './stripe-provider'

export function getPaymentProvider(): PaymentProvider {
  const useMockPayment = process.env.NEXT_PUBLIC_USE_MOCK_PAYMENT === 'true'

  if (useMockPayment) {
    return new MockPaymentProvider()
  }

  // TODO: Return StripeProvider in production
  // return new StripeProvider(process.env.STRIPE_SECRET_KEY!)
  
  return new MockPaymentProvider() // Default to mock for now
}

export * from './types'

