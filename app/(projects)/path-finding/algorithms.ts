import { isInBounds } from '@/lib/simple-grid/utils'
import { PriorityQueue, Queue } from 'typescript-collections'
import { COLORS } from './legend'

interface IPathFindingAlgorithm {
  (props: { grid: number[][]; colors: typeof COLORS; directions: number[][] }): {
    pathLength: number
    cellsChecked: number
  }
}

export const runBFS: IPathFindingAlgorithm = ({ grid, colors, directions }) => {
  const [source, dest] = locateSourceAndDest(grid, colors)
  clearPathRun(grid, colors)

  if (source.length === 0 || dest.length === 0) {
    return { pathLength: 0, cellsChecked: 0 }
  }

  const queue = new Queue<number[]>() // [i, j]
  const parents: { [key: string]: number[] } = {}
  let cellsChecked = 0

  queue.enqueue(source)

  while (!queue.isEmpty()) {
    const [i, j] = queue.dequeue() as number[]
    cellsChecked++

    for (const [di, dj] of directions) {
      const nI = i + di
      const nJ = j + dj
      if (isInBounds(nI, nJ, grid.length, grid[0].length)) {
        if (grid[nI][nJ] === colors.empty) {
          grid[nI][nJ] = colors.explored
          queue.enqueue([nI, nJ])
          parents[coordsToKey(nI, nJ)] = [i, j]
        } else if (grid[nI][nJ] === colors.dest) {
          parents[coordsToKey(nI, nJ)] = [i, j]
          const pathLength = backtrackPath(grid, parents, dest)
          return { pathLength, cellsChecked }
        }
      }
    }
  }
  return { pathLength: 0, cellsChecked }
}

export const runDFS: IPathFindingAlgorithm = ({ grid, colors, directions }) => {
  const [source, dest] = locateSourceAndDest(grid, colors)
  clearPathRun(grid, colors)

  if (source.length === 0 || dest.length === 0) {
    return { pathLength: 0, cellsChecked: 0 }
  }

  const parents: { [key: string]: number[] } = {}
  let cellsChecked = 0

  const dfs = (i: number, j: number): boolean => {
    if (grid[i][j] !== colors.source) {
      grid[i][j] = colors.explored
    }
    cellsChecked++

    for (const [dI, dJ] of directions) {
      const nI = i + dI
      const nJ = j + dJ
      if (isInBounds(nI, nJ, grid.length, grid[0].length)) {
        if (grid[nI][nJ] === colors.empty) {
          const found = dfs(nI, nJ)
          if (found) {
            parents[coordsToKey(nI, nJ)] = [i, j]
            return true
          }
        } else if (grid[nI][nJ] === colors.dest) {
          parents[coordsToKey(nI, nJ)] = [i, j]
          return true
        }
      }
    }
    return false
  }

  if (dfs(source[0], source[1])) {
    const pathLength = backtrackPath(grid, parents, dest)
    return { pathLength, cellsChecked }
  }
  return { pathLength: 0, cellsChecked }
}

export const runAStar: IPathFindingAlgorithm = ({ grid, colors, directions }) => {
  const [source, dest] = locateSourceAndDest(grid, colors)
  clearPathRun(grid, colors)

  if (source.length === 0 || dest.length === 0) {
    return { pathLength: 0, cellsChecked: 0 }
  }

  const parents: { [key: string]: number[] } = {}
  const pq = new PriorityQueue<{ key: string; fScore: number }>((a, b) => b.fScore - a.fScore) // min heap
  const gScore: { [key: string]: number } = {}
  const fScore: { [key: string]: number } = {}
  let cellsChecked = 0

  const sourceKey = coordsToKey(source[0], source[1])
  const destKey = coordsToKey(dest[0], dest[1])

  gScore[sourceKey] = 0
  fScore[sourceKey] = heuristic(source[0], source[1], dest)
  pq.enqueue({ key: sourceKey, fScore: fScore[sourceKey] })

  while (!pq.isEmpty()) {
    const node = pq.dequeue()
    if (!node) {
      break
    }
    const current = node.key
    cellsChecked++

    if (current === destKey) {
      const pathLength = backtrackPath(grid, parents, dest)
      return { pathLength, cellsChecked }
    }

    const [currentI, currentJ] = keyToCoords(current)

    for (const [dI, dJ] of directions) {
      const nI = currentI + dI
      const nJ = currentJ + dJ
      if (!isInBounds(nI, nJ, grid.length, grid[0].length) || grid[nI][nJ] === colors.wall) {
        continue
      }

      const neighborKey = coordsToKey(nI, nJ)
      const tentativeGScore = gScore[current] + 1

      if (tentativeGScore < (gScore[neighborKey] || Infinity)) {
        parents[neighborKey] = [currentI, currentJ]
        gScore[neighborKey] = tentativeGScore
        fScore[neighborKey] = gScore[neighborKey] + heuristic(nI, nJ, dest)
        pq.enqueue({ key: neighborKey, fScore: fScore[neighborKey] })

        if (grid[nI][nJ] !== colors.source && grid[nI][nJ] !== colors.dest) {
          grid[nI][nJ] = colors.explored
        }
      }
    }
  }
  return { pathLength: 0, cellsChecked }
}

class MazeBuilder {
  width: number
  height: number
  cols: number
  rows: number
  grid: number[][]

  constructor(grid: number[][], colors: typeof COLORS) {
    this.grid = grid
    this.height = Math.floor((grid.length - 1) / 2)
    this.width = Math.floor((grid[0].length - 1) / 2)
    this.cols = 2 * this.width + 1
    this.rows = 2 * this.height + 1

    // Initialize the grid with empty cells
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = colors.empty
      }
    }

    // Place initial walls
    this.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        switch (r) {
          case 0:
          case this.rows - 1:
            this.grid[r][c] = colors.wall
            break
          default:
            if (r % 2 === 1) {
              if (c === 0 || c === this.cols - 1) {
                this.grid[r][c] = colors.wall
              }
            } else if (c % 2 === 0) {
              this.grid[r][c] = colors.wall
            }
        }
      })

      if (r === 0) {
        // Place exit in top row
        const doorPos = this.posToSpace(this.rand(1, this.width))
        this.grid[r][doorPos] = colors.dest
      }

      if (r === this.rows - 1) {
        // Place entrance in bottom row
        const doorPos = this.posToSpace(this.rand(1, this.width))
        this.grid[r][doorPos] = colors.source
      }
    })

    // Start partitioning
    this.partition(1, this.height - 1, 1, this.width - 1, colors)
  }

  rand(min: number, max: number): number {
    return min + Math.floor(Math.random() * (1 + max - min))
  }

  posToSpace(x: number): number {
    return 2 * (x - 1) + 1
  }

  posToWall(x: number): number {
    return 2 * x
  }

  inBounds(r: number, c: number): boolean {
    return r >= 0 && r < this.rows && c >= 0 && c < this.cols
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  partition(r1: number, r2: number, c1: number, c2: number, colors: typeof COLORS): void {
    if (r2 < r1 || c2 < c1) return

    let horiz: number, vert: number, x: number, y: number, start: number, end: number

    if (r1 === r2) {
      horiz = r1
    } else {
      x = r1 + 1
      y = r2 - 1
      start = Math.round(x + (y - x) / 4)
      end = Math.round(x + (3 * (y - x)) / 4)
      horiz = this.rand(start, end)
    }

    if (c1 === c2) {
      vert = c1
    } else {
      x = c1 + 1
      y = c2 - 1
      start = Math.round(x + (y - x) / 3)
      end = Math.round(x + (2 * (y - x)) / 3)
      vert = this.rand(start, end)
    }

    for (let i = this.posToWall(r1) - 1; i <= this.posToWall(r2) + 1; i++) {
      for (let j = this.posToWall(c1) - 1; j <= this.posToWall(c2) + 1; j++) {
        if (i === this.posToWall(horiz) || j === this.posToWall(vert)) {
          this.grid[i][j] = colors.wall
        }
      }
    }

    const gaps = this.shuffle([true, true, true, false])

    // Create gaps in partition walls
    if (gaps[0]) {
      const gapPosition = this.rand(c1, vert)
      this.grid[this.posToWall(horiz)][this.posToSpace(gapPosition)] = colors.empty
    }

    if (gaps[1]) {
      const gapPosition = this.rand(vert + 1, c2 + 1)
      this.grid[this.posToWall(horiz)][this.posToSpace(gapPosition)] = colors.empty
    }

    if (gaps[2]) {
      const gapPosition = this.rand(r1, horiz)
      this.grid[this.posToSpace(gapPosition)][this.posToWall(vert)] = colors.empty
    }

    if (gaps[3]) {
      const gapPosition = this.rand(horiz + 1, r2 + 1)
      this.grid[this.posToSpace(gapPosition)][this.posToWall(vert)] = colors.empty
    }

    // Recursively partition newly created chambers
    this.partition(r1, horiz - 1, c1, vert - 1, colors)
    this.partition(horiz + 1, r2, c1, vert - 1, colors)
    this.partition(r1, horiz - 1, vert + 1, c2, colors)
    this.partition(horiz + 1, r2, vert + 1, c2, colors)
  }
}

export const generateMaze = (grid: number[][], colors: typeof COLORS): void => {
  new MazeBuilder(grid, colors)
}

const backtrackPath = (
  grid: number[][],
  parents: { [key: string]: number[] },
  dest: number[]
): number => {
  let curr = parents[coordsToKey(dest[0], dest[1])]
  let pathLength = 0
  while (grid[curr[0]][curr[1]] !== COLORS.source) {
    const [i, j] = curr
    grid[i][j] = COLORS.path
    curr = parents[coordsToKey(i, j)]
    pathLength++
  }
  return pathLength
}

const locateSourceAndDest = (grid: number[][], colors: typeof COLORS): [number[], number[]] => {
  let source: number[] = []
  let dest: number[] = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === colors.source) {
        source = [i, j]
      } else if (grid[i][j] === colors.dest) {
        dest = [i, j]
      }
    }
  }
  return [source, dest]
}

const clearPathRun = (grid: number[][], colors: typeof COLORS) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === colors.explored || grid[i][j] === colors.path) {
        grid[i][j] = colors.empty
      }
    }
  }
}

// heuristic function for AStar, cherbyshev
const heuristic = (i: number, j: number, dest: number[]): number => {
  return Math.max(Math.abs(i - dest[0]), Math.abs(j - dest[1]))
}

const coordsToKey = (i: number, j: number): string => `${i}-${j}`
const keyToCoords = (key: string): number[] => key.split('-').map(Number)
