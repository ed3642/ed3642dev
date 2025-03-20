'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { SimpleGrid } from '@/components/simple-grid'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IPurpleWinGridCell } from '@/models/purple-win'
import { UserNameSection } from './username-section'
import { useUsername } from '@/providers/username-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { CellInfo } from './cell-info'
import { Badge } from '@/components/ui/badge'
import { Realtime } from 'ably'
import { CellData, CellMetadata } from '@/types/types'
import { PURPLE_WIN_COOLDOWN } from '@/constants/constants'

const COLORS = {
  0: '#4ade80', // Green
  1: '#a855f7', // Purple
}

const GRID_SIZE = 10

function PurpleWin() {
  const [cellSize, setCellSize] = useState(40)
  const [grid, setGrid] = useState<number[][]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ purple: 0, green: 0, total: 0 })
  const { data: session } = useSession()
  const { username } = useUsername()
  const [cellsMetadata, setCellsMetadata] = useState<Record<string, CellMetadata>>({})
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'connecting' | 'offline'>(
    'connecting'
  )
  const [canFlip, setCanFlip] = useState(true)
  const animationRef = useRef<number>(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  // ref so it doesnt change on re-renders
  const ablyRef = useRef<Realtime | null>(null)

  const fetchGrid = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/purple-win/crud')
      const data = await res.json()
      if (!data) {
        throw new Error('Failed to fetch grid data')
      }

      if (data.success) {
        const newGrid: number[][] = Array(GRID_SIZE)
          .fill(0)
          .map(() => Array(GRID_SIZE).fill(0))

        const metadata: Record<string, CellMetadata> = {}

        data.cells.forEach((cell: IPurpleWinGridCell) => {
          newGrid[cell.y][cell.x] = cell.state

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

    if (!canFlip) {
      toast.error('Cooldown active. Please wait before flipping another cell.')
      return
    }

    try {
      const currentState = grid[rowIndex][colIndex]
      const newState = currentState === 0 ? 1 : 0

      // optimistic update for grid
      const newGrid = [...grid]
      newGrid[rowIndex][colIndex] = newState
      setGrid(newGrid)

      startTimer() // for cooldown

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

      // optimistic update for stats
      setStats((prevStats) => {
        const purpleDelta = newState === 1 ? 1 : -1
        return {
          purple: prevStats.purple + purpleDelta,
          green: prevStats.green - purpleDelta,
          total: prevStats.total,
        }
      })

      const response = await fetch('/api/purple-win/crud', {
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

      if (!data.success) {
        newGrid[rowIndex][colIndex] = currentState
        setGrid([...newGrid])

        setCellsMetadata({
          ...cellsMetadata,
          [key]: currentMeta,
        })

        setStats((prevStats) => {
          const purpleDelta = newState === 1 ? -1 : 1
          return {
            purple: prevStats.purple + purpleDelta,
            green: prevStats.green - purpleDelta,
            total: prevStats.total,
          }
        })

        toast.error(data.message || 'Failed to update cell')
      }
    } catch (error) {
      console.error('Error updating cell:', error)
      toast.error('Failed to update the cell')

      fetchGrid()
    }
  }

  const handleCellUpdate = useCallback((cell: CellData) => {
    if (!cell) {
      console.error('Invalid cell data:', cell)
      return
    }

    console.log('Received cell update:', cell)

    setGrid((prev) => {
      if (!prev.length) return prev
      if (cell.x < 0 || cell.x >= GRID_SIZE || cell.y < 0 || cell.y >= GRID_SIZE) {
        return prev
      }

      if (prev[cell.y][cell.x] !== cell.state) {
        const newGrid = [...prev]
        newGrid[cell.y][cell.x] = cell.state
        return newGrid
      }

      return prev
    })

    setCellsMetadata((prev) => ({
      ...prev,
      [`${cell.y}-${cell.x}`]: {
        lastChangedBy: cell.lastChangedBy || 'Unknown',
        flipCount: cell.flipCount || 0,
        updatedAt: cell.updatedAt || new Date().toISOString(),
      },
    }))

    setGrid((prevGrid) => {
      if (!prevGrid.length) return prevGrid

      const newStats = { purple: 0, green: 0, total: GRID_SIZE * GRID_SIZE }
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (prevGrid[y][x] === 1) {
            newStats.purple++
          } else {
            newStats.green++
          }
        }
      }

      setStats(newStats)
      return prevGrid
    })
  }, [])

  // connect ably
  useEffect(() => {
    if (isLoading || grid.length === 0) return

    const setupAbly = async () => {
      try {
        setRealtimeStatus('connecting')

        const tokenResponse = await fetch('/api/ably-token')
        const tokenData = await tokenResponse.json()

        const ably = new Realtime({
          authCallback: (_, callback) => {
            callback(null, tokenData)
          },
        })

        ablyRef.current = ably

        ably.connection.on('connected', () => {
          console.log('Ably connected')
          setRealtimeStatus('connected')
        })

        ably.connection.on('disconnected', () => {
          console.log('Ably disconnected')
          setRealtimeStatus('offline')
        })

        ably.connection.on('failed', () => {
          console.error('Ably connection failed')
          setRealtimeStatus('offline')
        })

        // sub
        const channel = ably.channels.get('purple-win')

        channel.subscribe('cell-update', (message) => {
          console.log('Received message:', message)
          if (message.data && message.data.cell) {
            handleCellUpdate(message.data.cell)
          }
        })
      } catch (error) {
        console.error('Error setting up Ably:', error)
        setRealtimeStatus('offline')

        setTimeout(setupAbly, 5000) // retry connection after 5 seconds
      }
    }

    setupAbly()

    // clean up connection
    return () => {
      if (ablyRef.current) {
        const ably = ablyRef.current

        try {
          const channel = ably.channels.get('purple-win')

          channel.detach()
          ably.close()

          ablyRef.current = null
        } catch (error) {
          console.error('Error during Ably cleanup:', error)
        }
      }
    }
  }, [grid.length, isLoading, handleCellUpdate])

  useEffect(() => {
    fetchGrid()
  }, [])

  // window resize
  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth * 0.9
      const cellSize = Math.min(40, Math.floor(availableWidth / GRID_SIZE))
      setCellSize(cellSize)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const startTimer = () => {
    setCanFlip(false)

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Start the smooth animation
    const startTime = Date.now()
    const endTime = startTime + PURPLE_WIN_COOLDOWN * 1000

    const animate = () => {
      const now = Date.now()
      const timeElapsed = now - startTime
      const timeRemaining = Math.max(0, endTime - now)

      // Calculate progress (0 to 100)
      const progress = Math.min(100, (timeElapsed / (PURPLE_WIN_COOLDOWN * 1000)) * 100)

      // Update progress bar width if ref is available
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `translateX(-${100 - progress}%)`
      }

      // If cooldown is complete
      if (timeRemaining <= 0) {
        setCanFlip(true)
        return
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)
  }

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  if (isLoading && grid.length === 0) {
    return <PurpleWinSkeleton />
  }

  const purplePercentage = stats.total > 0 ? Math.round((stats.purple / stats.total) * 100) : 0
  const greenPercentage = stats.total > 0 ? Math.round((stats.green / stats.total) * 100) : 0

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

  const RealtimeStatus = () => {
    return (
      <Badge
        variant={
          realtimeStatus === 'connected'
            ? 'default'
            : realtimeStatus === 'connecting'
            ? 'outline'
            : 'destructive'
        }
      >
        <span
          className={`h-2 w-2 rounded-full mr-1.5 ${
            realtimeStatus === 'connected'
              ? 'bg-green-500 animate-pulse'
              : realtimeStatus === 'connecting'
              ? 'bg-amber-500'
              : 'bg-red-500'
          }`}
        />
        {realtimeStatus === 'connected'
          ? 'Live'
          : realtimeStatus === 'connecting'
          ? 'Connecting...'
          : 'Offline'}
      </Badge>
    )
  }

  const CooldownIndicator = () => {
    return (
      <div className="flex flex-col items-center w-full max-w-2xl px-1 pb-2 gap-1">
        <div className="flex justify-between w-full">
          <span className="text-xs font-medium">
            {canFlip ? (
              <div className="text-green-500">Ready to flip</div>
            ) : (
              <div className="text-amber-500">In cooldown</div>
            )}
          </span>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-amber-500 transition-transform duration-100 ease-linear"
            style={{ transform: 'translateX(-100%)' }}
          />
        </div>
      </div>
    )
  }

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

      <div className="flex justify-between items-center w-full max-w-2xl px-1">
        <RealtimeStatus />
      </div>

      <CooldownIndicator />

      {grid.length > 0 && (
        <SimpleGrid
          grid={grid}
          toggleCell={toggleCell}
          cellSize={cellSize}
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
