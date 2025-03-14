'use client'

import dynamic from 'next/dynamic'
import { PathFindingLoading } from './loading-pathfinding'

// Dynamic import with SSR disabled in a client component
const PathFinding = dynamic(
  () => import('./path-finding').then((mod) => ({ default: mod.PathFinding })),
  {
    ssr: false,
    loading: () => <PathFindingLoading />,
  }
)

export function ClientPathFinding() {
  return <PathFinding />
}
