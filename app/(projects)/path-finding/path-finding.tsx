'use client'

import { useState, useMemo, useEffect } from 'react'
import { SimpleGrid } from '@/components/simple-grid'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, CircleHelp } from 'lucide-react'
import { calculateGridDimensions, getCellSize, isInBounds } from '@/lib/simple-grid/utils'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

import { colorMapping, COLORS } from './legend'
import * as algorithms from './algorithms'

const GAP_SIZE: number = 1

const baseDirections = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]
const diagonalDirections = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
]

enum Algorithm {
  BFS = 'BFS',
  DFS = 'DFS',
  AStar = 'A*',
}

const algorithmFuncMap = {
  [Algorithm.BFS]: algorithms.runBFS,
  [Algorithm.DFS]: algorithms.runDFS,
  [Algorithm.AStar]: algorithms.runAStar,
}

const algorithmNames = Object.values(Algorithm)

const createInitialGrid = (numRows: number, numCols: number): number[][] => {
  const grid = new Array(numRows)
  for (let i = 0; i < numRows; i++) {
    grid[i] = new Array(numCols).fill(COLORS.empty)
  }
  // initial pattern
  const halfCol = Math.floor(numCols / 2)
  const colShift = Math.floor(numCols / 4)
  const midRow = Math.floor(numRows / 2)
  grid[midRow - 1][halfCol - 2] = COLORS.source
  grid[midRow - 2][halfCol] = COLORS.wall
  grid[midRow - 1][halfCol] = COLORS.wall
  grid[midRow][halfCol] = COLORS.wall
  grid[midRow - 1][halfCol + colShift] = COLORS.dest
  algorithms.runBFS({ grid, colors: COLORS, directions: baseDirections })
  return grid
}

const DESIRED_VIEW_WIDTH = window.innerWidth
const DESIRED_VIEW_HEIGHT = window.innerHeight * 0.75

const PathFinding: React.FC = () => {
  const cellSize = getCellSize({ defaultSize: 30, phoneSize: 45 })
  const { numRows, numCols } = calculateGridDimensions(
    cellSize,
    DESIRED_VIEW_WIDTH,
    DESIRED_VIEW_HEIGHT
  )

  const initialGrid = useMemo(() => createInitialGrid(numRows, numCols), [numRows, numCols])
  const [grid, setGrid] = useState(initialGrid)
  const [pathLength, setPathLength] = useState(0)
  const [cellsChecked, setCellsChecked] = useState(0)
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.BFS)
  const [allowDiagonals, setAllowDiagonals] = useState(false)
  const [draggedCell, setDraggedCell] = useState<{ type: COLORS; i: number; j: number } | null>(
    null
  )

  useEffect(() => {
    runCurrentAlgorithm(allowDiagonals)
  }, [allowDiagonals, algorithm])

  const runCurrentAlgorithm = (allowDiagonals: boolean): void => {
    const runAlgorithm = algorithmFuncMap[algorithm]
    if (runAlgorithm) {
      const { pathLength, cellsChecked } = runAlgorithm({
        grid,
        colors: COLORS,
        directions: allowDiagonals ? diagonalDirections : baseDirections,
      })
      setPathLength(pathLength)
      setCellsChecked(cellsChecked)
      const newGrid = grid.map((row) => [...row])
      setGrid(newGrid)
    }
  }

  const toggleCell = (i: number, j: number): void => {
    if (
      !isInBounds(i, j, numRows, numCols) ||
      grid[i][j] == COLORS.source ||
      grid[i][j] == COLORS.dest
    )
      return
    // dont setGrid here, so we dont have to make a copy just for updating one cell
    grid[i][j] = grid[i][j] === COLORS.wall ? COLORS.empty : COLORS.wall
    runCurrentAlgorithm(allowDiagonals)
  }

  const handleGenerateMaze = () => {
    algorithms.generateMaze(grid, COLORS)
    runCurrentAlgorithm(allowDiagonals)
    const newGrid = grid.map((row) => [...row])
    setGrid(newGrid)
  }

  const handleDragStart = (i: number, j: number) => {
    if (grid[i][j] === COLORS.source || grid[i][j] === COLORS.dest) {
      setDraggedCell({ type: grid[i][j], i, j })
    }
  }

  const handleDrop = (i: number, j: number) => {
    if (grid[i][j] === COLORS.dest || grid[i][j] === COLORS.source) return
    if (draggedCell && isInBounds(i, j, numRows, numCols)) {
      grid[draggedCell.i][draggedCell.j] = COLORS.empty
      grid[i][j] = draggedCell.type
      runCurrentAlgorithm(allowDiagonals)
      setDraggedCell(null)
    }
  }

  const handleTouchStart = (i: number, j: number) => {
    if (draggedCell) {
      handleDrop(i, j)
    } else {
      handleDragStart(i, j)
    }
  }

  const handleReset = (): void => {
    setGrid(createInitialGrid(numRows, numCols))
    setAllowDiagonals(false)
    setAlgorithm(Algorithm.BFS)
  }

  return (
    <div className="flex items-center flex-col">
      <div className="flex flex-col items-center my-2 space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Algo: {algorithm} <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {algorithmNames.map((algo) => (
              <DropdownMenuItem key={algo} onSelect={() => setAlgorithm(algo)}>
                {algo}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center space-x-2">
          <Switch
            id="allow-diagonals-switch"
            checked={allowDiagonals}
            onClick={() => setAllowDiagonals(!allowDiagonals)}
          />
          <Label htmlFor="allow-diagonals-switch">Allow Diagonals</Label>
        </div>
        <Button variant="secondary" onClick={handleGenerateMaze}>
          Generate Maze
        </Button>
        <Button variant="destructive" onClick={handleReset}>
          Reset
        </Button>
        <HoverCard>
          <HoverCardTrigger asChild>
            <CircleHelp />
          </HoverCardTrigger>
          <HoverCardContent>
            <p>
              You can drag and drop the source and destination nodes. Also click to toggle nodes.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <Label>Path Length: {pathLength}</Label> &nbsp;&nbsp;|&nbsp;&nbsp;
        <Label>Cells Checked: {cellsChecked}</Label>
      </div>
      <div className="mb-4">
        <SimpleGrid
          grid={grid}
          toggleCell={toggleCell}
          cellSize={cellSize}
          gap={GAP_SIZE}
          colors={colorMapping}
          onDragStart={handleDragStart}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onTouchStart={handleTouchStart}
          draggableValues={[COLORS.source, COLORS.dest]}
          cellClassName="rounded-full"
          draggedCell={draggedCell}
        />
      </div>
    </div>
  )
}

export { PathFinding }
