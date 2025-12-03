'use client'

import { create } from 'zustand'
import { useEffect } from 'react'
import type { SubscriptionStatus, SubscriptionPlan } from '@/lib/db/types'

interface SubscriptionState {
  status: SubscriptionStatus
  plan: SubscriptionPlan | null
  expiresAt: string | null
  isLoading: boolean
  
  // Computed properties
  isPro: boolean
  isLifetime: boolean
  
  // Actions
  setSubscription: (status: SubscriptionStatus, plan: SubscriptionPlan | null, expiresAt: string | null) => void
  setLoading: (loading: boolean) => void
  refresh: () => Promise<void>
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  status: 'free',
  plan: null,
  expiresAt: null,
  isLoading: true,
  
  get isPro() {
    const state = get()
    return state.status === 'pro' || state.status === 'lifetime'
  },
  
  get isLifetime() {
    return get().status === 'lifetime'
  },
  
  setSubscription: (status, plan, expiresAt) => 
    set({ status, plan, expiresAt, isLoading: false }),
  
  setLoading: (loading) => 
    set({ isLoading: loading }),
  
  refresh: async () => {
    try {
      const response = await fetch('/api/subscription')
      const data = await response.json()
      
      set({
        status: data.subscription_status,
        plan: data.subscription_plan,
        expiresAt: data.subscription_expires_at,
        isLoading: false,
      })
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
      set({ isLoading: false })
    }
  },
}))

export function useSubscription() {
  const store = useSubscriptionStore()
  
  // Fetch subscription status on mount
  useEffect(() => {
    store.refresh()
  }, [])
  
  return store
}

