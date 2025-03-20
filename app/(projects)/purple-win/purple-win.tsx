'use client'

import { useEffect, useState } from 'react'
import { SimpleGrid } from '@/components/simple-grid'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IPurpleWinGridCell } from '@/models/purple-win'
import { UserNameSection } from './username-section'
import { useUsername } from '@/providers/username-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { CellInfo } from './cell-info'

const COLORS = {
  0: '#4ade80', // Green
  1: '#a855f7', // Purple
}
const GRID_SIZE = 10
interface CellMetadata {
  lastChangedBy: string
  flipCount: number
  updatedAt: string
}

function PurpleWin() {
  const [grid, setGrid] = useState<number[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ purple: 0, green: 0, total: 0 })
  const { data: session } = useSession()
  const { username } = useUsername()
  // Add state for cell metadata
  const [cellsMetadata, setCellsMetadata] = useState<Record<string, CellMetadata>>({})

  const fetchGrid = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/purple-win')
      const data = await res.json()
      if (!data) {
        throw new Error('Failed to fetch grid data')
      }

      if (data.success) {
        const newGrid: number[][] = Array(GRID_SIZE)
          .fill(0)
          .map(() => Array(GRID_SIZE).fill(0))

        // Build cell metadata map
        const metadata: Record<string, CellMetadata> = {}

        data.cells.forEach((cell: IPurpleWinGridCell) => {
          newGrid[cell.y][cell.x] = cell.state

          // Store metadata for each cell
          metadata[`${cell.y}-${cell.x}`] = {
            lastChangedBy: cell.lastChangedBy || 'Unknown',
            flipCount: cell.flipCount || 0,
            updatedAt: new Date(cell.updatedAt).toISOString() || new Date().toISOString(),
          }
        })

        setGrid(newGrid)
        setCellsMetadata(metadata)

        const purpleCells = data.cells.filter((cell: IPurpleWinGridCell) => cell.state === 1).length
        const greenCells = data.cells.filter((cell: IPurpleWinGridCell) => cell.state === 0).length

        setStats({
          purple: purpleCells,
          green: greenCells,
          total: purpleCells + greenCells,
        })
      }
    } catch (error) {
      console.error('Error fetching grid:', error)
      toast.error('Failed to load the grid')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCell = async (rowIndex: number, colIndex: number) => {
    if (!session) {
      toast.error('Please sign in to play')
      return
    }

    try {
      const currentState = grid[rowIndex][colIndex]
      const newState = currentState === 0 ? 1 : 0

      const response = await fetch('/api/purple-win', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x: colIndex,
          y: rowIndex,
          state: newState,
          displayName: username || 'anon',
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Local cell update
        const newGrid = [...grid]
        newGrid[rowIndex][colIndex] = newState
        setGrid(newGrid)

        // Update cell metadata
        const key = `${rowIndex}-${colIndex}`
        const currentMeta = cellsMetadata[key] || { lastChangedBy: '', flipCount: 0, updatedAt: '' }

        setCellsMetadata({
          ...cellsMetadata,
          [key]: {
            lastChangedBy: username || 'anon',
            flipCount: (currentMeta.flipCount || 0) + 1,
            updatedAt: new Date().toISOString(),
          },
        })

        // Local stats update
        setStats((prevStats) => {
          const purpleDelta = newState === 1 ? 1 : -1
          return {
            purple: prevStats.purple + purpleDelta,
            green: prevStats.green - purpleDelta,
            total: prevStats.total,
          }
        })

        toast.success(`Changed to ${newState === 1 ? 'purple' : 'green'}!`)
      } else {
        toast.error(data.message || 'Failed to update cell')
      }
    } catch (error) {
      console.error('Error updating cell:', error)
      toast.error('Failed to update the cell')
    }
  }

  // Create a cell renderer function that wraps cells in CellInfo
  const renderCell = (rowIndex: number, colIndex: number, color: string) => {
    const cellMetadata = cellsMetadata[`${rowIndex}-${colIndex}`]

    return (
      <CellInfo
        cell={cellMetadata}
        onClick={() => toggleCell(rowIndex, colIndex)}
        className="w-full h-full"
      >
        <div className="w-full h-full rounded-sm" style={{ backgroundColor: color }} />
      </CellInfo>
    )
  }

  useEffect(() => {
    fetchGrid()
  }, [])

  if (isLoading && grid.length === 0) {
    return <PurpleWinSkeleton />
  }

  const purplePercentage = stats.total > 0 ? Math.round((stats.purple / stats.total) * 100) : 0
  const greenPercentage = stats.total > 0 ? Math.round((stats.green / stats.total) * 100) : 0

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <UserNameSection />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Game Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-500">{stats.purple}</p>
                <p className="text-xs text-muted-foreground">Purple ({purplePercentage}%)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{stats.green}</p>
                <p className="text-xs text-muted-foreground">Green ({greenPercentage}%)</p>
              </div>
            </div>
            <div className="w-full bg-green-500 rounded-full h-2.5 mt-4">
              <div
                className="bg-purple-500 h-2.5 rounded-l-full"
                style={{ width: `${purplePercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Click on any cell to change its color. Purple vs Green war!
              {!session && ' Sign in to play.'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Hover over cells to see their history.
            </p>
          </CardContent>
        </Card>
      </div>

      {grid.length > 0 && (
        <SimpleGrid
          grid={grid}
          toggleCell={toggleCell}
          cellSize={40}
          gap={1}
          colors={COLORS}
          cellClassName="rounded-sm transition-colors duration-200"
          cellRenderer={renderCell}
        />
      )}
    </div>
  )
}

const PurpleWinSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full gap-6">
      <Skeleton className="w-full max-w-md h-16 rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-10 gap-1">
        {Array(10)
          .fill(0)
          .map((_, rowIndex) =>
            Array(10)
              .fill(0)
              .map((_, colIndex) => (
                <Skeleton
                  key={`skeleton-${rowIndex}-${colIndex}`}
                  className="w-10 h-10 rounded-sm"
                />
              ))
          )}
      </div>
    </div>
  )
}

export { PurpleWin }
