'use client'

import dynamic from 'next/dynamic'
import GameOfLifeLoading from './loading'

// Dynamic import with SSR disabled in a client component
const GameOfLife = dynamic(
  () => import('./game-of-life').then((mod) => ({ default: mod.GameOfLife })),
  {
    ssr: false,
    loading: () => <GameOfLifeLoading />,
  }
)

export function ClientGameOfLife() {
  return <GameOfLife />
}
