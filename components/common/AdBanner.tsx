'use client'

import { useEffect } from 'react'

const adsClientId = process.env.NEXT_PUBLIC_GADS_CLIENT_ID

type AdSlotId = 'feed' | 'demandDetail'

const adSlotMap: Record<AdSlotId, string | undefined> = {
  feed: process.env.NEXT_PUBLIC_GADS_SLOT_FEED,
  demandDetail: process.env.NEXT_PUBLIC_GADS_SLOT_DEMAND_DETAIL,
}

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface AdBannerProps {
  slot: AdSlotId
}

export function AdBanner({ slot }: AdBannerProps): JSX.Element | null {
  const slotId = adSlotMap[slot]

  useEffect(() => {
    if (!adsClientId || !slotId) {
      return
    }

    try {
      ;(window.adsbygoogle as unknown[] | undefined)?.push({} as unknown)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[Ads] Failed to load Google Ads', error)
    }
  }, [slotId])

  // 当前仅作为广告占位，不展示任何文字，避免 i18n 上下文依赖
  if (!adsClientId || !slotId) {
    return (
      <div className="w-full my-4">
        <div className="w-full h-28 sm:h-32 lg:h-40 rounded-modern border border-dashed border-glass-border bg-white" />
      </div>
    )
  }

  return (
    <div className="w-full my-4">
      <div className="w-full h-28 sm:h-32 lg:h-40 rounded-modern overflow-hidden bg-sub-bg flex items-center justify-center">
        <ins
          className="adsbygoogle block w-full h-full"
          style={{ display: 'block' }}
          data-ad-client={adsClientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  )
}

