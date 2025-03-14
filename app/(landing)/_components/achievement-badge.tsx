import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'

interface AchievementBadgeProps {
  Icon: LucideIcon
  title: string
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ Icon, title }) => {
  return (
    <Badge className="text-sm">
      <Icon className="h-5 w-5 text-gray-800 mr-2" />
      {title}
    </Badge>
  )
}

export { AchievementBadge }
