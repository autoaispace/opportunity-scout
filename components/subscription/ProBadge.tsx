import { Badge } from '@/components/ui/badge'
import { Crown } from 'lucide-react'

export function ProBadge() {
  return (
    <Badge className="bg-accent-gold text-core-bg font-semibold">
      <Crown className="w-3 h-3 mr-1" />
      PRO
    </Badge>
  )
}

