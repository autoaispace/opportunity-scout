import { useTranslations } from 'next-intl'
import { Inbox } from 'lucide-react'

export function EmptyState() {
  const t = useTranslations('feed')

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-full bg-sub-bg flex items-center justify-center mb-4">
        <Inbox className="w-10 h-10 text-text-dim" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-main mb-2">
        {t('emptyTitle')}
      </h3>
      
      <p className="text-text-body text-center max-w-sm">
        {t('emptyDescription')}
      </p>
    </div>
  )
}

