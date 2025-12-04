'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

type GoogleAdType = 'banner' | 'rectangle'

interface GoogleAdSlotProps {
  slotId: string
  type?: GoogleAdType
  className?: string
}

export function GoogleAdSlot({
  slotId,
  type = 'banner',
  className,
}: GoogleAdSlotProps): JSX.Element {
  const t = useTranslations('ads')

  const baseSizeClass =
    type === 'banner'
      ? 'min-h-[96px] md:min-h-[120px]'
      : 'min-h-[160px] md:min-h-[250px]'

  return (
    <div
      className={cn(
        'w-full rounded-modern border border-glass-border bg-sub-bg/80 flex items-center justify-center overflow-hidden',
        'px-3 py-3 md:px-4 md:py-4',
        baseSizeClass,
        className
      )}
      // 预留给未来 Google Ads 脚本使用的数据属性
      data-google-ad-slot={slotId}
    >
      <div className="flex flex-col items-center justify-center text-center gap-1">
        <span className="text-[11px] uppercase tracking-[0.2em] text-text-dim">
          {t('label', { defaultMessage: 'Sponsored' })}
        </span>
        <span className="text-xs md:text-sm text-text-body">
          {t('placeholder', {
            defaultMessage: 'Reserved area for Google Ads',
          })}
        </span>
      </div>
    </div>
  )
}


