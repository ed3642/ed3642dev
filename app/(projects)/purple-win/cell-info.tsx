'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface CellInfoProps {
  cell?: {
    lastChangedBy: string
    flipCount: number
    updatedAt: string
  }
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function CellInfo({ cell, children, onClick, className }: CellInfoProps) {
  if (!cell) {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    )
  }

  const formattedDate = formatDistanceToNow(new Date(cell.updatedAt))

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={cn('cursor-pointer', className)} onClick={onClick}>
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-3">
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Changed by:</span> {cell.lastChangedBy}
          </p>
          <p className="text-sm">
            <span className="font-medium">Times flipped:</span> {cell.flipCount}
          </p>
          <p className="text-sm">
            <span className="font-medium">Last changed:</span> {formattedDate}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
